import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { deploymentUrl, verifyDeployment } from '../scripts/verify-deployment.mjs';

const base = 'https://preprod.example.org/';
const apache = await readFile('dist/.htaccess', 'utf8');
const csp = apache.match(/Content-Security-Policy "([^"]+)"/)[1];
function server(overrides = {}) {
  return async url => {
    if (url.protocol === 'http:') return new Response(null, { status: 301, headers: { location: url.href.replace('http:', 'https:') } });
    if (url.pathname === '/__deployment_missing_page__') return new Response(null, { status: 404 });
    if (url.pathname === '/.ftp-deploy-sync-state.json') return new Response(null, { status: overrides.stateStatus ?? 403 });
    if (/^\/rendez-vous(?:\/index\.html)?\/?$/.test(url.pathname)) {
      return new Response(null, { status: overrides.bookingStatus ?? 301,
        headers: overrides.missingLocation ? {} : { location: overrides.bookingLocation ?? `/contact/${url.search}` } });
    }
    const file = resolve('dist', '.' + url.pathname, url.pathname.endsWith('/') ? 'index.html' : '');
    const body = overrides.stale && url.pathname === '/scripts/main.js'
      ? "import './contact.mjs';" : await readFile(file);
    return new Response(body, { headers: {
      'content-type': overrides.mime ?? ({ '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.woff': 'font/woff' }[extname(file)]),
      'x-content-type-options': 'nosniff',
      'cache-control': overrides.cache ?? 'no-cache, must-revalidate',
      'content-security-policy': overrides.csp ?? csp,
    } });
  };
}

test('deployment URL rejects HTTP, credentials and subdirectories', () => {
  assert.equal(deploymentUrl(base).href, base);
  for (const value of ['http://example.org', 'https://u:p@example.org', base + 'folder/', base + '?x=1']) {
    assert.throws(() => deploymentUrl(value));
  }
});

test('deployment check accepts the actual build with valid server responses', async () => {
  assert.ok(await verifyDeployment(base, { request: server() }) >= 18);
});

test('deployment check rejects stale JS, wrong MIME, missing CSP/cache rules and exposed FTP state', async () => {
  for (const [overrides, message] of [
    [{ stale: true }, /deployed content differs/],
    [{ mime: 'text/plain' }, /invalid MIME/],
    [{ csp: "default-src *" }, /missing CSP/],
    [{ cache: 'max-age=86400' }, /stale-cache/],
    [{ stateStatus: 200 }, /inventory/],
  ]) {
    await assert.rejects(verifyDeployment(base, { request: server(overrides) }), message);
  }
});

test('deployment check rejects missing redirect and certificate failures', async () => {
  await assert.rejects(verifyDeployment(base, { request: async () => new Response('OK') }), /redirect/);
  await assert.rejects(verifyDeployment(base, { request: async () => { throw new Error('certificate expired'); } }), /certificate expired/);
});

test('Apache denies deployment inventory and revalidates stable asset names', () => {
  assert.match(apache, /<FilesMatch "\^\\\.">\s*Require all denied/);
  assert.match(apache, /Cache-Control "no-cache, must-revalidate"/);
  assert.match(apache, /upgrade-insecure-requests/);
});

test('legacy appointment URLs require a permanent redirect to Contact with the query preserved', async () => {
  assert.ok(await verifyDeployment(base, { request: server({ bookingStatus: 308 }) }));
  for (const [overrides, message] of [
    [{ bookingStatus: 200 }, /expected permanent redirect/],
    [{ bookingStatus: 302 }, /expected permanent redirect/],
    [{ missingLocation: true }, /missing redirect location/],
    [{ bookingLocation: '/contact/' }, /incorrect redirect destination/],
    [{ bookingLocation: '/rendez-vous/?deployment-check=1' }, /incorrect redirect destination/],
    [{ bookingLocation: 'https://other.example/contact/?deployment-check=1' }, /incorrect redirect destination/],
  ]) await assert.rejects(verifyDeployment(base, { request: server(overrides) }), message);
});
