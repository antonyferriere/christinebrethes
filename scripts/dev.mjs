import { watch } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { resolve, join } from 'node:path';
import { homedir } from 'node:os';
import { spawn } from 'node:child_process';
import { startPreview } from './preview.mjs';

// A fresh process on each build avoids cached ESM templates and data.
const clients = new Set();
let version = Date.now(), timer, running, pending = false, child, stopped = false;
const notify = () => clients.forEach(response => response.write(`data: ${version}\n\n`));
function runBuild() {
  return new Promise(resolveBuild => {
    child = spawn(process.execPath, ['scripts/build.mjs'], { stdio: 'inherit' });
    child.once('error', error => { console.error(error.message); resolveBuild(false); });
    child.once('exit', code => resolveBuild(code === 0));
  });
}
function rebuild() {
  pending = true;
  if (running) return running;
  running = (async () => {
    while (pending && !stopped) {
      pending = false;
      console.log('Reconstruction du site…');
      if (await runBuild()) { version++; notify(); }
      else console.error('Build échoué : corrigez le fichier puis enregistrez-le pour réessayer.');
    }
  })().finally(() => { running = undefined; });
  return running;
}
const watchers = ['src', 'public', 'scripts'].map(directory => {
  const watcher = watch(resolve(directory), { recursive: true }, (_, filename) => {
    if (directory === 'scripts' && String(filename) !== 'build.mjs') return;
    clearTimeout(timer);
    timer = setTimeout(rebuild, 150);
  });
  watcher.on('error', error => console.error(`Surveillance de ${directory} : ${error.message}`));
  return watcher;
});
let tls;
try {
  if (process.argv.includes('--https')) {
    const directory = join(homedir(), '.certs');
    tls = { cert: await readFile(join(directory, 'localhost.pem')), key: await readFile(join(directory, 'localhost-key.pem')) };
  }
} catch (error) {
  watchers.forEach(watcher => watcher.close());
  console.error(`Certificats HTTPS introuvables dans ${join(homedir(), '.certs')}. Utilisez npm run dev pour HTTP.\n${error.message}`);
  process.exit(1);
}
await rebuild();
const clientScript = `let version; const events = new EventSource('/__dev/events'); events.onmessage = event => { if (version !== undefined && version !== event.data) location.reload(); version = event.data; };`;
const server = startPreview({
  port: Number(process.env.PORT || 4173), tls,
  beforeRead: async () => { while (running) await running; },
  transformHtml: html => html.replace('</body>', '<script src="/__dev/client.js"></script></body>'),
  handleRequest(path, request, response) {
    if (path === '/__dev/client.js') {
      response.writeHead(200, { 'Content-Type': 'text/javascript', 'Cache-Control': 'no-store' });
      response.end(clientScript); return true;
    }
    if (path !== '/__dev/events') return false;
    response.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive' });
    clients.add(response); response.write(`data: ${version}\n\n`);
    request.on('close', () => clients.delete(response)); return true;
  },
});
const heartbeat = setInterval(() => clients.forEach(response => response.write(': heartbeat\n\n')), 15000);
function stop() {
  stopped = true; clearTimeout(timer); clearInterval(heartbeat);
  watchers.forEach(watcher => watcher.close()); child?.kill();
  clients.forEach(response => response.end()); server.close(); server.closeAllConnections();
}
server.on('error', error => { console.error(error.message); stop(); process.exitCode = 1; });
process.on('SIGINT', stop); process.on('SIGTERM', stop);
console.log('Surveillance active : src/, public/ et scripts/build.mjs. Enregistrez un fichier pour actualiser le navigateur.');
