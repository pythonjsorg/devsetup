/**
 * Inline snippet that sets `data-theme` on <html> before React hydration —
 * prevents a FOUC. Wired into <head> via dangerouslySetInnerHTML in layout.tsx.
 *
 * Shared pythonjs.org theme contract: light | dark, key `pyjs.theme`,
 * default from prefers-color-scheme. Matches the Astro site's boot script.
 */
const THEME_BG: Record<string, string> = {
  light: '#f5efe8',
  dark: '#14100c',
}

export function setThemeColor(theme: string) {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (meta) meta.content = THEME_BG[theme] ?? THEME_BG.light
}

export const themeBootScript = `
(function() {
  var bg = { light: '#f5efe8', dark: '#14100c' };
  try {
    var t = localStorage.getItem('pyjs.theme');
    if (t !== 'light' && t !== 'dark') {
      t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    document.documentElement.setAttribute('data-theme', t);
    var m = document.querySelector('meta[name="theme-color"]');
    if (m) m.content = bg[t];
  } catch (_) {}
})();
`
