(() => {
  const ideas = ['Movie Night','Cook Together','Ice Cream Date','Sunset Walk','Picnic','Arcade Night','Beach Day','Coffee Date','Game Night','Surprise Dinner','Explore Somewhere New','Cozy Night In'];
  const wheel = document.getElementById('date-wheel');
  const button = document.getElementById('spin-wheel');
  const result = document.getElementById('wheel-result');
  const step = 360 / ideas.length;
  wheel.style.background = `conic-gradient(${ideas.map((_, i) => `${i % 2 ? '#f4c9cf' : '#8b1e2d'} ${i * step}deg ${(i + 1) * step}deg`).join(',')})`;
  ideas.forEach((idea, i) => { const label = document.createElement('span'); label.className = 'wheel-label'; label.style.transform = `translate(-50%, -50%) rotate(${i * step + step / 2}deg) translateY(-108px)`; label.textContent = idea; wheel.append(label); });
  let rotation = 0;
  button.addEventListener('click', () => {
    button.disabled = true;
    const index = Math.floor(Math.random() * ideas.length);
    const target = (360 - (index * step + step / 2)) % 360;
    rotation += 1800 + ((target - rotation % 360 + 360) % 360);
    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
    wheel.style.transitionDuration = reduced ? '0s' : '4s';
    wheel.style.transform = `rotate(${rotation}deg)`;
    result.textContent = 'The wheel is choosing...';
    setTimeout(() => { result.textContent = `It's ${ideas[index]}! ♡`; button.textContent = 'Spin Again ↻'; button.disabled = false; }, reduced ? 0 : 4000);
  });
})();
