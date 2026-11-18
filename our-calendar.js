// ==========================================================================
// Our Little Calendar - JavaScript Controller & Logic
// Chapter One Shared Calendar for Emma & Dom
// ==========================================================================

const CalendarApp = {
  // Storage keys
  STORAGE_CUSTOM_EVENTS: 'chapter_one_calendar_custom_events',
  STORAGE_FIREBASE_CONFIG: 'chapter_one_firebase_config',

  // Current view state
  currentYear: new Date().getFullYear(),
  currentMonth: new Date().getMonth(), // 0-indexed (0 = Jan, 11 = Dec)
  selectedDateStr: null, // "YYYY-MM-DD"

  // Custom events array
  customEvents: [],

  // Firebase state
  firebaseApp: null,
  firestoreDb: null,
  isFirebaseActive: false,
  unsubscribeSnapshot: null,

  // Category definitions with aesthetic muted pastel palette
  categories: {
    anniversary: { name: 'Anniversary / Romantic', color: '#a81d1d', bg: '#fce8e8', border: '#f0a8a8', icon: '❤️' },
    birthday: { name: 'Birthday', color: '#583b8b', bg: '#f1ecf9', border: '#cfbfe8', icon: '🎂' },
    trip: { name: 'Trip / Travel', color: '#1e5985', bg: '#e8f3fc', border: '#b8daf5', icon: '✈️' },
    holiday: { name: 'Holiday', color: '#2a6632', bg: '#eaf3eb', border: '#bde0bf', icon: '🎄' },
    date: { name: 'Date / Little Plan', color: '#87541a', bg: '#fbf1e4', border: '#f2d5b6', icon: '✨' }
  },

  // --------------------------------------------------------------------------
  // Initialization
  // --------------------------------------------------------------------------
  init() {
    this.selectedDateStr = this.formatDate(new Date());
    this.loadCustomEvents();
    this.initFirebase();
    this.initCountdown();
    this.renderYearSelector();
    this.renderMonth();
    this.bindEvents();
    this.renderUpcoming();
  },

  // --------------------------------------------------------------------------
  // Date Utilities & Recurring Calculations
  // --------------------------------------------------------------------------
  formatDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },

  parseDate(str) {
    const [y, m, d] = str.split('-').map(Number);
    return new Date(y, m - 1, d);
  },

  getOrdinal(n) {
    const s = ['th', 'st', 'nd', 'rd'];
    const v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  },

  getThanksgivingDate(year) {
    // 4th Thursday in November
    // Nov 1st day of week: 0 (Sun) - 6 (Sat)
    const nov1 = new Date(year, 10, 1);
    const dayOfWeek = nov1.getDay(); // 4 = Thursday
    const firstThursday = dayOfWeek <= 4 ? 1 + (4 - dayOfWeek) : 1 + (11 - dayOfWeek);
    const fourthThursday = firstThursday + 21;
    return `${year}-11-${String(fourthThursday).padStart(2, '0')}`;
  },

  // Generate fixed recurring events for a specific year
  getRecurringEventsForYear(year) {
    const tgDate = this.getThanksgivingDate(year);

    // Dom was born Dec 7, 2001 (turns 26 in 2027)
    const domAge = year - 2001;
    const domAgeText = domAge > 0 ? `dom's ${this.getOrdinal(domAge)} birthday 🎂` : "dom's birthday 🎂";

    // Started dating Dec 8, 2025 (2026 is 1st, 2027 is 2nd)
    const anniNum = year - 2025;
    let anniText = "our anniversary ❤️";
    if (anniNum > 0) {
      anniText = `our ${this.getOrdinal(anniNum)} anniversary ❤️`;
    }

    const events = [
      {
        id: `rec-val-${year}`,
        isRecurring: true,
        title: "valentine's day ❤️",
        date: `${year}-02-14`,
        time: '',
        isAllDay: true,
        category: 'anniversary',
        notes: 'a day for chocolate, love, and us.'
      },
      {
        id: `rec-emma-bday-${year}`,
        isRecurring: true,
        title: "emma's birthday 🎂",
        date: `${year}-09-09`,
        time: '',
        isAllDay: true,
        category: 'birthday',
        notes: 'celebrating Emma! 🎉'
      },
      {
        id: `rec-tg-${year}`,
        isRecurring: true,
        title: "thanksgiving 🦃",
        date: tgDate,
        time: '',
        isAllDay: true,
        category: 'holiday',
        notes: 'fourth Thursday of November every year.'
      },
      {
        id: `rec-dom-bday-${year}`,
        isRecurring: true,
        title: domAgeText,
        date: `${year}-12-07`,
        time: '',
        isAllDay: true,
        category: 'birthday',
        notes: `celebrating Dom! (${domAge > 0 ? this.getOrdinal(domAge) + ' birthday' : 'birthday'})`
      },
      {
        id: `rec-anni-${year}`,
        isRecurring: true,
        title: anniText,
        date: `${year}-12-08`,
        time: '',
        isAllDay: true,
        category: 'anniversary',
        notes: `dating since December 8, 2025. ${anniNum > 0 ? this.getOrdinal(anniNum) + ' year anniversary!' : ''}`
      },
      {
        id: `rec-xmas-eve-${year}`,
        isRecurring: true,
        title: "christmas eve 🎄",
        date: `${year}-12-24`,
        time: '',
        isAllDay: true,
        category: 'holiday',
        notes: 'cozy winter nights.'
      },
      {
        id: `rec-xmas-${year}`,
        isRecurring: true,
        title: "christmas 🎁",
        date: `${year}-12-25`,
        time: '',
        isAllDay: true,
        category: 'holiday',
        notes: 'merry christmas!'
      },
      {
        id: `rec-nye-${year}`,
        isRecurring: true,
        title: "new year's eve ✨",
        date: `${year}-12-31`,
        time: '',
        isAllDay: true,
        category: 'holiday',
        notes: 'ringing in another year together.'
      }
    ];

    return events;
  },

  // Initial one-time events seed (Jan 6, 2027)
  getSeedCustomEvents() {
    return [
      {
        id: 'seed-back-usa-2027',
        title: "back to the USA ✈️",
        date: '2027-01-06',
        time: '',
        isAllDay: true,
        category: 'trip',
        notes: 'flying back home together.'
      }
    ];
  },

  // --------------------------------------------------------------------------
  // Storage & Events Management
  // --------------------------------------------------------------------------
  loadCustomEvents() {
    try {
      const stored = localStorage.getItem(this.STORAGE_CUSTOM_EVENTS);
      if (stored) {
        this.customEvents = JSON.parse(stored);
      } else {
        this.customEvents = this.getSeedCustomEvents();
        this.saveCustomEvents();
      }
    } catch (e) {
      console.error(e);
      this.customEvents = this.getSeedCustomEvents();
    }
  },

  saveCustomEvents() {
    try {
      localStorage.setItem(this.STORAGE_CUSTOM_EVENTS, JSON.stringify(this.customEvents));
    } catch (e) {
      console.error(e);
    }
    this.renderMonth();
    this.renderSelectedDay();
    this.renderUpcoming();
  },

  getAllEventsForMonth(year, month) {
    const recurring = this.getRecurringEventsForYear(year);
    const monthStr = String(month + 1).padStart(2, '0');

    // Recurring in this month
    const recInMonth = recurring.filter(e => e.date.startsWith(`${year}-${monthStr}`));

    // Custom events in this month
    const customInMonth = this.customEvents.filter(e => e.date.startsWith(`${year}-${monthStr}`));

    return [...recInMonth, ...customInMonth];
  },

  getEventsForDate(dateStr) {
    const [y] = dateStr.split('-').map(Number);
    const recurring = this.getRecurringEventsForYear(y);

    const matchRec = recurring.filter(e => e.date === dateStr);
    const matchCustom = this.customEvents.filter(e => e.date === dateStr);

    return [...matchRec, ...matchCustom];
  },

  // --------------------------------------------------------------------------
  // Calendar Grid Rendering
  // --------------------------------------------------------------------------
  renderYearSelector() {
    const select = document.getElementById('calendar-year-select');
    if (!select) return;
    select.innerHTML = '';

    const startYear = 2025;
    const endYear = 2035;

    for (let y = startYear; y <= endYear; y++) {
      const opt = document.createElement('option');
      opt.value = y;
      opt.textContent = y;
      if (y === this.currentYear) opt.selected = true;
      select.appendChild(opt);
    }
  },

  renderMonth() {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    const titleEl = document.getElementById('calendar-month-title');
    if (titleEl) {
      titleEl.textContent = `${monthNames[this.currentMonth]} ${this.currentYear}`;
    }

    const yearSelect = document.getElementById('calendar-year-select');
    if (yearSelect) {
      yearSelect.value = this.currentYear;
    }

    const gridEl = document.getElementById('calendar-days-grid');
    if (!gridEl) return;
    gridEl.innerHTML = '';

    const firstDayOfWeek = new Date(this.currentYear, this.currentMonth, 1).getDay(); // 0 = Sun
    const totalDaysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
    const prevMonthDays = new Date(this.currentYear, this.currentMonth, 0).getDate();

    const todayStr = this.formatDate(new Date());

    // 1. Padding days from previous month
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const dayNum = prevMonthDays - i;
      const cell = document.createElement('div');
      cell.className = 'calendar-day-cell other-month';
      cell.innerHTML = `<span class="day-number">${dayNum}</span>`;
      gridEl.appendChild(cell);
    }

    // 2. Days of current month
    for (let d = 1; d <= totalDaysInMonth; d++) {
      const dateStr = `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const events = this.getEventsForDate(dateStr);

      const cell = document.createElement('div');
      cell.className = 'calendar-day-cell';
      cell.setAttribute('data-date', dateStr);

      if (dateStr === todayStr) cell.classList.add('is-today');
      if (dateStr === this.selectedDateStr) cell.classList.add('is-selected');

      // Check special icons: Anniversary (Dec 8) or Birthday (Dec 7, Sep 9)
      const isAnniversaryDay = (this.currentMonth === 11 && d === 8);
      const isDomBday = (this.currentMonth === 11 && d === 7);
      const isEmmaBday = (this.currentMonth === 8 && d === 9);

      let specialIconBadge = '';
      if (isAnniversaryDay) {
        specialIconBadge = `<span class="day-special-icon anni-heart" title="Our Anniversary ❤️">❤️</span>`;
      } else if (isDomBday || isEmmaBday) {
        specialIconBadge = `<span class="day-special-icon bday-cake" title="Birthday!">🎂</span>`;
      }

      // Event dots / pills
      let eventsHtml = '<div class="day-events-wrapper">';
      events.forEach(ev => {
        const cat = this.categories[ev.category] || this.categories.date;
        eventsHtml += `
          <div class="day-event-pill" style="background:${cat.bg}; border-color:${cat.border}; color:${cat.color};" title="${ev.title}">
            <span class="pill-dot" style="background:${cat.color}"></span>
            <span class="pill-title">${ev.title}</span>
          </div>
        `;
      });
      eventsHtml += '</div>';

      cell.innerHTML = `
        <div class="day-header-row">
          <span class="day-number">${d}</span>
          ${specialIconBadge}
        </div>
        ${eventsHtml}
      `;

      cell.addEventListener('click', () => {
        this.selectDate(dateStr);
      });

      gridEl.appendChild(cell);
    }

    // 3. Trailing padding days to fill 7-col grid (up to 35 or 42 cells)
    const totalCellsSoFar = firstDayOfWeek + totalDaysInMonth;
    const remainingCells = (7 - (totalCellsSoFar % 7)) % 7;
    for (let j = 1; j <= remainingCells; j++) {
      const cell = document.createElement('div');
      cell.className = 'calendar-day-cell other-month';
      cell.innerHTML = `<span class="day-number">${j}</span>`;
      gridEl.appendChild(cell);
    }

    this.renderSelectedDay();
  },

  selectDate(dateStr) {
    this.selectedDateStr = dateStr;

    // Highlight selected cell
    document.querySelectorAll('.calendar-day-cell').forEach(cell => {
      cell.classList.toggle('is-selected', cell.getAttribute('data-date') === dateStr);
    });

    this.renderSelectedDay();
  },

  renderSelectedDay() {
    const container = document.getElementById('selected-day-details');
    if (!container) return;

    if (!this.selectedDateStr) {
      container.innerHTML = '<p class="empty-note">Click any day on the calendar to see what we have planned!</p>';
      return;
    }

    const d = this.parseDate(this.selectedDateStr);
    const options = { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' };
    const dateFormatted = d.toLocaleDateString('en-US', options);

    const events = this.getEventsForDate(this.selectedDateStr);

    let eventsHtml = '';
    if (events.length === 0) {
      eventsHtml = `
        <div class="empty-day-state">
          <span class="empty-spider-art">🕸️</span>
          <p class="empty-day-quote">nothing planned... yet.</p>
          <button type="button" class="btn-calendar-primary" onclick="CalendarApp.openAddModal('${this.selectedDateStr}')">
            + add a little plan
          </button>
        </div>
      `;
    } else {
      eventsHtml = events.map(ev => {
        const cat = this.categories[ev.category] || this.categories.date;
        return `
          <article class="event-detail-card" style="border-left: 3px solid ${cat.color};">
            <div class="event-detail-header">
              <span class="event-cat-badge" style="background:${cat.bg}; color:${cat.color};">
                ${cat.icon} ${cat.name}
              </span>
              ${ev.isRecurring ? '<span class="recurring-tag">Recurring Yearly</span>' : `
                <div class="event-action-btns">
                  <button type="button" class="btn-icon-action" onclick="CalendarApp.openEditModal('${ev.id}')" title="Edit">✎</button>
                  <button type="button" class="btn-icon-action" onclick="CalendarApp.deleteEvent('${ev.id}')" title="Delete">✕</button>
                </div>
              `}
            </div>
            <h4 class="event-detail-title">${ev.title}</h4>
            ${ev.time ? `<p class="event-detail-time">⏰ ${ev.time}</p>` : ''}
            ${ev.notes ? `<p class="event-detail-notes">"${ev.notes}"</p>` : ''}
          </article>
        `;
      }).join('');
    }

    container.innerHTML = `
      <div class="selected-day-header">
        <div>
          <span class="section-badge-tag">Selected Day</span>
          <h3 class="selected-date-heading">${dateFormatted}</h3>
        </div>
        ${events.length > 0 ? `
          <button type="button" class="btn-calendar-add-compact" onclick="CalendarApp.openAddModal('${this.selectedDateStr}')">
            + Add
          </button>
        ` : ''}
      </div>
      <div class="selected-day-events-list">
        ${eventsHtml}
      </div>
    `;
  },

  // --------------------------------------------------------------------------
  // Upcoming Events ("coming up for us")
  // --------------------------------------------------------------------------
  renderUpcoming() {
    const listEl = document.getElementById('upcoming-events-list');
    if (!listEl) return;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Collect events for current year and next year
    const y1 = today.getFullYear();
    const y2 = y1 + 1;

    const allEvents = [
      ...this.getRecurringEventsForYear(y1),
      ...this.getRecurringEventsForYear(y2),
      ...this.customEvents
    ];

    // Filter to upcoming
    const upcoming = allEvents.filter(ev => {
      const evDate = this.parseDate(ev.date);
      return evDate >= today;
    }).sort((a, b) => this.parseDate(a.date) - this.parseDate(b.date));

    const top5 = upcoming.slice(0, 5);

    if (top5.length === 0) {
      listEl.innerHTML = '<p class="empty-note">No upcoming events found.</p>';
      return;
    }

    listEl.innerHTML = top5.map(ev => {
      const evDate = this.parseDate(ev.date);
      const options = { month: 'short', day: 'numeric' };
      const formatted = evDate.toLocaleDateString('en-US', options);
      const cat = this.categories[ev.category] || this.categories.date;

      return `
        <div class="upcoming-item-row" onclick="CalendarApp.jumpToDate('${ev.date}')">
          <div class="upcoming-date-badge" style="background:${cat.bg}; color:${cat.color};">
            <span class="badge-month">${evDate.toLocaleDateString('en-US', { month: 'short' })}</span>
            <span class="badge-day">${evDate.getDate()}</span>
          </div>
          <div class="upcoming-info">
            <span class="upcoming-title">${ev.title}</span>
            <span class="upcoming-meta">${ev.notes ? ev.notes : cat.name}</span>
          </div>
        </div>
      `;
    }).join('');
  },

  jumpToDate(dateStr) {
    const d = this.parseDate(dateStr);
    this.currentYear = d.getFullYear();
    this.currentMonth = d.getMonth();
    this.selectedDateStr = dateStr;
    this.renderMonth();
  },

  // --------------------------------------------------------------------------
  // Anniversary Countdown
  // --------------------------------------------------------------------------
  initCountdown() {
    this.updateCountdown();
    setInterval(() => this.updateCountdown(), 60000); // update every minute
  },

  updateCountdown() {
    const now = new Date();
    const currentYear = now.getFullYear();

    // Target is Dec 8 of this year or next year
    let target = new Date(currentYear, 11, 8, 0, 0, 0);
    if (now > target) {
      target = new Date(currentYear + 1, 11, 8, 0, 0, 0);
    }

    const diff = target - now;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

    const anniNum = target.getFullYear() - 2025;
    const anniLabel = document.getElementById('countdown-anni-label');
    const daysEl = document.getElementById('countdown-days');
    const hoursEl = document.getElementById('countdown-hours');

    if (anniLabel) {
      anniLabel.textContent = `until our ${this.getOrdinal(anniNum)} anniversary ❤️`;
    }
    if (daysEl) daysEl.textContent = days;
    if (hoursEl) hoursEl.textContent = hours;
  },

  // --------------------------------------------------------------------------
  // Event Add / Edit / Delete Modals
  // --------------------------------------------------------------------------
  openAddModal(dateStr = '') {
    const modal = document.getElementById('event-modal');
    if (!modal) return;

    document.getElementById('event-modal-title').textContent = '+ Add a Little Plan';
    document.getElementById('event-id-hidden').value = '';
    document.getElementById('event-date-input').value = dateStr || this.selectedDateStr || this.formatDate(new Date());
    document.getElementById('event-title-input').value = '';
    document.getElementById('event-time-input').value = '';
    document.getElementById('event-notes-input').value = '';
    document.getElementById('event-category-select').value = 'date';
    document.getElementById('event-allday-check').checked = true;
    document.getElementById('event-time-group').style.display = 'none';

    modal.classList.remove('hidden');
  },

  openEditModal(id) {
    const ev = this.customEvents.find(e => e.id === id);
    if (!ev) return;

    const modal = document.getElementById('event-modal');
    if (!modal) return;

    document.getElementById('event-modal-title').textContent = 'Edit Plan';
    document.getElementById('event-id-hidden').value = ev.id;
    document.getElementById('event-date-input').value = ev.date;
    document.getElementById('event-title-input').value = ev.title;
    document.getElementById('event-category-select').value = ev.category || 'date';
    document.getElementById('event-time-input').value = ev.time || '';
    document.getElementById('event-notes-input').value = ev.notes || '';

    const isAllDay = !ev.time;
    document.getElementById('event-allday-check').checked = isAllDay;
    document.getElementById('event-time-group').style.display = isAllDay ? 'none' : 'block';

    modal.classList.remove('hidden');
  },

  saveModalEvent() {
    const id = document.getElementById('event-id-hidden').value;
    const title = document.getElementById('event-title-input').value.trim();
    const date = document.getElementById('event-date-input').value;
    const category = document.getElementById('event-category-select').value;
    const isAllDay = document.getElementById('event-allday-check').checked;
    const time = isAllDay ? '' : document.getElementById('event-time-input').value;
    const notes = document.getElementById('event-notes-input').value.trim();

    if (!title || !date) {
      alert('Please give our plan a title and a date!');
      return;
    }

    const eventData = {
      id: id || 'event_' + Date.now(),
      title,
      date,
      category,
      time,
      isAllDay,
      notes,
      updatedAt: new Date().toISOString()
    };

    if (id) {
      // Edit existing
      const idx = this.customEvents.findIndex(e => e.id === id);
      if (idx !== -1) {
        this.customEvents[idx] = eventData;
      }
    } else {
      // Add new
      this.customEvents.push(eventData);
    }

    // Save locally
    this.saveCustomEvents();

    // Sync to Firebase if active
    if (this.isFirebaseActive && this.firestoreDb) {
      this.syncEventToFirebase(eventData);
    }

    document.getElementById('event-modal').classList.add('hidden');
  },

  deleteEvent(id) {
    if (!confirm('Are you sure you want to remove this plan?')) return;

    this.customEvents = this.customEvents.filter(e => e.id !== id);
    this.saveCustomEvents();

    // Delete in Firebase if active
    if (this.isFirebaseActive && this.firestoreDb) {
      this.deleteEventInFirebase(id);
    }
  },

  // --------------------------------------------------------------------------
  // Firebase Real-time Firestore Synchronization
  // --------------------------------------------------------------------------
  initFirebase() {
    const configStr = localStorage.getItem(this.STORAGE_FIREBASE_CONFIG);
    const statusPill = document.getElementById('sync-status-indicator');

    if (!configStr) {
      // Running in Demo / Local mode
      if (statusPill) {
        statusPill.innerHTML = `
          <span class="status-dot demo"></span>
          <span>Demo / Local Mode (click to connect Firebase)</span>
        `;
        statusPill.onclick = () => this.openFirebaseConfigModal();
      }
      return;
    }

    try {
      const config = JSON.parse(configStr);

      // Check if Firebase compat script is loaded
      if (typeof firebase !== 'undefined' && config.apiKey && config.projectId) {
        if (!firebase.apps.length) {
          this.firebaseApp = firebase.initializeApp(config);
        } else {
          this.firebaseApp = firebase.app();
        }

        this.firestoreDb = firebase.firestore();
        this.isFirebaseActive = true;

        if (statusPill) {
          statusPill.innerHTML = `
            <span class="status-dot live"></span>
            <span>Real-time Synced with Firebase</span>
          `;
          statusPill.onclick = () => this.openFirebaseConfigModal();
        }

        // Set up real-time listener
        this.setupRealtimeListener();
      } else {
        if (statusPill) {
          statusPill.innerHTML = `
            <span class="status-dot warning"></span>
            <span>Firebase SDK pending or invalid config</span>
          `;
          statusPill.onclick = () => this.openFirebaseConfigModal();
        }
      }
    } catch (e) {
      console.error('Failed to init Firebase', e);
      if (statusPill) {
        statusPill.innerHTML = `
          <span class="status-dot warning"></span>
          <span>Firebase error (click to configure)</span>
        `;
        statusPill.onclick = () => this.openFirebaseConfigModal();
      }
    }
  },

  setupRealtimeListener() {
    if (!this.firestoreDb) return;

    const collectionRef = this.firestoreDb.collection('chapter_one_calendar');

    this.unsubscribeSnapshot = collectionRef.onSnapshot(snapshot => {
      const remoteEvents = [];
      snapshot.forEach(doc => {
        remoteEvents.push({ id: doc.id, ...doc.data() });
      });

      if (remoteEvents.length > 0) {
        // Merge with existing seed events
        this.customEvents = remoteEvents;
        this.saveCustomEvents();
      }
    }, err => {
      console.error('Firestore listener error:', err);
    });
  },

  syncEventToFirebase(eventData) {
    if (!this.firestoreDb) return;
    this.firestoreDb.collection('chapter_one_calendar').doc(eventData.id).set(eventData)
      .catch(err => console.error('Error writing to Firestore:', err));
  },

  deleteEventInFirebase(id) {
    if (!this.firestoreDb) return;
    this.firestoreDb.collection('chapter_one_calendar').doc(id).delete()
      .catch(err => console.error('Error deleting from Firestore:', err));
  },

  openFirebaseConfigModal() {
    const modal = document.getElementById('firebase-config-modal');
    if (!modal) return;

    const stored = localStorage.getItem(this.STORAGE_FIREBASE_CONFIG) || '';
    document.getElementById('firebase-config-textarea').value = stored;
    modal.classList.remove('hidden');
  },

  saveFirebaseConfig() {
    const textarea = document.getElementById('firebase-config-textarea');
    const val = textarea.value.trim();

    if (!val) {
      localStorage.removeItem(this.STORAGE_FIREBASE_CONFIG);
      alert('Firebase disconnected. Operating in local demo mode.');
      window.location.reload();
      return;
    }

    try {
      // Validate JSON or JS object syntax
      let parsed = null;
      if (val.startsWith('{')) {
        parsed = JSON.parse(val);
      } else {
        // Parse JS object style if user copied directly from Firebase console
        const jsonCompatible = val
          .replace(/([a-zA-Z0-9_]+):/g, '"$1":')
          .replace(/'/g, '"');
        parsed = JSON.parse(jsonCompatible);
      }

      localStorage.setItem(this.STORAGE_FIREBASE_CONFIG, JSON.stringify(parsed, null, 2));
      alert('Firebase credentials saved! Reloading to start live sync...');
      window.location.reload();
    } catch (e) {
      alert('Please check your Firebase config format. It should be a valid JSON object.');
    }
  },

  // --------------------------------------------------------------------------
  // Navigation & Events Binding
  // --------------------------------------------------------------------------
  bindEvents() {
    // Prev / Next month
    document.getElementById('btn-prev-month')?.addEventListener('click', () => {
      this.currentMonth--;
      if (this.currentMonth < 0) {
        this.currentMonth = 11;
        this.currentYear--;
      }
      this.renderMonth();
    });

    document.getElementById('btn-next-month')?.addEventListener('click', () => {
      this.currentMonth++;
      if (this.currentMonth > 11) {
        this.currentMonth = 0;
        this.currentYear++;
      }
      this.renderMonth();
    });

    // Today button
    document.getElementById('btn-calendar-today')?.addEventListener('click', () => {
      const now = new Date();
      this.currentYear = now.getFullYear();
      this.currentMonth = now.getMonth();
      this.selectedDateStr = this.formatDate(now);
      this.renderMonth();
    });

    // Year select dropdown
    document.getElementById('calendar-year-select')?.addEventListener('change', (e) => {
      this.currentYear = parseInt(e.target.value, 10);
      this.renderMonth();
    });

    // Add plan button
    document.getElementById('btn-open-add-plan')?.addEventListener('click', () => {
      this.openAddModal();
    });

    // Modal save/cancel
    document.getElementById('btn-save-event')?.addEventListener('click', () => {
      this.saveModalEvent();
    });
    document.getElementById('btn-cancel-event')?.addEventListener('click', () => {
      document.getElementById('event-modal').classList.add('hidden');
    });

    // All day toggle
    document.getElementById('event-allday-check')?.addEventListener('change', (e) => {
      document.getElementById('event-time-group').style.display = e.target.checked ? 'none' : 'block';
    });

    // Firebase modal buttons
    document.getElementById('btn-save-firebase-config')?.addEventListener('click', () => {
      this.saveFirebaseConfig();
    });
    document.getElementById('btn-cancel-firebase-config')?.addEventListener('click', () => {
      document.getElementById('firebase-config-modal').classList.add('hidden');
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  CalendarApp.init();
});
