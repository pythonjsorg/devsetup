/**
 * Optional inline snippet that flips `data-theme` on <html> as early as
 * possible, before React hydration — prevents a FOUC on theme change.
 *
 * Drop into <head> via `dangerouslySetInnerHTML` or inline <script> in
 * layout.tsx (already wired in the provided layout.tsx).
 */
const THEME_BG: Record<string, string> = {
  paper:  '#f4ede0',
  carbon: '#0e0f13',
  cobalt: '#eef1f6',
}

export function setThemeColor(theme: string) {
  const meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')
  if (meta) meta.content = THEME_BG[theme] ?? THEME_BG.paper
}

export const themeBootScript = `
(function() {
  var bg = { paper: '#f4ede0', carbon: '#0e0f13', cobalt: '#eef1f6' };
  try {
    var t = localStorage.getItem('devsetup-theme');
    if (t === 'paper' || t === 'carbon' || t === 'cobalt') {
      document.documentElement.setAttribute('data-theme', t);
      var m = document.querySelector('meta[name="theme-color"]');
      if (m) m.content = bg[t];
    }
  } catch (_) {}
})();
`
