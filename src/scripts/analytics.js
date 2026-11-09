import { currentConsent, readPrivacyConfig, clearAnalyticsCookies, CONSENT_EVENT, CONSENT_KEY, deniedState } from './consent-state.js';
const publicPaths = new Set(['/', '/accompagnements/', '/a-propos/', '/contact/', '/mentions-legales/', '/confidentialite/', '/entreprises-organisations/', '/accompagnements/coaching-professionnel/', '/accompagnements/sante-travail/', '/accompagnements/pleine-conscience/']);
export function safePath(path) { return publicPaths.has(path) ? path : '/404/'; }
export function interaction(url, origin) {
  if (url.protocol === 'tel:') return 'phone_click';
  if (url.protocol === 'mailto:') return 'email_click';
  if (url.origin === origin && url.pathname === '/contact/') return 'contact_click';
  if (url.hostname === 'www.crenolibre.fr' && url.pathname.startsWith('/prendre-rdv/')) return 'booking_click';
  return null;
}
export function initializeAnalytics() {
  const config = readPrivacyConfig();
  if (!config.id) return;
  if (window.__cbAnalytics) return;
  window.__cbAnalytics = true;
  const disableKey = 'ga-disable-' + config.id;
  let loaded = false, timer, lastPage = '';
  const allowed = () => currentConsent()?.analytics === true;
  function command() { window.dataLayer.push(arguments); }
  const pageLocation = () => location.origin + safePath(location.pathname);
  function track(name) {
    if (!loaded || !allowed()) return;
    command('event', name, { page_location: pageLocation(), page_referrer: '', page_title: safePath(location.pathname), ...(config.debug ? { debug_mode: true } : {}) });
  }
  function pageView() {
    const path = safePath(location.pathname);
    if (path === lastPage) return;
    if (!allowed()) return;
    lastPage = path; track('page_view');
  }
  function synchronize() {
    clearTimeout(timer);
    if (!allowed()) {
      window[disableKey] = true;
      clearAnalyticsCookies();
      if (loaded) {
        // No denied ping: unload the library after persisting the refusal.
        window.dataLayer = [];
        document.getElementById('cb-ga-script')?.remove();
        loaded = false;
        location.reload();
      }
      return;
    }
    timer = setTimeout(synchronize, Math.min(currentConsent().expires - Date.now() + 10, 2147483647));
    window[disableKey] = false;
    if (loaded) return;
    loaded = true;
    window.dataLayer = [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    command('consent', 'default', deniedState);
    command('consent', 'update', { ...deniedState, analytics_storage: 'granted' });
    command('set', { page_location: pageLocation(), page_referrer: '', page_title: safePath(location.pathname) });
    command('js', new Date());
    command('config', config.id, { send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false, cookie_expires: 15552000, cookie_update: false });
    pageView();
    const script = document.createElement('script');
    script.id = 'cb-ga-script'; script.async = true; script.referrerPolicy = 'no-referrer';
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + config.id;
    document.head.append(script);
  }
  window.addEventListener(CONSENT_EVENT, synchronize);
  window.addEventListener('storage', event => { if (event.key === CONSENT_KEY || event.key === null) synchronize(); });
  window.addEventListener('pageshow', synchronize);
  document.addEventListener('visibilitychange', synchronize);
  // Static multi-page site: each document emits one page view. Future router
  // integrations can dispatch cb:navigation after the pathname changes.
  window.addEventListener('cb:navigation', pageView);
  window.addEventListener('popstate', pageView);
  document.addEventListener('click', event => {
    const anchor = event.target.closest?.('a[href]'); if (!anchor) return;
    const name = interaction(new URL(anchor.href, location.origin), location.origin);
    if (name) track(name);
  });
  // Only a confirmed server success may dispatch this event. A mailto is not one.
  window.addEventListener('cb:contact-success', () => track('contact_success'));
  synchronize();
}
if (typeof document !== 'undefined') initializeAnalytics();
