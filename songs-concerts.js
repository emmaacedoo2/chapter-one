(() => {
  const KEY = 'chapter_one_concert_planner';
  const ARTIST_STATUSES = { want: 'Want to see', planning: 'Planning to see', seen: 'Already seen' };
  const PLAN_STATUSES = { wishlist: 'Wishlist', planning: 'Planning', attended: 'Attended' };
  const PLAN_FIELDS = ['artist', 'date', 'venue', 'city', 'url', 'status', 'note', 'memory'];
  const defaults = [
    { id: 101, artist: 'Gigi Perez', venue: 'Any small acoustic venue in Florida', note: 'Must hear Sailor Song live together!', dateAdded: 'Nov 2026' },
    { id: 102, artist: '$uicideboy$', venue: 'Amalie Arena', note: "Dom's dream concert", dateAdded: 'Nov 2026' }
  ];
  const eastern = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit'
  });
  const dateLabel = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', dateStyle: 'medium' });

  function todayInFlorida(now = new Date()) {
    const parts = Object.fromEntries(eastern.formatToParts(now).map(({ type, value }) => [type, value]));
    return [parts.year, parts.month, parts.day].join('-');
  }

  function isoDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return null;
    const date = new Date(value + 'T00:00:00Z');
    return Number.isFinite(date.getTime()) && date.toISOString().startsWith(value) ? date : null;
  }

  function formatDate(value) {
    return isoDate(value) ? dateLabel.format(isoDate(value)) : value;
  }

  function countdown(date, today) {
    if (!isoDate(date)) return '';
    const days = (isoDate(date) - isoDate(today)) / 86400000;
    if (days < 0) return 'Date passed';
    if (days === 0) return 'Today';
    return days === 1 ? '1 day to go' : days + ' days to go';
  }

  function httpUrl(value) {
    try {
      const url = new URL(value);
      return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
    } catch {
      return '';
    }
  }

  function read(key, fallback) {
    try { return JSON.parse(localStorage.getItem(key)) ?? fallback; }
    catch { return fallback; }
  }

  function load() {
    const stored = read(KEY);
    if (Array.isArray(stored?.artists) && Array.isArray(stored?.plans)) return stored;
    // Copy saved plans into the current format and keep both original storage keys.
    const legacy = (items, status) => (Array.isArray(items) ? items : []).filter(item => item && typeof item === 'object')
      .map((item, index) => ({ ...item, id: 'legacy-' + status + '-' + index, status }));
    return {
      artists: [
        { id: 'gigi-perez', artist: 'Gigi Perez', url: 'https://www.gigiperezmusic.com/', status: 'want' },
        { id: 'suicideboys', artist: '$uicideboy$', url: 'https://g59records.com/tour', status: 'want' }
      ],
      plans: [
        ...legacy(read('chapter_one_concert_bucket_list', defaults), 'wishlist'),
        ...legacy(read('chapter_one_concert_attended_list', []), 'attended')
      ]
    };
  }

  function node(tag, content, className) {
    const element = document.createElement(tag);
    if (content) element.textContent = content;
    if (className) element.className = className;
    return element;
  }

  function link(label, value) {
    const url = httpUrl(value);
    if (!url) return null;
    const element = node('a', label, 'concert-button');
    element.href = url;
    element.target = '_blank';
    element.rel = 'noopener noreferrer';
    return element;
  }

  function button(label, onClick) {
    const element = node('button', label, 'concert-button');
    element.type = 'button';
    element.addEventListener('click', onClick);
    return element;
  }

  function para(container, text, className) {
    if (text) container.append(node('p', text, className));
  }

  function ticket(container, record, label) {
    const card = node('article', '', 'concert-ticket');
    const stub = node('div', '', 'concert-ticket-stub');
    if (isoDate(record.date)) {
      const time = node('time', formatDate(record.date));
      time.dateTime = record.date;
      stub.append(time);
    } else {
      stub.append(node('span', record.date || label));
    }
    if (record.city) stub.append(node('span', record.city));
    const body = node('div', '', 'concert-ticket-body');
    body.append(node('h4', record.artist || 'Concert'));
    [record.name, record.venue].forEach(text => para(body, text));
    card.append(stub, body);
    container.append(card);
    return body;
  }

  document.addEventListener('DOMContentLoaded', () => {
    if (!document.getElementById('section-concerts')?.classList.contains('concert-planner')) return;
    const get = id => document.getElementById(id);
    const filters = get('concert-filters');
    const artistForm = get('concert-artist-form');
    const planForm = get('concert-plan-form');
    const status = get('concert-status');
    const eventList = get('concert-events');
    const expiredList = get('concert-expired-list');
    const artistList = get('concert-artists');
    const planList = get('concert-plan-list');
    const events = (globalThis.MusicConcerts || []).filter(event =>
      event.id && event.artist && event.name && event.city && event.genre && event.venue &&
      httpUrl(event.url) && isoDate(event.date) && isoDate(event.verified)
    ).sort((a, b) => a.date.localeCompare(b.date));
    let today = todayInFlorida();
    let state = load();
    let editing = null;

    function save(change, message) {
      const draft = load();
      change(draft);
      try {
        localStorage.setItem(KEY, JSON.stringify(draft));
      } catch {
        status.textContent = 'This browser could not save your changes. Check your storage settings.';
        return false;
      }
      state = draft;
      status.textContent = message;
      return true;
    }

    function eventCard(event, container, expired) {
      const body = ticket(container, event, 'Concert');
      para(body, [event.genre, 'Checked ' + formatDate(event.verified)].join(' · '), 'concert-muted');
      const actions = node('div', '', 'concert-actions');
      actions.append(link('Official event details', event.url));
      if (!expired) {
        const saved = state.plans.find(plan => plan.eventId === event.id);
        const savedLabel = saved?.status === 'wishlist' ? 'Saved to wishlist' : 'Saved to plans';
        const saveButton = button(saved ? savedLabel : 'Save to wishlist', () => {
          const addEvent = draft => {
            if (!draft.plans.some(plan => plan.eventId === event.id)) {
              draft.plans.push({ ...event, id: 'event-' + event.id, eventId: event.id, status: 'wishlist' });
            }
          };
          if (save(addEvent, 'Saved ' + event.artist + ' to Our Concert Plans.')) {
            saveButton.textContent = 'Saved to wishlist';
            saveButton.disabled = true;
            renderPlans();
          }
        });
        saveButton.disabled = Boolean(saved);
        actions.append(saveButton);
      }
      body.append(actions);
    }

    function updateFilterOptions() {
      const upcoming = events.filter(event => event.date >= today);
      for (const field of ['city', 'genre']) {
        const select = filters.elements[field];
        const oldValue = select.value;
        const values = [...new Set(upcoming.map(event => event[field]))].sort();
        select.replaceChildren(new Option(field === 'city' ? 'All cities' : 'All genres', ''),
          ...values.map(value => new Option(value, value)));
        if (values.includes(oldValue)) select.value = oldValue;
      }

    }

    function renderEvents() {
      const upcoming = events.filter(event => event.date >= today);
      const selection = new FormData(filters);
      const city = selection.get('city');
      const genre = selection.get('genre');
      const artist = selection.get('artist').trim().toLowerCase();
      const earliest = selection.get('date');
      const matches = upcoming.filter(event => (!city || event.city === city) &&
        (!genre || event.genre === genre) && event.artist.toLowerCase().includes(artist) &&
        (!earliest || event.date >= earliest));
      eventList.replaceChildren();
      if (!upcoming.length) {
        para(eventList, 'There are no verified upcoming listings here right now. Browse the official calendars below.', 'concert-muted');
      } else if (!matches.length) {
        para(eventList, 'No upcoming concerts match these filters.', 'concert-muted');
      }
      matches.forEach(event => eventCard(event, eventList, false));

      const past = events.filter(event => event.date < today).reverse();
      get('concert-expired').hidden = past.length === 0;
      get('concert-expired-count').textContent = '(' + past.length + ')';
      expiredList.replaceChildren();
      past.forEach(event => eventCard(event, expiredList, true));
    }

    function renderArtists() {
      artistList.replaceChildren();
      if (!state.artists.length) para(artistList, 'Add an artist you’d love to see.', 'concert-muted');
      for (const artist of state.artists) {
        const card = node('article', '', 'concert-artist-card');
        const label = node('label', 'Status');
        const select = document.createElement('select');
        Object.entries(ARTIST_STATUSES).forEach(([key, name]) => select.add(new Option(name, key)));
        select.value = artist.status;
        select.setAttribute('aria-label', 'Status for ' + artist.artist);
        select.addEventListener('change', () => {
          const selected = select.value;
          if (!save(draft => {
            const entry = draft.artists.find(entry => entry.id === artist.id);
            if (entry) entry.status = selected;
          }, 'Updated status for ' + artist.artist + '.')) select.value = artist.status;
        });
        label.append(select);
        const actions = node('div', '', 'concert-actions');
        const official = link('Artist or tour site', artist.url);
        if (official) actions.append(official);
        actions.append(button('Remove', () => {
          if (!confirm('Remove ' + artist.artist + ' from the artist wishlist?')) return;
          if (save(draft => {
            draft.artists = draft.artists.filter(item => item.id !== artist.id);
          }, 'Removed ' + artist.artist + '.')) {
            renderArtists();
            artistForm.elements.artist.focus();
          }
        }));
        card.append(node('h4', artist.artist), label, actions);
        artistList.append(card);
      }
    }

    function updateMemoryField() {
      get('concert-memory-label').hidden = planForm.elements.status.value !== 'attended';
    }

    function resetPlanForm() {
      editing = null;
      planForm.reset();
      get('concert-plan-save').textContent = 'Add concert';
      get('concert-plan-cancel').hidden = true;
      updateMemoryField();
    }

    function editPlan(plan) {
      editing = plan.id;
      for (const field of PLAN_FIELDS) planForm.elements[field].value = plan[field] || '';
      get('concert-plan-save').textContent = 'Save changes';
      get('concert-plan-cancel').hidden = false;
      updateMemoryField();
      planForm.elements.artist.focus();
    }

    function renderPlans() {
      planList.replaceChildren();
      if (!state.plans.length) para(planList, 'Add a concert or save one from Upcoming Concerts.', 'concert-muted');
      for (const [key, label] of Object.entries(PLAN_STATUSES)) {
        const plans = state.plans.filter(plan => plan.status === key)
          .sort((a, b) => (a.date || '9999').localeCompare(b.date || '9999'));
        if (!plans.length) continue;
        const group = node('div', '', 'concert-plan-group');
        group.append(node('h3', label));
        const grid = node('div', '', 'concert-card-grid');
        for (const plan of plans) {
          const body = ticket(grid, plan, 'Date to come');
          if (key === 'planning') para(body, countdown(plan.date, today), 'concert-countdown');
          if (key === 'attended' && plan.attendedDate) para(body, 'Attended ' + formatDate(plan.attendedDate), 'concert-muted');
          para(body, plan.note);
          if (key === 'attended') para(body, plan.memory, 'concert-memory');
          const actions = node('div', '', 'concert-actions');
          const tickets = link('Ticket link', plan.url);
          if (tickets) actions.append(tickets);
          actions.append(button('Edit', () => editPlan(plan)), button('Delete', () => {
            if (!confirm('Delete this concert plan?')) return;
            if (save(draft => {
              draft.plans = draft.plans.filter(item => item.id !== plan.id);
            }, 'Deleted the concert plan.')) {
              if (editing === plan.id) resetPlanForm();
              renderEvents();
              renderPlans();
              planForm.elements.artist.focus();
            }
          }));
          body.append(actions);
        }
        group.append(grid);
        planList.append(group);
      }
    }

    function formValues(form, fields) {
      const values = Object.fromEntries(fields.map(field => [field, form.elements[field].value.trim()]));
      if (values.url && !httpUrl(values.url)) {
        form.elements.url.setCustomValidity('Enter a link starting with https:// or http://.');
        form.elements.url.reportValidity();
        form.elements.url.setCustomValidity('');
        return null;
      }
      if (!values.artist) {
        form.elements.artist.setCustomValidity('Enter an artist name.');
        form.elements.artist.reportValidity();
        form.elements.artist.setCustomValidity('');
        return null;
      }
      return values;
    }

    filters.addEventListener('input', renderEvents);
    filters.addEventListener('reset', () => setTimeout(renderEvents, 0));
    filters.addEventListener('submit', event => event.preventDefault());
    artistForm.addEventListener('submit', event => {
      event.preventDefault();
      const values = formValues(artistForm, ['artist', 'url']);
      if (!values) return;
      if (load().artists.some(artist => artist.artist.toLowerCase() === values.artist.toLowerCase())) {
        status.textContent = 'That artist is already on your wishlist.';
        return;
      }
      if (save(draft => draft.artists.push({ ...values, id: 'artist-' + Date.now(), status: 'want' }), 'Added ' + values.artist + '.')) {
        artistForm.reset();
        renderArtists();
      }
    });
    planForm.addEventListener('submit', event => {
      event.preventDefault();
      const values = formValues(planForm, PLAN_FIELDS);
      if (!values) return;
      if (editing && !load().plans.some(plan => plan.id === editing)) {
        status.textContent = 'This plan was removed in another tab.';
        state = load();
        resetPlanForm();
        renderPlans();
        return;
      }
      if (save(draft => {
        const index = draft.plans.findIndex(plan => plan.id === editing);
        const existing = draft.plans[index];
        const plan = { ...existing, ...values, id: existing?.id || 'plan-' + Date.now() };
        if (values.status === 'attended' && !plan.attendedDate && values.date) plan.attendedDate = values.date;
        if (index >= 0) draft.plans[index] = plan;
        else draft.plans.push(plan);
      }, editing ? 'Updated your concert plan.' : 'Added a concert plan.')) {
        resetPlanForm();
        renderEvents();
        renderPlans();
      }
    });
    planForm.elements.status.addEventListener('change', updateMemoryField);
    get('concert-plan-cancel').addEventListener('click', () => {
      resetPlanForm();
      planForm.elements.artist.focus();
    });

    function refreshDates() {
      if (document.hidden) return;
      const date = todayInFlorida();
      if (date !== today) {
        today = date;
        updateFilterOptions();
        renderEvents();
        renderPlans();
      }
    }
    document.addEventListener('visibilitychange', refreshDates);
    setInterval(refreshDates, 60000);
    window.addEventListener('storage', event => {
      if (event.key !== KEY) return;
      state = load();
      renderArtists();
      renderEvents();
      renderPlans();
    });

    renderArtists();
    updateFilterOptions();
    renderEvents();
    renderPlans();
  });
})();
