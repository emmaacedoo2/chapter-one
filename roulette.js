(() => {
  const pool = EXTRA_DATE_IDEAS;
  const wheel = document.getElementById('date-wheel');
  const button = document.getElementById('spin-wheel');
  const shuffle = document.getElementById('shuffle-wheel');
  const result = document.getElementById('wheel-result');
  const step = 360 / 10;
  let ideas = [];
  let rotation = 0;
  let spinning = false;
  let recent = [];
  let lastWinner = null;
  try {
    const saved = JSON.parse(localStorage.getItem('date_roulette_recent'));
    if (Array.isArray(saved)) recent = saved;
  } catch (e) { /* Storage is optional. */ }

  function shuffleIdeas() {
    if (spinning) return;
    const currentIds = ideas.map(idea => idea.id);
    let available = pool.filter(idea => !recent.includes(idea.id) && !currentIds.includes(idea.id));
    if (available.length < 10) available = pool.filter(idea => !currentIds.includes(idea.id));
    // Fisher–Yates gives each idea an equal chance without retry loops.
    for (let i = available.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [available[i], available[j]] = [available[j], available[i]];
    }
    ideas = available.slice(0, 10);
    recent = [...ideas.map(idea => idea.id), ...recent.filter(id => !ideas.some(idea => idea.id === id))].slice(0, 60);
    try { localStorage.setItem('date_roulette_recent', JSON.stringify(recent)); } catch (e) { /* Storage is optional. */ }
    wheel.replaceChildren();
    wheel.style.background = `conic-gradient(${ideas.map((_, i) => `${i % 2 ? '#f4c9cf' : '#8b1e2d'} ${i * step}deg ${(i + 1) * step}deg`).join(',')})`;
    ideas.forEach((idea, i) => {
      const label = document.createElement('span');
      label.className = 'wheel-label';
      label.style.transform = `translate(-50%, -50%) rotate(${i * step + step / 2}deg) translateY(calc(-1 * var(--wheel-label-radius)))`;
      label.textContent = idea.title;
      wheel.append(label);
    });
    wheel.setAttribute('aria-label', `Wheel with ten date ideas: ${ideas.map(idea => idea.title).join(', ')}`);
    result.textContent = 'Where will the wheel take you?';
  }
  shuffleIdeas();
  shuffle.addEventListener('click', shuffleIdeas);
  button.addEventListener('click', () => {
    if (spinning) return;
    spinning = true;
    button.disabled = true;
    shuffle.disabled = true;
    const candidates = ideas.map((idea, index) => ({ idea, index })).filter(entry => entry.idea.id !== lastWinner);
    const { idea, index } = candidates[Math.floor(Math.random() * candidates.length)];
    const target = (360 - (index * step + step / 2)) % 360;
    rotation += 1800 + ((target - rotation % 360 + 360) % 360);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    wheel.style.transitionDuration = reduced ? '0s' : '4s';
    wheel.style.transform = `rotate(${rotation}deg)`;
    result.textContent = 'The wheel is choosing...';
    setTimeout(() => {
      lastWinner = idea.id;
      result.textContent = `It's ${idea.title}! ${idea.description} ♡`;
      button.textContent = 'Spin Again ↻';
      spinning = false;
      button.disabled = false;
      shuffle.disabled = false;
    }, reduced ? 0 : 4000);
  });
})();
