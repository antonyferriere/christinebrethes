import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { pathToFileURL } from 'node:url';

export function deploymentUrl(value) {
  const url = new URL(value);
  assert.ok(url.protocol === 'https:' && url.pathname === '/' && !url.search && !url.hash && !url.username && !url.password,
    'Deployment URL must be an HTTPS origin without credentials, path or query.');
  return url;
}

const mimeTypes = {
  '.html': ['text/html'], '.css': ['text/css'],
  '.js': ['text/javascript', 'application/javascript'],
  '.mjs': ['text/javascript', 'application/javascript'],
  '.woff': ['font/woff', 'application/font-woff'], '.woff2': ['font/woff2'],
};

async function filesIn(directory, prefix = '') {
  const entries = await readdir(directory, { withFileTypes: true });
  return (await Promise.all(entries.map(entry => entry.isDirectory()
    ? filesIn(resolve(directory, entry.name), `${prefix}${entry.name}/`)
    : `${prefix}${entry.name}`))).flat();
}

export async function verifyDeployment(value, { request = fetch, directory = resolve('dist') } = {}) {
  const base = deploymentUrl(value);
  // Native fetch validates TLS certificates. Never disable that validation.
  const get = url => request(url, { redirect: 'manual', signal: AbortSignal.timeout(15000), headers: { 'Cache-Control': 'no-cache' } });
  const http = new URL('contact/?deployment-check=1', base);
  http.protocol = 'http:';
  const redirect = await get(http);
  assert.ok([301, 308].includes(redirect.status), 'HTTP must permanently redirect to HTTPS.');
  assert.equal(new URL(redirect.headers.get('location'), http).href,
    new URL('contact/?deployment-check=1', base).href, 'HTTPS redirect must preserve host, path and query.');
  await redirect.body?.cancel();

  // This legacy page is intentionally redirected by Apache. Check every supported
  // spelling explicitly; Contact itself is still verified byte-for-byte below.
  for (const path of ['rendez-vous', 'rendez-vous/', 'rendez-vous/index.html']) {
    const source = new URL(`${path}?deployment-check=1`, base);
    const response = await get(source);
    assert.ok([301, 308].includes(response.status), `${path}: expected permanent redirect to Contact`);
    assert.ok(response.headers.get('location'), `${path}: missing redirect location`);
    assert.equal(new URL(response.headers.get('location'), source).href,
      new URL('contact/?deployment-check=1', base).href, `${path}: incorrect redirect destination`);
    await response.body?.cancel();
  }

  const files = (await filesIn(directory)).filter(file => mimeTypes[extname(file)] && file !== 'rendez-vous/index.html');
  for (const file of files) {
    const path = file.replace(/(^|\/)index\.html$/, '$1');
    const response = await get(new URL(path, base));
    assert.equal(response.status, 200, `${file}: HTTP status`);
    const mime = response.headers.get('content-type')?.split(';')[0].trim().toLowerCase();
    assert.ok(mimeTypes[extname(file)].includes(mime), `${file}: invalid MIME type ${mime}`);
    assert.equal(response.headers.get('x-content-type-options'), 'nosniff', `${file}: missing nosniff`);
    if (/\.(html|css|m?js)$/.test(file)) {
      assert.match(response.headers.get('cache-control') ?? '', /\bno-cache\b/, `${file}: stale-cache protection missing`);
    }
    if (file.endsWith('.html')) {
      const csp = response.headers.get('content-security-policy') ?? '';
      for (const directive of ["default-src 'self'", "script-src 'self'", "style-src 'self'", "font-src 'self'", "object-src 'none'", "frame-ancestors 'none'"]) {
        assert.ok(csp.split(';').map(part => part.trim()).includes(directive), `${file}: missing CSP ${directive}`);
      }
    }
    assert.ok(Buffer.from(await response.arrayBuffer()).equals(await readFile(resolve(directory, file))),
      `${file}: deployed content differs from build (cache, wrong directory, incomplete transfer or injected content).`);
  }
  const missing = await get(new URL('__deployment_missing_page__', base));
  assert.equal(missing.status, 404, 'Missing pages must return HTTP 404.');
  await missing.body?.cancel();
  const state = await get(new URL('.ftp-deploy-sync-state.json', base));
  assert.ok([403, 404].includes(state.status), 'FTP inventory must not be publicly accessible.');
  await state.body?.cancel();
  return files.length;
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try {
    const count = await verifyDeployment(process.argv[2]);
    console.log(`HTTPS, redirect, MIME, CSP and deployed content verified (${count} files).`);
  } catch (error) {
    console.error(error.message);
    if (error.cause) console.error(error.cause.message);
    process.exitCode = 1;
  }
}
