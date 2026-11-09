export const CONSENT_KEY = 'cb-consent-v1';
export const CONSENT_EVENT = 'cb:consent';
export const deniedState = Object.freeze({ analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
export function readConsent(storage, now = Date.now()) {
  try {
    const item = JSON.parse(storage.getItem(CONSENT_KEY));
    if (item?.version !== 1 || typeof item.analytics !== 'boolean' || !Number.isFinite(item.expires) || !Number.isFinite(item.created) || item.created > now || item.expires <= now) return null;
    const max = new Date(item.created); max.setUTCMonth(max.getUTCMonth() + 6);
    return item.expires <= max.getTime() ? item : null;
  } catch { return null; }
}
export function makeConsent(analytics, now = Date.now()) {
  const expires = new Date(now); expires.setUTCMonth(expires.getUTCMonth() + 6);
  return { version: 1, analytics: analytics === true, created: now, expires: expires.getTime() };
}
let memory = null;
function storage() { try { return window.localStorage; } catch { return null; } }
export function currentConsent() {
  let value;
  try { value = storage()?.getItem(CONSENT_KEY); } catch { /* Memory fallback. */ }
  return readConsent({ getItem: () => value ?? JSON.stringify(memory) });
}
export function saveConsent(analytics) {
  memory = makeConsent(analytics);
  try { storage()?.setItem(CONSENT_KEY, JSON.stringify(memory)); } catch { /* Choice still applies to this page. */ }
  if (!memory.analytics) clearAnalyticsCookies();
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT));
  return memory;
}
export function clearAnalyticsCookies() {
  const paths = new Set(['/']);
  const parts = location.pathname.split('/').filter(Boolean);
  while (parts.length) { paths.add('/' + parts.join('/')); paths.add('/' + parts.join('/') + '/'); parts.pop(); }
  const hosts = location.hostname.split('.'); const domains = [''];
  while (hosts.length > 1) { domains.push(hosts.join('.'), '.' + hosts.join('.')); hosts.shift(); }
  for (const cookie of document.cookie.split(';')) {
    const name = cookie.trim().split('=')[0];
    if (!/^(_ga(?:_|$)|_gid$|_gat(?:_|$))/.test(name)) continue;
    for (const path of paths) for (const domain of domains) document.cookie = `${name}=; Max-Age=0; path=${path}${domain ? '; domain=' + domain : ''}; SameSite=Lax`;
  }
}
export function readPrivacyConfig() {
  const data = document.querySelector('meta[name="site-privacy"]')?.dataset || {};
  return { id: /^G-[A-Z0-9]{10}$/.test(data.gaId || '') ? data.gaId : '', preview: data.preview === 'true', debug: data.debug === 'true' };
}
