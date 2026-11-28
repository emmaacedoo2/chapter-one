(() => {
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

  function httpUrl(value) {
    try {
      const url = new URL(value);
      return ['https:', 'http:'].includes(url.protocol) ? url.href : '';
    } catch {
      return '';
    }
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

  function para(container, text, className) {
    if (text) container.append(node('p', text, className));
  }

  document.addEventListener('DOMContentLoaded', () => {
    const filters = document.getElementById('concert-filters');
    const eventList = document.getElementById('concert-events');
    if (!filters || !eventList) return;
    const events = (globalThis.MusicConcerts || []).filter(event =>
      event.id && event.artist && event.name && event.city && event.genre && event.venue &&
      httpUrl(event.url) && isoDate(event.date) && isoDate(event.verified)
    ).sort((a, b) => a.date.localeCompare(b.date));
    let today = todayInFlorida();

    function eventCard(event) {
      const card = node('article', '', 'concert-ticket');
      const stub = node('div', '', 'concert-ticket-stub');
      const time = node('time', formatDate(event.date));
      time.dateTime = event.date;
      stub.append(time, node('span', event.city));

      const body = node('div', '', 'concert-ticket-body');
      body.append(node('h3', event.artist));
      para(body, event.name);
      para(body, event.venue);
      para(body, event.genre + ' · Checked ' + formatDate(event.verified), 'concert-muted');
      body.append(link('Official event details', event.url));
      card.append(stub, body);
      eventList.append(card);
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
      matches.forEach(eventCard);
    }

    filters.addEventListener('input', renderEvents);
    filters.addEventListener('reset', () => setTimeout(renderEvents, 0));
    filters.addEventListener('submit', event => event.preventDefault());

    function refreshDates() {
      if (document.hidden) return;
      const date = todayInFlorida();
      if (date !== today) {
        today = date;
        updateFilterOptions();
        renderEvents();
      }
    }
    document.addEventListener('visibilitychange', refreshDates);
    setInterval(refreshDates, 60000);
    updateFilterOptions();
    renderEvents();
  });
})();
