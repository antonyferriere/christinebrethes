import { createServer as httpServer } from 'node:http';
import { createServer as httpsServer } from 'node:https';
import { readFile, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { pathToFileURL } from 'node:url';

const mime = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.mjs': 'text/javascript', '.webp': 'image/webp', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff': 'font/woff', '.woff2': 'font/woff2', '.xml': 'application/xml', '.txt': 'text/plain' };
export function startPreview({ port = 4173, tls, handleRequest, beforeRead = async () => {}, transformHtml = html => html } = {}) {
  const root = resolve('dist');
  const handler = async (request, response) => {
    try {
      const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
      if (handleRequest?.(pathname, request, response)) return;
      await beforeRead();
      let file = resolve(root, `.${pathname}`);
      if (file !== root && !file.startsWith(root + sep)) throw new Error('Invalid path');
      if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
      let content = await readFile(file);
      if (extname(file) === '.html') content = transformHtml(content.toString());
      response.writeHead(200, { 'Content-Type': mime[extname(file)] ?? 'application/octet-stream', 'Cache-Control': 'no-store' });
      response.end(content);
    } catch {
      response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' });
      response.end(transformHtml(await readFile(resolve(root, '404.html'), 'utf8').catch(() => 'Lancez npm run build avant la prévisualisation.')));
    }
  };
  const server = tls ? httpsServer(tls, handler) : httpServer(handler);
  server.listen(port, '127.0.0.1', () => console.log(`Aperçu local : ${tls ? 'https' : 'http'}://localhost:${server.address().port} — Ctrl+C pour arrêter.`));
  return server;
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) startPreview();
