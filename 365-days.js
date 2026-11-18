(() => {
  'use strict';
  const TOTAL = 365;
  const START = Date.UTC(2026, 11, 8);
  const DAY = 86400000;
  const STORAGE_KEY = 'chapter-one-365-revealed';
  // Add optional captions by day number, for example: 1: 'Our first adventure'.
  const captions = {};
  // Replace this resolver with an authenticated private-storage URL provider later.
  const photoUrl = day => `images/365-days/day-${String(day).padStart(3, '0')}.jpg`;
  const $ = id => document.getElementById(id);
  const dateFor = day => new Date(START + (day - 1) * DAY);
  const dateLabel = day => dateFor(day).toLocaleDateString('en-US', { timeZone: 'UTC', month: 'long', day: 'numeric', year: 'numeric' });
  const availableToday = () => {
    const now = new Date();
    const localDay = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
    return Math.max(0, Math.min(TOTAL, Math.floor((localDay - START) / DAY) + 1));
  };
  let revealed = new Set();
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    if (Array.isArray(saved)) revealed = new Set(saved.filter(n => Number.isInteger(n) && n >= 1 && n <= TOTAL));
  } catch (_) { /* Storage may be unavailable; the page still works for this visit. */ }
  let selected = availableToday();
  let drawing = false;
  let lastPoint = null;
  const canvas = $('scratch-canvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });

  function makePhoto(day) {
    const container = document.createElement('div');
    container.className = 'photo-placeholder';
    const heart = document.createElement('span'); heart.textContent = '♡';
    const label = document.createElement('strong'); label.textContent = `Memory ${String(day).padStart(3, '0')}`;
    const note = document.createElement('small'); note.textContent = 'A little moment waiting for its photo';
    container.append(heart, label, note);
    const img = new Image();
    img.alt = captions[day] || `Dom and Emma, memory ${day}`;
    img.onload = () => { container.className = 'photo-loaded'; container.replaceChildren(img); };
    img.src = photoUrl(day);
    return container;
  }
  function save() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify([...revealed])); } catch (_) { /* Keep in-memory progress if storage is blocked. */ }
  }
  function reveal() {
    if (!selected || selected > availableToday()) return;
    revealed.add(selected); save(); render();
  }
  function paintCover() {
    canvas.width = 600; canvas.height = 450;
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = '#a33c50'; ctx.fillRect(0, 0, 600, 450);
    ctx.strokeStyle = 'rgba(255,242,230,.16)'; ctx.lineWidth = 2;
    for (let x = -450; x < 900; x += 45) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + 450, 450); ctx.stroke(); }
    ctx.fillStyle = '#fff4e8'; ctx.textAlign = 'center';
    ctx.font = '42px Georgia'; ctx.fillText('♡', 300, 180);
    ctx.font = 'bold 27px sans-serif'; ctx.fillText('A LITTLE SURPRISE', 300, 235);
    ctx.font = '20px Georgia'; ctx.fillText('scratch here, my love', 300, 275);
    ctx.globalCompositeOperation = 'destination-out'; ctx.lineCap = 'round'; ctx.lineJoin = 'round'; ctx.lineWidth = 48;
  }
  function point(event) {
    const rect = canvas.getBoundingClientRect();
    return { x: (event.clientX - rect.left) * canvas.width / rect.width, y: (event.clientY - rect.top) * canvas.height / rect.height };
  }
  function scratch(event) {
    if (!drawing || selected > availableToday()) return;
    const next = point(event); ctx.beginPath(); ctx.moveTo(lastPoint.x, lastPoint.y); ctx.lineTo(next.x, next.y); ctx.stroke(); lastPoint = next;
  }
  function checkScratch() {
    const pixels = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    let clear = 0, samples = 0;
    for (let i = 3; i < pixels.length; i += 64) { samples++; if (pixels[i] < 128) clear++; }
    if (clear / samples >= .4) reveal();
  }
  canvas.addEventListener('pointerdown', event => {
    if (selected > availableToday()) return;
    drawing = true; lastPoint = point(event); canvas.setPointerCapture(event.pointerId); scratch(event);
  });
  canvas.addEventListener('pointermove', scratch);
  ['pointerup', 'pointercancel', 'lostpointercapture'].forEach(type => canvas.addEventListener(type, () => { if (drawing) { drawing = false; checkScratch(); } }));
  $('reveal-memory').addEventListener('click', reveal);
  $('memory-select').addEventListener('change', event => { selected = Number(event.target.value); render(); });

  function render() {
    const available = availableToday();
    if (selected > available) selected = available;
    const visibleRevealed = [...revealed].filter(day => day <= available).sort((a, b) => a - b);
    $('memory-count').textContent = `${visibleRevealed.length} / ${TOTAL} memories revealed`;
    $('memory-progress-bar').style.width = `${visibleRevealed.length / TOTAL * 100}%`;
    const picker = $('memory-select'); picker.replaceChildren();
    picker.parentElement.hidden = !available;
    for (let day = available; day >= 1; day--) {
      const option = document.createElement('option'); option.value = day; option.textContent = `Day ${String(day).padStart(3, '0')} · ${dateLabel(day)}`; picker.append(option);
    }
    picker.value = String(selected);
    $('memory-day').textContent = selected ? `DAY ${String(selected).padStart(3, '0')} OF 365` : 'OUR STORY BEGINS';
    $('memory-date').textContent = selected ? dateLabel(selected) : 'December 8, 2026';
    $('scratch-card').hidden = !selected; $('memory-locked').hidden = !!selected;
    $('memory-caption').textContent = selected && revealed.has(selected) ? (captions[selected] || 'A little piece of our story ♡') : '';
    $('scratch-hint').hidden = !selected || revealed.has(selected);
    $('reveal-memory').hidden = !selected || revealed.has(selected);
    $('memory-complete').hidden = available < TOTAL;
    if (selected) {
      $('memory-photo').replaceChildren(makePhoto(selected));
      canvas.hidden = revealed.has(selected);
      if (!canvas.hidden) paintCover();
    }
    $('future-message').textContent = available === TOTAL ? 'All 365 days are here. The rest of our story is still unwritten.' : `The next chapter ${available ? 'arrives' : 'begins'} ${dateLabel(available + 1)}.`;
    const future = $('future-list'); future.replaceChildren();
    for (let day = available + 1; day <= Math.min(TOTAL, available + 3); day++) {
      const item = document.createElement('div'); item.className = 'future-item';
      const label = document.createElement('span'); label.textContent = `DAY ${String(day).padStart(3, '0')} · ${dateLabel(day)}`;
      const lock = document.createElement('span'); lock.textContent = '🔒'; item.append(label, lock); future.append(item);
    }
    const gallery = $('memory-gallery'); gallery.replaceChildren();
    $('gallery-empty').hidden = visibleRevealed.length > 0;
    visibleRevealed.forEach(day => {
      const button = document.createElement('button'); button.type = 'button'; button.className = 'gallery-item';
      const photo = document.createElement('div'); photo.className = 'gallery-photo'; photo.append(makePhoto(day));
      const title = document.createElement('strong'); title.textContent = `Day ${String(day).padStart(3, '0')}`;
      const label = document.createElement('small'); label.textContent = captions[day] || dateLabel(day);
      button.append(photo, title, label); button.addEventListener('click', () => { selected = day; render(); $('scratch-card').scrollIntoView({ behavior: 'smooth', block: 'center' }); }); gallery.append(button);
    });
  }
  render();
  // Refresh when the local day changes, including after the tab was in the background.
  setInterval(() => { const today = availableToday(); if (today !== windowDays) { windowDays = today; selected = today; render(); } }, 30000);
  let windowDays = availableToday();
})();
