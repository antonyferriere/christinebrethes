export function privacyConfig(env = process.env, production = false) {
  const development = !production && env.ANALYTICS_ENV === 'development';
  const value = development ? env.GA_DEV_MEASUREMENT_ID : env.GA_MEASUREMENT_ID;
  return {
    id: /^G-[A-Z0-9]{10}$/.test(value || '') ? value : '',
    preview: !production && env.CONSENT_PREVIEW === 'true',
    debug: development && env.GA_DEBUG === 'true',
  };
}
