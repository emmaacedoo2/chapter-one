(() => {
  const eastern = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York', year: 'numeric', month: '2-digit', day: '2-digit'
  });
  const dateLabel = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', dateStyle: 'medium' });

  const monthLabel = new Intl.DateTimeFormat('en-US', { timeZone: 'UTC', month: 'long', year: 'numeric' });
  const lastMonth = '2027-12';
  const cities = new Set([
    'Tampa', 'St. Petersburg', 'Clearwater', 'Bradenton', 'Sarasota', 'Venice',
    'Port Charlotte', 'Punta Gorda', 'Fort Myers', 'Cape Coral', 'Estero', 'Bonita Springs', 'Naples'
  ]);

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
    const month = filters.elements.month;
    const heading = document.getElementById('concert-month');
    const status = document.getElementById('concert-status');
    const more = document.getElementById('concert-more');
    const pageSize = 8;
    let limit = pageSize;
    const events = (globalThis.MusicConcerts || []).filter(event =>
      event.artist && event.name && cities.has(event.city) && event.genre && event.venue &&
      httpUrl(event.url) && isoDate(event.date) && event.date <= '2027-12-31'
    ).sort((a, b) => a.date.localeCompare(b.date));
    let today = todayInFlorida();

    document.getElementById('concert-updated').textContent =
      'Last updated ' + formatDate(globalThis.MusicConcertsUpdated) + ' · Manually verified listings';

    function eventCard(event) {
      const card = node('article', '', 'concert-ticket');
      const stub = node('div', '', 'concert-ticket-stub');
      const time = node('time', formatDate(event.date));
      time.dateTime = event.date;
      if (event.endDate) {
        const end = node('time', formatDate(event.endDate));
        end.dateTime = event.endDate;
        const range = node('span', '');
        range.append(time, ' – ', end);
        stub.append(range);
      } else stub.append(time);
      stub.append(node('span', event.city));

      const body = node('div', '', 'concert-ticket-body');
      body.append(node('h3', event.artist));
      if (event.name !== event.artist) para(body, event.name);
      para(body, event.venue);
      para(body, event.genre, 'concert-muted');
      const artwork = httpUrl(event.artwork);
      if (artwork) {
        const image = node('img', '', 'concert-artwork');
        image.src = artwork;
        image.alt = '';
        image.loading = 'lazy';
        body.prepend(image);
      }
      body.append(link('Official event details', event.url));
      card.append(stub, body);
      eventList.append(card);
    }

    const upcoming = () => events.filter(event => (event.endDate || event.date) >= today);

    function updateFilterOptions() {
      const oldMonth = month.value;
      const firstMonth = today.slice(0, 7);
      const months = [];
      const cursor = isoDate(firstMonth + '-01');
      while (cursor.toISOString().slice(0, 7) <= lastMonth) {
        const value = cursor.toISOString().slice(0, 7);
        months.push(new Option(monthLabel.format(cursor), value));
        cursor.setUTCMonth(cursor.getUTCMonth() + 1);
      }
      month.replaceChildren(...months);
      if (months.some(option => option.value === oldMonth)) month.value = oldMonth;
      month.disabled = !months.length;

      for (const field of ['city', 'genre']) {
        const select = filters.elements[field];
        const oldValue = select.value;
        const values = [...new Set(upcoming().map(event => event[field]))].sort();
        select.replaceChildren(new Option(field === 'city' ? 'All locations' : 'All genres', ''),
          ...values.map(value => new Option(value, value)));
        if (values.includes(oldValue)) select.value = oldValue;
      }
    }

    function renderEvents() {
      const { city, genre, artist } = Object.fromEntries(new FormData(filters));
      const search = artist.trim().toLowerCase();
      const monthly = upcoming().filter(event =>
        event.date.slice(0, 7) <= month.value && (event.endDate || event.date).slice(0, 7) >= month.value);
      const matches = monthly.filter(event => (!city || event.city === city) &&
        (!genre || event.genre === genre) && (event.artist + ' ' + event.name).toLowerCase().includes(search));
      heading.textContent = month.selectedOptions[0]?.text || 'Upcoming concerts';
      status.textContent = !monthly.length ? 'No concerts announced yet.' :
        !matches.length ? 'No concerts match these filters.' :
          'Showing ' + Math.min(limit, matches.length) + ' of ' + matches.length + ' concerts';
      eventList.replaceChildren();
      matches.slice(0, limit).forEach(eventCard);
      more.hidden = matches.length <= limit;
    }

    function resetLimit() {
      limit = pageSize;
      renderEvents();
    }
    filters.addEventListener('input', resetLimit);
    filters.addEventListener('reset', () => setTimeout(resetLimit, 0));
    filters.addEventListener('submit', event => event.preventDefault());
    more.addEventListener('click', () => {
      const firstNew = limit;
      limit += pageSize;
      renderEvents();
      eventList.children[firstNew]?.querySelector('a')?.focus();
    });

    function refreshDates() {
      if (document.hidden) return;
      const date = todayInFlorida();
      if (date !== today) {
        today = date;
        updateFilterOptions();
        resetLimit();
      }
    }
    document.addEventListener('visibilitychange', refreshDates);
    setInterval(refreshDates, 60000);
    updateFilterOptions();
    renderEvents();
  });
})();
