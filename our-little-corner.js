(() => {
  'use strict';
  // This small storage adapter can later be replaced by authenticated Firestore calls.
  const storage = {
    read() {
      try { return JSON.parse(localStorage.getItem('chapter-one-corner-v1')) || {}; }
      catch { return {}; }
    },
    write(data) { localStorage.setItem('chapter-one-corner-v1', JSON.stringify(data)); }
  };
  const state = storage.read();
  state.profile = ['Dom', 'Emma'].includes(state.profile) ? state.profile : 'Dom';
  state.moods ||= {};
  state.notes ||= [];
  state.checkins ||= {};
  let selectedMood = '';
  const $ = (selector) => document.querySelector(selector);
  const time = (date) => new Date(date).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' });
  const element = (tag, className, value) => {
    const item = document.createElement(tag);
    if (className) item.className = className;
    if (value !== undefined) item.textContent = value;
    return item;
  };
  let statusTimer;
  function announce(message) {
    $('#status').textContent = message;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => { $('#status').textContent = ''; }, 5000);
  }
  function save() {
    try { storage.write(state); return true; }
    catch { announce('Could not save in this browser. Check your browser storage settings.'); return false; }
  }
  function render() {
    document.querySelectorAll('[data-profile]').forEach((button) => {
      const active = button.dataset.profile === state.profile;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    $('#note-author').textContent = state.profile.toUpperCase();
    const profiles = $('#mood-profiles');
    profiles.replaceChildren();
    ['Dom', 'Emma'].forEach((name) => {
      const card = element('article', 'card profile-card');
      const content = element('div');
      const mood = state.moods[name];
      card.append(element('span', 'avatar', name[0]), content);
      content.append(element('h3', '', name));
      content.append(element('p', 'mood-name', mood ? mood.mood : 'Waiting for a little update'));
      if (mood?.note) content.append(element('p', '', mood.note));
      if (mood?.at) content.append(element('p', 'timestamp', time(mood.at)));
      profiles.append(card);
    });
    const notes = $('#notes-list');
    notes.replaceChildren();
    if (!state.notes.length) notes.append(element('p', 'empty', 'A blank page, just waiting for your first little note.'));
    [...state.notes].reverse().forEach((note) => {
      const item = element('article', 'note-item');
      item.append(element('strong', '', `FROM ${note.author.toUpperCase()} ♡`), element('p', '', note.text), element('p', 'timestamp', time(note.at)));
      notes.append(item);
    });
    const checkins = $('#checkin-list');
    checkins.replaceChildren();
    ['Dom', 'Emma'].forEach((name) => {
      const entry = state.checkins[name];
      if (!entry) return;
      const item = element('div', 'checkin-entry');
      item.append(element('strong', '', `${name} · ${time(entry.at)}`), element('p', '', entry.text));
      checkins.append(item);
    });
  }
  document.querySelectorAll('[data-profile]').forEach((button) => button.addEventListener('click', () => {
    state.profile = button.dataset.profile; save(); render();
  }));
  document.querySelectorAll('[data-mood]').forEach((button) => {
    button.setAttribute('aria-pressed', 'false');
    button.addEventListener('click', () => {
      selectedMood = button.dataset.mood;
      document.querySelectorAll('[data-mood]').forEach((option) => {
        const active = option === button;
        option.classList.toggle('active', active);
        option.setAttribute('aria-pressed', String(active));
      });
    });
  });
  $('#mood-form').addEventListener('submit', (event) => {
    event.preventDefault();
    if (!selectedMood) { announce('Pick a mood first.'); return; }
    state.moods[state.profile] = { mood: selectedMood, note: $('#mood-note').value.trim(), at: new Date().toISOString() };
    if (save()) { $('#mood-note').value = ''; render(); announce('Your mood was saved in this browser.'); }
  });
  $('#note-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const text = $('#note-text').value.trim();
    if (!text) { announce('Write a little note first.'); return; }
    state.notes.push({ author: state.profile, text, at: new Date().toISOString() });
    if (save()) {
      $('#note-text').value = ''; render();
      announce(event.submitter?.value === 'notify' ? 'Saved here only. Notifications are not connected yet.' : 'Your note was saved in this browser.');
    }
  });
  $('#hug-button').addEventListener('click', () => {
    state.notes.push({ author: state.profile, text: 'I need a hug ♡', at: new Date().toISOString() });
    if (save()) { render(); $('#hug-status').textContent = 'Your hug request is saved here as a note. No notification was sent.'; }
  });
  $('#checkin-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const text = $('#checkin-text').value.trim();
    if (!text) { announce('Write a check-in first.'); return; }
    state.checkins[state.profile] = { text, at: new Date().toISOString() };
    if (save()) { $('#checkin-text').value = ''; render(); announce('Your check-in was saved in this browser.'); }
  });
  render();
  // Only register when no existing worker controls this scope; never replace another site's worker.
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.getRegistration('./').then((registration) => {
      if (!registration) return navigator.serviceWorker.register('./corner-sw.js');
    }).catch(() => {});
  }
})();
