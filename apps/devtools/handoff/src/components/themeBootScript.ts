/**
 * Optional inline snippet that flips `data-theme` on <html> as early as
 * possible, before React hydration — prevents a FOUC on theme change.
 *
 * Drop into <head> via `dangerouslySetInnerHTML` or inline <script> in
 * layout.tsx (already wired in the provided layout.tsx).
 */
export const themeBootScript = `
(function() {
  try {
    var t = localStorage.getItem('devsetup-theme');
    if (t === 'paper' || t === 'carbon' || t === 'cobalt') {
      document.documentElement.setAttribute('data-theme', t);
    }
  } catch (_) {}
})();
`
