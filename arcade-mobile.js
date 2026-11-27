// The three Arcade stages share one expansion and scroll-lock controller.
(() => {
  const stages = ['arcade-stage', 'surfers-stage', 'city-stage'].map(id => document.getElementById(id));
  let expanded = null;

  function restore() {
    if (!expanded) return;
    const { stage, button, scroll } = expanded;
    expanded = null;
    stage.classList.remove('arcade-expanded');
    button.textContent = 'Expand Game';
    button.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('arcade-scroll-locked');
    document.body.style.removeProperty('--arcade-scroll-top');
    window.scrollTo(0, scroll);
    if (document.fullscreenElement === stage) document.exitFullscreen?.().catch(() => {});
    window.dispatchEvent(new Event('resize'));
  }

  for (const stage of stages) {
    const button = stage.querySelector('[data-expand-game]');
    button.addEventListener('click', async () => {
      if (expanded?.stage === stage) { restore(); return; }
      restore();
      expanded = { stage, button, scroll: window.scrollY };
      document.body.style.setProperty('--arcade-scroll-top', -window.scrollY + 'px');
      document.body.classList.add('arcade-scroll-locked');
      stage.classList.add('arcade-expanded');
      button.textContent = 'Exit expanded mode';
      button.setAttribute('aria-expanded', 'true');
      window.dispatchEvent(new Event('resize'));
      if (window.matchMedia('(pointer: fine)').matches && document.fullscreenEnabled && stage.requestFullscreen) {
        try {
          await stage.requestFullscreen();
          if (expanded?.stage !== stage && document.fullscreenElement === stage) await document.exitFullscreen();
        } catch { /* The expanded CSS stage stays active. */ }
      }
    });
    new MutationObserver(() => { if (stage.hidden && expanded?.stage === stage) restore(); })
      .observe(stage, { attributes: true, attributeFilter: ['hidden'] });
    stage.addEventListener('contextmenu', event => {
      if (event.target.closest('canvas, .arcade-touch-controls, .surfers-controls, .city-controls')) event.preventDefault();
    });
  }
  document.addEventListener('fullscreenchange', () => {
    if (!document.fullscreenElement) restore();
  });
})();
