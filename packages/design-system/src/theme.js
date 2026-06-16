/* ============================================================
   @pythonjs/design-system/theme
   Framework-agnostic theme contract shared by every pythonjs site/zone.

   Contract: data-theme="light|dark" on <html>, persisted at
   localStorage["pyjs.theme"], defaulting to prefers-color-scheme.
   Works in Astro, Next.js, or plain HTML — it only touches the DOM.
   ============================================================ */

export const THEME_KEY = 'pyjs.theme';
export const THEME_BG = { light: '#f5efe8', dark: '#14100c' };

/**
 * Inline this string in <head> BEFORE any paint to avoid a flash of the
 * wrong theme (FOUC). It sets data-theme and the theme-color meta.
 *   Astro:  <script is:inline set:html={THEME_BOOT_SCRIPT} />
 *   Next:   <script dangerouslySetInnerHTML={{ __html: THEME_BOOT_SCRIPT }} />
 *   HTML:   <script>{THEME_BOOT_SCRIPT}</script>
 */
export const THEME_BOOT_SCRIPT =
  "(function(){var d=document.documentElement;try{var t=localStorage.getItem('pyjs.theme');" +
  "if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}" +
  "d.setAttribute('data-theme',t);var m=document.querySelector('meta[name=\\\"theme-color\\\"]');" +
  "if(m)m.content=(t==='dark'?'#14100c':'#f5efe8');}catch(e){}})();";

/** Resolve the theme to use on first load (stored → system preference). */
export function getInitialTheme() {
  try {
    const t = localStorage.getItem(THEME_KEY);
    if (t === 'light' || t === 'dark') return t;
  } catch (e) {}
  return typeof matchMedia !== 'undefined' &&
    matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

/** Set the theme: updates <html>, localStorage, and the theme-color meta. */
export function applyTheme(theme) {
  const d = document.documentElement;
  d.setAttribute('data-theme', theme);
  try { localStorage.setItem(THEME_KEY, theme); } catch (e) {}
  const m = document.querySelector('meta[name="theme-color"]');
  if (m) m.setAttribute('content', THEME_BG[theme] || THEME_BG.light);
}

/**
 * Flip light↔dark. If a click event is passed and the browser supports it,
 * animates a circular View-Transition reveal from the cursor (needs the
 * .vt-clip rules in base.css). Honors prefers-reduced-motion.
 */
export function toggleTheme(event) {
  const d = document.documentElement;
  const next = d.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (event) {
    d.style.setProperty('--vt-x', event.clientX + 'px');
    d.style.setProperty('--vt-y', event.clientY + 'px');
  }
  if (document.startViewTransition && !reduced) {
    d.classList.add('vt-clip');
    const vt = document.startViewTransition(() => applyTheme(next));
    vt.finished.finally(() => d.classList.remove('vt-clip'));
  } else {
    applyTheme(next);
  }
  return next;
}

/**
 * Wire up a toggle button (vanilla). Pass a selector or element.
 * Returns a cleanup function that removes the listener.
 */
export function initThemeToggle(target) {
  const btn = typeof target === 'string' ? document.querySelector(target) : target;
  if (!btn) return () => {};
  const handler = (e) => { toggleTheme(e); };
  btn.addEventListener('click', handler);
  return () => btn.removeEventListener('click', handler);
}
