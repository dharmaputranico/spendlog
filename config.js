/* =============================================
   spend.log — config.js
   Auto-switches between staging and production
   based on the current hostname.
   ============================================= */

(function() {
  const host = window.location.hostname;

  const isStaging =
    host === 'staging.spendlog.id' ||
    host.includes('staging') ||
    host.includes('localhost') ||
    host.includes('127.0.0.1');

  // ── PRODUCTION ──────────────────────────────
  const PROD = {
    url:  'https://wpnsxvpjxfyevrdxqiln.supabase.co',
    key:  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndwbnN4dnBqeGZ5ZXZyZHhxaWxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc3MDA2MzMsImV4cCI6MjA5MzI3NjYzM30.zNKyyLipYPlCy82RRS66yy5ApqS8t_feNEx_xDnnWu0',
    authUrl: 'https://auth.spendlog.id',
  };

  // ── STAGING ─────────────────────────────────
  // Replace these with your staging Supabase project credentials
  const STAGING = {
    url:     'https://YOUR_STAGING_REF.supabase.co',  // ← replace
    key:     'YOUR_STAGING_ANON_KEY',                 // ← replace
    authUrl: 'https://YOUR_STAGING_REF.supabase.co',  // no custom domain for staging
  };

  const cfg = isStaging ? STAGING : PROD;

  window.SPENDLOG_CONFIG = {
    supabaseUrl:     cfg.url,
    supabaseKey:     cfg.key,
    supabaseAuthUrl: cfg.authUrl,
    isStaging,
  };

  // Show staging banner so you always know which env you're on
  if (isStaging) {
    document.addEventListener('DOMContentLoaded', () => {
      const banner = document.createElement('div');
      banner.style.cssText = `
        position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
        background: #BA7517; color: white; text-align: center;
        font-size: 11px; font-family: 'DM Mono', monospace;
        padding: 4px; letter-spacing: .5px;
      `;
      banner.textContent = '⚠ STAGING — test data only, not production';
      document.body.prepend(banner);
    });
  }
})();
