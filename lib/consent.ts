export type ConsentCategories = 'necessary' | 'preferences' | 'analytics' | 'performance' | 'ads';

export type ConsentState = Record<ConsentCategories, boolean> & {
  version: number;
  updatedAt: string;
};

const COOKIE_NAME = 'consent_status';
const COOKIE_MAX_AGE_DAYS = 365;

export function defaultConsent(): ConsentState {
  return {
    necessary: true,
    preferences: false,
    analytics: false,
    performance: false,
    ads: false,
    version: 1,
    updatedAt: new Date().toISOString(),
  };
}

export function detectGPC(): boolean {
  try {
    return typeof navigator !== 'undefined' && (navigator as any).globalPrivacyControl === true;
  } catch {
    return false;
  }
}

export function readConsent(): ConsentState | null {
  if (typeof document === 'undefined') return null;
  const raw = document.cookie.split('; ').find((c) => c.startsWith(COOKIE_NAME + '='));
  if (!raw) return null;
  try {
    const value = decodeURIComponent(raw.split('=')[1]);
    const parsed = JSON.parse(value);
    // Minimal validation
    if (parsed && typeof parsed === 'object' && 'necessary' in parsed) {
      return parsed as ConsentState;
    }
  } catch {}
  return null;
}

export function writeConsent(state: ConsentState) {
  if (typeof document === 'undefined') return;
  const expires = new Date(Date.now() + COOKIE_MAX_AGE_DAYS * 24 * 60 * 60 * 1000).toUTCString();
  const value = encodeURIComponent(JSON.stringify(state));
  // Path=/ to make it accessible site-wide
  const secure = typeof location !== 'undefined' && location.protocol === 'https:' ? '; Secure' : '';
  document.cookie = `${COOKIE_NAME}=${value}; Expires=${expires}; Path=/; SameSite=Lax${secure}`;
}

export function removeNonEssentialCookies() {
  if (typeof document === 'undefined') return;
  const cookiePairs = document.cookie.split('; ').filter(Boolean);
  const nowPast = 'Thu, 01 Jan 1970 00:00:00 GMT';
  const toRemovePrefixes = [
    '_ga', '_gid', '__stripe_', 'sb-', 'vercel', 'clerk', 'analytics', 'g_state', 'amplitude',
  ];
  cookiePairs.forEach((pair) => {
    const name = pair.split('=')[0];
    if (toRemovePrefixes.some((p) => name.startsWith(p))) {
      // Try remove on current domain and parent domain
      document.cookie = `${name}=; Expires=${nowPast}; Path=/;`;
      const hostParts = location.hostname.split('.');
      if (hostParts.length > 2) {
        const parent = hostParts.slice(-2).join('.');
        document.cookie = `${name}=; Expires=${nowPast}; Path=/; Domain=.${parent};`;
      }
    }
  });
}

export function broadcastConsent(state: ConsentState) {
  if (typeof window === 'undefined') return;
  (window as any).__consent__ = state;
  window.dispatchEvent(new CustomEvent('consent:updated', { detail: state }));
}
