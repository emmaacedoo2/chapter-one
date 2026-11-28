// Local-first travel journal. Records are Firestore-shaped, but are not shared yet.
const TravelApp = {
  STORAGE_KEY: 'chapter_one_travels_v1',
  GEOCODER_URL: 'https://photon.komoot.io/api/',
  SEED_DELAY_MS: 600,
  places: [],
  destinations: [],
  map: null,
  markerLayer: null,
  mapFilter: 'all',
  searchResults: [],
  selectedLocation: null,
  seedGeocodeRunning: false,
  dataLoadError: false,

  seedPlaces: [
    { place: 'Madrid', country: 'Spain', query: 'Madrid, Spain', visitedBy: ['emma', 'dom'] },
    { place: 'Galicia', country: 'Spain', query: 'Galicia, Spain', regional: true, visitedBy: ['emma'] },
    { place: 'Asturias', country: 'Spain', query: 'Asturias, Spain', regional: true, visitedBy: ['emma'] },
    { place: 'La Rioja', country: 'Spain', query: 'La Rioja, Spain', regional: true, visitedBy: ['emma'] },
    { place: 'Zaragoza', country: 'Spain', query: 'Zaragoza, Spain', visitedBy: ['emma'] },
    { place: 'Alicante', country: 'Spain', query: 'Alicante, Spain', visitedBy: ['emma'] },
    { place: 'Castellón', country: 'Spain', query: 'Castellón, Spain', visitedBy: ['emma'] },
    { place: 'Valencia', country: 'Spain', query: 'Valencia, Spain', visitedBy: ['emma'] },
    { place: 'Murcia', country: 'Spain', query: 'Murcia, Spain', visitedBy: ['emma'] },
    { place: 'Tarragona', country: 'Spain', query: 'Tarragona, Spain', visitedBy: ['emma'] },
    { place: 'Barcelona', country: 'Spain', query: 'Barcelona, Spain', visitedBy: ['emma'] },
    { place: 'Gran Canaria', country: 'Spain', query: 'Gran Canaria, Spain', regional: true, visitedBy: ['emma'] },
    { place: 'Tenerife', country: 'Spain', query: 'Tenerife, Spain', regional: true, visitedBy: ['emma'] },
    { place: 'Portugal', country: 'Portugal', query: 'Portugal', regional: true, visitedBy: ['emma'] },
    { place: 'London', country: 'United Kingdom', query: 'London, United Kingdom', visitedBy: ['emma'] },
    { place: 'Venice', country: 'Italy', query: 'Venice, Italy', visitedBy: ['emma'] },
    { place: 'Rome', country: 'Italy', query: 'Rome, Italy', visitedBy: ['emma'] },
    { place: 'Milan', country: 'Italy', query: 'Milan, Italy', visitedBy: ['emma'] },
    { place: 'Naples', country: 'Italy', query: 'Naples, Italy', visitedBy: ['emma', 'dom'] },
    { place: 'Florida', country: 'United States', query: 'Florida, United States', regional: true, visitedBy: ['emma', 'dom'] },
    { place: 'Alabama', country: 'United States', query: 'Alabama, United States', regional: true, visitedBy: ['emma'] },
    { place: 'Nashville', country: 'United States', query: 'Nashville, Tennessee, United States', visitedBy: ['emma'] },
    { place: 'Pittsburgh', country: 'United States', query: 'Pittsburgh, Pennsylvania, United States', visitedBy: ['emma', 'dom'] },
    { place: 'Saint Petersburg', country: 'Russia', query: 'Saint Petersburg, Russia', visitedBy: ['dom'] }
  ],

  init() {
    this.loadData();
    this.initMap();
    this.bindEvents();
    this.renderAll();

  },

  makeId(prefix) {
    const uuid = globalThis.crypto?.randomUUID?.();
    return `${prefix}-${uuid || `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`}`;
  },

  escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;'
    })[char]);
  },

  loadData() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved === null) {
        this.places = this.makeSeedPlaces();
        this.destinations = [];
        this.saveData();
        return;
      }

      const data = JSON.parse(saved);
      if (!data || !Array.isArray(data.places) || !Array.isArray(data.destinations)) {
        throw new Error('Travel data has an unexpected format.');
      }
      this.places = data.places;
      this.destinations = data.destinations;
    } catch (error) {
      console.error('Unable to load travel data:', error);
      this.dataLoadError = true;
      this.setStatus('Could not read saved travel data. Your saved data has not been replaced.', true);
      this.places = [];
      this.destinations = [];
    }
  },

  makeSeedPlaces() {
    const grouped = new Map();
    for (const seed of this.seedPlaces) {
      const key = `${seed.place.toLocaleLowerCase()}|${seed.country.toLocaleLowerCase()}`;
      const existing = grouped.get(key);
      if (existing) {
        existing.visitedBy = [...new Set([...existing.visitedBy, ...seed.visitedBy])];
        continue;
      }
      grouped.set(key, {
        id: `seed-${key.replace(/[^a-z0-9]+/g, '-')}`,
        place: seed.place,
        country: seed.country,
        query: seed.query,
        latitude: null,
        longitude: null,
        locationType: seed.regional ? 'region' : '',
        isRegional: Boolean(seed.regional),
        visitedBy: [...seed.visitedBy],
        visitMode: seed.visitedBy.length > 1 ? 'separately' : 'individual',
        sharedTrip: false,
        date: '',
        notes: '',
        photoUrl: '',
        isSeed: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      });
    }
    return [...grouped.values()];
  },

  saveData() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify({
        schemaVersion: 1,
        places: this.places,
        destinations: this.destinations
      }));
      this.renderAll();
      return true;
    } catch (error) {
      console.error('Unable to save travel data:', error);
      this.renderAll();
      this.setStatus('Could not save changes on this device. Check available browser storage.', true);
      return false;
    }
  },

  setStatus(message, isError = false) {
    const status = document.getElementById('travel-map-status');
    if (!status) return;
    status.textContent = message;
    status.classList.toggle('error', isError);
  },

  initMap() {
    // The image is a custom projection; these positions are manually placed on it.
    this.map = document.getElementById('travel-map');
  },

  async geocode(query) {
    const url = new URL(this.GEOCODER_URL);
    url.searchParams.set('q', query);
    url.searchParams.set('limit', '6');
    url.searchParams.set('lang', 'en');

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9000);
    try {
      const response = await fetch(url, { signal: controller.signal, headers: { Accept: 'application/geo+json' } });
      if (!response.ok) {
        const error = new Error(`Place search failed (${response.status}).`);
        error.status = response.status;
        throw error;
      }
      const data = await response.json();
      if (!Array.isArray(data.features)) throw new Error('The place search returned an invalid response.');
      return data.features.filter(feature =>
        Array.isArray(feature.geometry?.coordinates) &&
        Number.isFinite(feature.geometry.coordinates[0]) &&
        Number.isFinite(feature.geometry.coordinates[1])
      );
    } finally {
      clearTimeout(timeout);
    }
  },

  async geocodeSeedPlaces() {
    if (this.seedGeocodeRunning) return;
    const unlocated = this.places.filter(place => !this.hasCoordinates(place) && place.query);
    if (!unlocated.length) {
      this.setStatus(`Map ready · ${this.places.length} visited places saved on this device.`);
      return;
    }

    this.seedGeocodeRunning = true;
    let resolved = 0;
    this.setStatus(`Finding map positions for our starter places… 0 of ${unlocated.length}`);

    for (const place of unlocated) {
      try {
        const features = await this.geocode(place.query);
        const match = this.chooseSeedMatch(features, place);
        if (match) {
          const [longitude, latitude] = match.geometry.coordinates;
          const properties = match.properties || {};
          place.latitude = latitude;
          place.longitude = longitude;
          place.locationType = properties.type || properties.osm_value || place.locationType || '';
          place.isRegional = place.isRegional || ['state', 'county', 'region', 'country', 'island'].includes(place.locationType);
          place.geocoder = 'Photon';
          place.updatedAt = new Date().toISOString();
          resolved++;
          this.saveData();
        }
      } catch (error) {
        console.error(`Unable to locate ${place.query}:`, error);
        if (error.name === 'TypeError' || error.name === 'AbortError' || error.status === 429) break;
      }

      this.setStatus(`Finding map positions for our starter places… ${resolved} of ${unlocated.length}`);
      await new Promise(resolve => setTimeout(resolve, this.SEED_DELAY_MS));
    }

    this.seedGeocodeRunning = false;
    const remaining = this.places.filter(place => !this.hasCoordinates(place)).length;
    this.renderAll();
    this.setStatus(remaining
      ? `Map ready · ${resolved} starter places located; ${remaining} need a retry. Your place list is saved.`
      : `Map ready · ${this.places.length} places located.`, remaining > 0);
  },

  chooseSeedMatch(features, place) {
    const country = place.country.toLocaleLowerCase();
    const name = place.place.toLocaleLowerCase();
    return features.find(feature => {
      const properties = feature.properties || {};
      const featureCountry = String(properties.country || '').toLocaleLowerCase();
      const label = String(properties.name || '').toLocaleLowerCase();
      return featureCountry === country && (label === name || label.includes(name) || name.includes(label));
    }) || null;
  },

  hasCoordinates(place) {
    return Number.isFinite(place.latitude) && place.latitude >= -90 && place.latitude <= 90 &&
      Number.isFinite(place.longitude) && place.longitude >= -180 && place.longitude <= 180;
  },

  getVisitorMode(value) {
    if (value === 'emma') return { visitedBy: ['emma'], sharedTrip: false, visitMode: 'individual' };
    if (value === 'dom') return { visitedBy: ['dom'], sharedTrip: false, visitMode: 'individual' };
    if (value === 'separately') return { visitedBy: ['emma', 'dom'], sharedTrip: false, visitMode: 'separately' };
    if (value === 'together') return { visitedBy: ['emma', 'dom'], sharedTrip: true, visitMode: 'together' };
    return null;
  },

  getVisitorValue(place) {
    if (place.sharedTrip) return 'together';
    if (place.visitedBy?.length > 1) return 'separately';
    return place.visitedBy?.[0] || '';
  },

  getVisitorLabel(place) {
    if (place.sharedTrip) return 'Dom & Emma · visited together';
    if (place.visitedBy?.length > 1) return 'Dom & Emma · visited separately';
    return place.visitedBy?.[0] === 'emma' ? 'Emma' : 'Dom';
  },

  getMarkerKind(place) {
    if (place.sharedTrip) return 'together';
    if (place.visitedBy?.includes('emma') && place.visitedBy?.includes('dom')) return 'separate';
    return place.visitedBy?.includes('emma') ? 'emma' : 'dom';
  },

  passesFilter(place) {
    if (this.mapFilter === 'all') return true;
    if (this.mapFilter === 'both') return place.visitedBy?.includes('emma') && place.visitedBy?.includes('dom');
    return place.visitedBy?.length === 1 && place.visitedBy.includes(this.mapFilter);
  },

  renderAll() {
    this.renderMap();
    this.renderDestinations();
  },

  renderMap() {
    const pins = document.getElementById('outline-pins');
    if (!pins) return;
    // The original illustration uses hand-placed, proportional anchors.
    const positions = {
      Madrid: [308, 201, 'iberia'], Galicia: [300, 194, 'iberia'], Asturias: [306, 192, 'iberia'],
      'La Rioja': [315, 194, 'iberia'], Zaragoza: [319, 196, 'iberia'],
      Alicante: [316, 204, 'iberia'], Castellón: [319, 200, 'iberia'], Valencia: [318, 202, 'iberia'],
      Murcia: [315, 205, 'iberia'], Tarragona: [322, 197, 'iberia'], Barcelona: [325, 196, 'iberia'],
      'Gran Canaria': [276, 236, 'canaries'], Tenerife: [272, 235, 'canaries'],
      Portugal: [301, 203, 'iberia'], London: [319, 174], Venice: [354, 193, 'italy'],
      Rome: [358, 200, 'italy'], Milan: [350, 192, 'italy'], Naples: [361, 204, 'italy'],
      Florida: [117, 224, 'southeast'], Alabama: [105, 208, 'southeast'],
      Nashville: [112, 199, 'southeast'], Pittsburgh: [145, 184], 'Saint Petersburg': [385, 149]
    };
    const anchors = { iberia: [308, 201], italy: [355, 198], southeast: [112, 214], canaries: [274, 236] };
    const groups = new Map();
    const missing = [];
    const filtered = this.places.filter(place => this.passesFilter(place));
    for (const place of filtered) {
      const position = Object.hasOwn(positions, place.place) ? positions[place.place] : null;
      const original = this.seedPlaces.find(seed => seed.place === place.place && seed.country === place.country);
      if (!position || !original) { missing.push(place); continue; }
      const [x, y, cluster] = position;
      const group = cluster || place.place;
      const [anchorX, anchorY] = anchors[cluster] || [x, y];
      if (!groups.has(group)) groups.set(group, { pos: [anchorX / 735 * 100, anchorY / 551 * 100], places: [] });
      groups.get(group).places.push(place);
    }
    pins.replaceChildren();
    const picker = document.getElementById('map-place-picker');
    picker.replaceChildren(new Option('Choose a place', ''), ...filtered.map(place =>
      new Option(place.place + ', ' + place.country + ' · ' + this.getVisitorLabel(place), place.id)));
    picker.disabled = !filtered.length;
    this.showMapDetails([]);
    groups.forEach(({pos, places}) => {
      const kinds = new Set(places.flatMap(p => p.visitedBy || []));
      const kind = kinds.size > 1 ? 'both' : kinds.has('dom') ? 'dom' : 'emma';
      const button = document.createElement('button');
      button.type = 'button'; button.className = `outline-pin ${kind}`;
      button.style.left = `${pos[0]}%`; button.style.top = `${pos[1]}%`;
      button.setAttribute('aria-label', `${places.length} location${places.length === 1 ? '' : 's'}: ${places.map(p=>p.place).join(', ')}`);
      button.addEventListener('click', () => {
        picker.value = places.length === 1 ? places[0].id : '';
        pins.querySelectorAll('button').forEach(pin => pin.setAttribute('aria-pressed', String(pin === button)));
        this.showMapDetails(places);
      });
      button.setAttribute('aria-pressed', 'false');
      if (places.length > 1) button.textContent = String(places.length);
      pins.append(button);
    });
    if (!this.dataLoadError) {
      this.setStatus(missing.length
        ? `${missing.length} saved place(s) are available in the selector without a map marker.`
        : `${filtered.length} visited places · nearby markers are grouped.`);
    }
  },

  showMapDetails(places) {
    const details = document.getElementById('map-details');
    details.innerHTML = places.length ? places.map(place => this.getPopupHtml(place)).join('') :
      'Choose a map marker or a visited place.';
  },

  getPopupHtml(place) {
    const visitorText = this.escapeHtml(this.getVisitorLabel(place));
    const regionText = place.isRegional ? '<p class="travel-popup-region">Regional area · approximate map center</p>' : '';
    const dateText = place.date ? `<p>${this.escapeHtml(place.date)}</p>` : '';
    const notesText = place.notes ? `<p>${this.escapeHtml(place.notes)}</p>` : '';
    const photoUrl = this.safePhotoUrl(place.photoUrl);
    const photo = photoUrl ? `<img src="${this.escapeHtml(photoUrl)}" alt="Photo from ${this.escapeHtml(place.place)}" loading="lazy">` : '';
    const id = this.escapeHtml(place.id);
    const togetherText = place.sharedTrip ? 'Yes — a shared trip' : 'No — not marked as a shared trip';
    return `<div class="travel-map-popup">
      <h3>${this.escapeHtml(place.place)}</h3>
      <p>${this.escapeHtml(place.country)}</p>
      ${regionText}
      <p><strong>Who:</strong> ${visitorText}</p>
      <p><strong>Shared trip:</strong> ${togetherText}</p>
      ${dateText}${notesText}${photo}
      <button type="button" data-travel-edit="${id}">Edit place</button>
      <button type="button" data-travel-delete="${id}">Delete place</button>
    </div>`;
  },

  safePhotoUrl(value) {
    if (!value) return '';
    try {
      const url = new URL(value);
      return ['http:', 'https:'].includes(url.protocol) ? url.href : '';
    } catch {
      return '';
    }
  },

  openPlaceModal(placeId = '', prefillQuery = '') {
    const form = document.getElementById('place-form');
    const modal = document.getElementById('place-modal');
    const place = this.places.find(item => item.id === placeId);
    this.selectedLocation = place ? {
      name: place.place, country: place.country, latitude: place.latitude, longitude: place.longitude,
      locationType: place.locationType || '', isRegional: Boolean(place.isRegional), query: place.query || `${place.place}, ${place.country}`
    } : null;
    document.getElementById('place-modal-title').textContent = place ? 'Edit a place' : 'A place we’ve been';
    document.getElementById('place-id').value = place?.id || '';
    document.getElementById('place-search').value = place
      ? `${place.place}, ${place.country}`
      : prefillQuery;
    document.getElementById('place-visitors').value = place ? this.getVisitorValue(place) : '';
    document.getElementById('place-date').value = place?.date || '';
    document.getElementById('place-photo').value = place?.photoUrl || '';
    document.getElementById('place-notes').value = place?.notes || '';
    document.getElementById('place-form-error').textContent = '';
    document.getElementById('geocode-results').innerHTML = '';
    this.renderSelectedLocation();
    modal.classList.remove('hidden');

    if (!place && prefillQuery) void this.searchPlaces(prefillQuery);
    form.querySelector('input[type="search"]')?.focus();
  },

  renderSelectedLocation() {
    const summary = document.getElementById('selected-location-summary');
    if (!summary) return;
    if (!this.selectedLocation) {
      summary.classList.add('hidden');
      summary.textContent = '';
      return;
    }
    const regional = this.selectedLocation.isRegional ? ' · regional / approximate position' : '';
    summary.textContent = `Selected: ${this.selectedLocation.name}, ${this.selectedLocation.country}${regional}`;
    summary.classList.remove('hidden');
  },

  async searchPlaces(query) {
    const resultsEl = document.getElementById('geocode-results');
    const errorEl = document.getElementById('place-form-error');
    const searchTerm = query.trim();
    if (!searchTerm) {
      errorEl.textContent = 'Enter a city, region, or country to search.';
      return;
    }
    errorEl.textContent = '';
    resultsEl.innerHTML = '<p class="travel-field-hint">Searching Photon for matching map locations…</p>';
    try {
      this.searchResults = await this.geocode(searchTerm);
      if (!this.searchResults.length) {
        resultsEl.innerHTML = '<p class="travel-field-hint">No matching locations found. Try adding a country or region to the search.</p>';
        return;
      }
      resultsEl.innerHTML = this.searchResults.map((feature, index) => {
        const properties = feature.properties || {};
        const detail = [properties.state, properties.country].filter(Boolean).join(', ');
        return `<button type="button" class="geocode-result" data-geocode-result="${index}">
          <strong>${this.escapeHtml(properties.name || searchTerm)}</strong>
          <span>${this.escapeHtml(detail || properties.type || 'Geocoded location')}</span>
        </button>`;
      }).join('');
    } catch (error) {
      console.error('Place search error:', error);
      resultsEl.innerHTML = '<p class="travel-form-error">Place search is unavailable right now. Check your connection and try again.</p>';
    }
  },

  chooseGeocodeResult(index) {
    const feature = this.searchResults[index];
    if (!feature) return;
    const properties = feature.properties || {};
    const [longitude, latitude] = feature.geometry.coordinates;
    const name = properties.name || document.getElementById('place-search').value.trim();
    const country = properties.country || '';
    const locationType = properties.type || properties.osm_value || '';
    this.selectedLocation = {
      name,
      country,
      latitude,
      longitude,
      locationType,
      isRegional: ['state', 'county', 'region', 'country', 'island'].includes(locationType),
      query: document.getElementById('place-search').value.trim(),
      geocoder: 'Photon'
    };
    this.renderSelectedLocation();
    document.querySelectorAll('.geocode-result').forEach((button, buttonIndex) => {
      button.setAttribute('aria-pressed', String(buttonIndex === index));
    });
  },

  savePlace(event) {
    event.preventDefault();
    const errorEl = document.getElementById('place-form-error');
    const placeId = document.getElementById('place-id').value;
    const placeName = document.getElementById('place-search').value.trim();
    const visitor = this.getVisitorMode(document.getElementById('place-visitors').value);
    if (!this.selectedLocation || (!this.hasCoordinates(this.selectedLocation) && !placeId)) {
      errorEl.textContent = 'Choose a geocoding result before saving this map pin.';
      return;
    }
    if (!this.selectedLocation.country) {
      errorEl.textContent = 'Choose a location result that includes its country.';
      return;
    }
    if (!visitor) {
      errorEl.textContent = 'Choose who visited. “Together” is only for a trip you shared.';
      return;
    }

    const existing = this.places.find(place => place.id === placeId);
    const place = {
      id: existing?.id || this.makeId('place'),
      place: this.selectedLocation.name || placeName,
      country: this.selectedLocation.country,
      query: this.selectedLocation.query,
      latitude: this.selectedLocation.latitude,
      longitude: this.selectedLocation.longitude,
      locationType: this.selectedLocation.locationType || '',
      isRegional: Boolean(this.selectedLocation.isRegional),
      geocoder: 'Photon',
      ...visitor,
      date: document.getElementById('place-date').value,
      photoUrl: document.getElementById('place-photo').value.trim(),
      notes: document.getElementById('place-notes').value.trim(),
      isSeed: existing?.isSeed || false,
      createdAt: existing?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    if (existing) {
      this.places = this.places.map(item => item.id === existing.id ? place : item);
    } else {
      this.places.push(place);
    }
    if (!this.saveData()) return;
    this.closeModal('place-modal');
  },

  deletePlace(placeId) {
    const place = this.places.find(item => item.id === placeId);
    if (!place || !confirm(`Remove ${place.place}, ${place.country} from our map?`)) return;
    this.places = this.places.filter(item => item.id !== placeId);
    this.saveData();
  },

  addDestination(event) {
    event.preventDefault();
    const nameInput = document.getElementById('destination-name');
    const noteInput = document.getElementById('destination-note');
    const status = document.getElementById('destination-status').value;
    const name = nameInput.value.trim();
    if (!name) return;
    const destination = {
      id: this.makeId('destination'),
      name,
      notes: noteInput.value.trim(),
      status,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.destinations.push(destination);
    if (!this.saveData()) return;
    document.getElementById('destination-form').reset();
    document.getElementById('destination-form').hidden = true;
    if (status === 'visited') this.offerMapAdd(destination);
  },

  renderDestinations() {
    const list = document.getElementById('destination-list');
    if (!list) return;
    const future = this.destinations.filter(destination => destination.status !== 'visited');
    const visited = this.destinations.filter(destination => destination.status === 'visited');
    const labels = { dreaming: 'Dreaming of', planning: 'Planning', visited: "We've been!" };
    const card = destination => `
      <article class="destination-item">
        <div class="destination-item-heading">
          <div>
            <h3 class="destination-title">${this.escapeHtml(destination.name)}</h3>
            <span class="destination-status ${this.escapeHtml(destination.status)}">${labels[destination.status] || 'Dreaming of'}</span>
          </div>
          <select class="destination-status-select" data-destination-status="${this.escapeHtml(destination.id)}" aria-label="Update status for ${this.escapeHtml(destination.name)}">
            <option value="dreaming" ${destination.status === 'dreaming' ? 'selected' : ''}>Dreaming of</option>
            <option value="planning" ${destination.status === 'planning' ? 'selected' : ''}>Planning</option>
            <option value="visited" ${destination.status === 'visited' ? 'selected' : ''}>We've been!</option>
          </select>
        </div>
        ${destination.notes ? `<p class="destination-note">${this.escapeHtml(destination.notes)}</p>` : ''}
        <div class="travel-card-actions">
          ${destination.status === 'visited' ? `<button type="button" data-destination-map="${this.escapeHtml(destination.id)}">add to map</button>` : ''}
          <button type="button" data-destination-edit="${this.escapeHtml(destination.id)}">edit</button>
          <button type="button" data-destination-delete="${this.escapeHtml(destination.id)}">delete</button>
        </div>
      </article>
    `;
    list.innerHTML = future.map(card).join('') || '<p class="travel-empty-state">No future destinations saved yet.</p>';
    if (visited.length) list.innerHTML += `<details class="travel-visited-wishlist"><summary>Previously on the wishlist (${visited.length})</summary><div class="destination-list">${visited.map(card).join('')}</div></details>`;
  },

  changeDestinationStatus(destinationId, status) {
    const destination = this.destinations.find(item => item.id === destinationId);
    if (!destination || !['dreaming', 'planning', 'visited'].includes(status)) return;
    const justVisited = status === 'visited' && destination.status !== 'visited';
    destination.status = status;
    destination.updatedAt = new Date().toISOString();
    if (!this.saveData()) return;
    if (justVisited) this.offerMapAdd(destination);
  },

  offerMapAdd(destination) {
    if (!confirm(`Add ${destination.name} to the visited map? You’ll choose who went there next.`)) return;
    document.getElementById('destination-modal').classList.add('hidden');
    this.openPlaceModal('', destination.name);
  },

  openDestinationEdit(destinationId) {
    const destination = this.destinations.find(item => item.id === destinationId);
    if (!destination) return;
    document.getElementById('destination-edit-id').value = destination.id;
    document.getElementById('destination-edit-name').value = destination.name;
    document.getElementById('destination-edit-note').value = destination.notes || '';
    document.getElementById('destination-edit-status').value = destination.status;
    document.getElementById('destination-form-error').textContent = '';
    document.getElementById('destination-modal').classList.remove('hidden');
  },

  saveDestinationEdit(event) {
    event.preventDefault();
    const id = document.getElementById('destination-edit-id').value;
    const destination = this.destinations.find(item => item.id === id);
    const name = document.getElementById('destination-edit-name').value.trim();
    const notes = document.getElementById('destination-edit-note').value.trim();
    const status = document.getElementById('destination-edit-status').value;
    if (!destination || !name) {
      document.getElementById('destination-form-error').textContent = 'Please add a destination name.';
      return;
    }
    const justVisited = status === 'visited' && destination.status !== 'visited';
    Object.assign(destination, { name, notes, status, updatedAt: new Date().toISOString() });
    if (!this.saveData()) return;
    this.closeModal('destination-modal');
    if (justVisited) this.offerMapAdd(destination);
  },

  deleteDestination(destinationId) {
    const destination = this.destinations.find(item => item.id === destinationId);
    if (!destination || !confirm(`Remove ${destination.name} from our travel list?`)) return;
    this.destinations = this.destinations.filter(item => item.id !== destinationId);
    this.saveData();
  },

  closeModal(id) {
    document.getElementById(id)?.classList.add('hidden');
  },

  bindEvents() {
    document.getElementById('btn-add-place').addEventListener('click', () => this.openPlaceModal());
    document.getElementById('btn-search-place').addEventListener('click', () => {
      void this.searchPlaces(document.getElementById('place-search').value);
    });
    document.getElementById('place-search').addEventListener('keydown', event => {
      if (event.key === 'Enter') {
        event.preventDefault();
        void this.searchPlaces(event.currentTarget.value);
      }
    });
    document.getElementById('place-search').addEventListener('input', event => {
      if (!this.selectedLocation) return;
      const current = event.currentTarget.value.trim();
      const selectedLabel = `${this.selectedLocation.name}, ${this.selectedLocation.country}`;
      if (current !== selectedLabel && current !== this.selectedLocation.query) {
        this.selectedLocation = null;
        this.renderSelectedLocation();
      }
    });
    document.getElementById('place-form').addEventListener('submit', event => this.savePlace(event));
    document.getElementById('destination-form').addEventListener('submit', event => this.addDestination(event));
    document.getElementById('destination-edit-form').addEventListener('submit', event => this.saveDestinationEdit(event));
    document.getElementById('btn-add-destination').addEventListener('click', () => {
      document.getElementById('destination-form').hidden = false;
      document.getElementById('destination-name').focus();
    });

    document.querySelectorAll('[data-close-modal]').forEach(button => {
      button.addEventListener('click', () => this.closeModal(button.dataset.closeModal));
    });
    document.querySelectorAll('.travel-modal-overlay').forEach(overlay => {
      overlay.addEventListener('click', event => {
        if (event.target === overlay) this.closeModal(overlay.id);
      });
    });

    document.querySelectorAll('[data-map-filter]').forEach(button => {
      button.addEventListener('click', () => {
        this.mapFilter = button.dataset.mapFilter;
        document.querySelectorAll('[data-map-filter]').forEach(filter => {
          filter.classList.toggle('active', filter === button);
          filter.setAttribute('aria-pressed', String(filter === button));
        });
        this.renderMap();
      });
    });

    document.getElementById('geocode-results').addEventListener('click', event => {
      const button = event.target.closest('[data-geocode-result]');
      if (button) this.chooseGeocodeResult(Number(button.dataset.geocodeResult));
    });

    document.getElementById('map-place-picker').addEventListener('change', event => {
      document.querySelectorAll('.outline-pin').forEach(pin => pin.setAttribute('aria-pressed', 'false'));
      this.showMapDetails(this.places.filter(place => place.id === event.target.value));
    });

    document.getElementById('destination-list').addEventListener('click', event => {
      const edit = event.target.closest('[data-destination-edit]');
      const remove = event.target.closest('[data-destination-delete]');
      const map = event.target.closest('[data-destination-map]');
      if (edit) this.openDestinationEdit(edit.dataset.destinationEdit);
      if (remove) this.deleteDestination(remove.dataset.destinationDelete);
      if (map) {
        const destination = this.destinations.find(item => item.id === map.dataset.destinationMap);
        if (destination) this.offerMapAdd(destination);
      }
    });

    document.getElementById('destination-list').addEventListener('change', event => {
      const select = event.target.closest('[data-destination-status]');
      if (select) this.changeDestinationStatus(select.dataset.destinationStatus, select.value);
    });

    document.addEventListener('click', event => {
      const edit = event.target.closest('[data-travel-edit]');
      if (edit) this.openPlaceModal(edit.dataset.travelEdit);
      const remove = event.target.closest('[data-travel-delete]');
      if (remove) this.deletePlace(remove.dataset.travelDelete);
    });
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        this.closeModal('place-modal');
        this.closeModal('destination-modal');
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => TravelApp.init());
