import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

async function until(check) {
  for (let i = 0; i < 200; i++) { if (await check()) return; await delay(50); }
  throw new Error('Le serveur de développement ne répond pas dans le délai attendu.');
}
test('development rebuilds, signals reload, recovers from errors and leaves dist clean', { timeout: 25000 }, async () => {
  const root = await mkdtemp(join(tmpdir(), 'christine-dev-'));
  for (const name of ['src', 'public', 'scripts']) await mkdir(join(root, name));
  await writeFile(join(root, 'src/message.txt'), 'Initial');
  await writeFile(join(root, 'scripts/build.mjs'), `import {readFile,mkdir,writeFile} from 'node:fs/promises';
const text=await readFile('src/message.txt','utf8');
if(text==='ERROR') throw Error('fixture build error');
await mkdir('dist',{recursive:true});
await writeFile('dist/index.html','<html><body>'+text+'</body></html>');`);
  const processDev = spawn(process.execPath, [resolve('scripts/dev.mjs')], { cwd: root, env: { ...process.env, PORT: '0' }, stdio: ['ignore', 'pipe', 'pipe'] });
  let output = ''; processDev.stdout.on('data', value => output += value); processDev.stderr.on('data', value => output += value);
  let reader;
  try {
    await until(() => /localhost:\d+/.test(output));
    const url = 'http://127.0.0.1:' + output.match(/localhost:(\d+)/)[1];
    const page = await fetch(url);
    assert.equal(page.headers.get('cache-control'), 'no-store');
    assert.match(await page.text(), /Initial.*__dev\/client.js/);
    assert.match(await (await fetch(url + '/__dev/client.js')).text(), /location.reload\(\)/);
    reader = (await fetch(url + '/__dev/events')).body.getReader();
    const first = new TextDecoder().decode((await reader.read()).value);
    await writeFile(join(root, 'src/message.txt'), 'Updated');
    await until(async () => (await readFile(join(root, 'dist/index.html'), 'utf8')).includes('Updated'));
    const next = new TextDecoder().decode((await reader.read()).value);
    assert.notEqual(next, first);
    assert.match(await (await fetch(url)).text(), /Updated/);
    assert.doesNotMatch(await readFile(join(root, 'dist/index.html'), 'utf8'), /__dev/);
    await writeFile(join(root, 'src/message.txt'), 'ERROR');
    await until(() => output.includes('Build échoué'));
    await writeFile(join(root, 'src/message.txt'), 'Recovered');
    await until(async () => (await readFile(join(root, 'dist/index.html'), 'utf8')).includes('Recovered'));
    const count = () => output.split('Reconstruction du site').length;
    let previous = count();
    await writeFile(join(root, 'public/new.txt'), 'Asset');
    await until(() => count() > previous);
    await delay(200); previous = count();
    await rm(join(root, 'public/new.txt'));
    await until(() => count() > previous);
  } finally {
    await reader?.cancel();
    processDev.kill();
    await new Promise(resolveExit => { if (processDev.exitCode !== null) resolveExit(); else processDev.once('exit', resolveExit); });
    await rm(root, { recursive: true, force: true });
  }
});
