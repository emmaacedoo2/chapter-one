// ==========================================================================
// Our Songs - JavaScript Controller & Data
// Chapter One Music Page
// ==========================================================================

const MusicApp = {
  // Storage keys
  STORAGE_PLAYLIST_URL: 'chapter_one_playlist_url',
  STORAGE_MEMORY_SONGS: 'chapter_one_memory_songs',

  // Config defaults
  previousDefaultPlaylistUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
  defaultPlaylistUrl: 'https://open.spotify.com/playlist/66vQZL2ulkvpdsEAyZ0QLr',

  // Dom's favorite artists data
  artists: {
    mac: {
      name: 'Mac Miller',
      genre: 'Hip Hop / Jazz Rap',
      bio: 'One of Dom\'s all-time favorites. From Swimming to Circles and Watching Movies.',
      playlistId: '37i9dQZF1DZ06evO2NufN6',
      spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DZ06evO2NufN6',
      color: '#d4a373'
    },
    suicideboys: {
      name: '$uicideboy$',
      genre: 'Underground Hip Hop / Dark Trap',
      bio: 'Scrim & Ruby. Hard-hitting 808s and raw emotion.',
      playlistId: '37i9dQZF1DZ06evO15CHq8',
      spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DZ06evO15CHq8',
      color: '#a81d1d'
    },
    x: {
      name: 'XXXTENTACION',
      genre: 'Alternative / Emo Rap',
      bio: 'Jahseh Onfroy. From acoustic ballads like Jocelyn Flores to energetic anthems.',
      playlistId: '37i9dQZF1DZ06evO0AnZXW',
      spotifyUrl: 'https://open.spotify.com/playlist/37i9dQZF1DZ06evO0AnZXW',
      color: '#2b2b36'
    }
  },

  // Cover images are the official Spotify oEmbed thumbnails for these releases.
  initialRemindSongs: [
    {
      "id": 1,
      "title": "Sailor Song",
      "artist": "Gigi Perez",
      "album": "Sailor Song (Single)",
      "year": 2024,
      "message": "When we were first getting to know each other, you loved this song and played it all the time. Now, no matter where I am, it will always remind me of you. ♡",
      "artwork": "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e020f588c6bdb28000656d084bf",
      "spotifyTrackId": "0UYnhUfnUj5adChuAXvLUB",
      "spotifyUrl": "https://open.spotify.com/track/0UYnhUfnUj5adChuAXvLUB",
      "appleUrl": "https://music.apple.com/us/album/sailor-song-single/1770187509",
      "youtubeUrl": "https://www.youtube.com/watch?v=1lrFsXkT_rM"
    },
    {
      "id": 2,
      "title": "My Flaws Burn Through My Skin Like Demonic Flames from Hell",
      "artist": "$uicideboy$",
      "album": "I No Longer Fear the Razor Guarding My Heel",
      "year": 2015,
      "message": "I know how much you love $uicideboy$, and this was the first song of theirs you ever showed me. Every time I hear it, I think of you. ♡",
      "artwork": "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02774096669395b9d64fa2fcbe",
      "spotifyTrackId": "6QFQqqYye5lAcnhCALvxKJ",
      "spotifyUrl": "https://open.spotify.com/track/6QFQqqYye5lAcnhCALvxKJ"
    },
    {
      "id": 3,
      "title": "Me Gustas Tú",
      "artist": "Manu Chao",
      "album": "Próxima Estación: Esperanza",
      "year": 2001,
      "message": "You really like this song, and I feel like it matches your vibe so perfectly. There's something about it that just feels like you. ♡",
      "artwork": "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0219cef818afeaf523d705115f",
      "spotifyTrackId": "6t0fYRoZlM5kQ9qT19JnbZ",
      "spotifyUrl": "https://open.spotify.com/track/6t0fYRoZlM5kQ9qT19JnbZ"
    },
    {
      "id": 4,
      "title": "ME JALO",
      "artist": "Fuerza Regida & Grupo Frontera",
      "album": "MALA MÍA",
      "year": 2024,
      "message": "You're always telling me how people think you're Mexican and how much you hate it, but then you love Mexican music without even knowing what they're saying. It makes me laugh, and that's why this song reminds me so much of you. ♡",
      "artwork": "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0204874856f3c501181d060128",
      "spotifyTrackId": "3D24ErT1MMmUfXWotSj2A2",
      "spotifyUrl": "https://open.spotify.com/track/3D24ErT1MMmUfXWotSj2A2",
      "appleUrl": "https://music.apple.com/us/song/1786262012"
    },
    {
      "id": 5,
      "title": "The Spins",
      "artist": "Mac Miller",
      "album": "K.I.D.S.",
      "year": 2010,
      "message": "I know how much you love Mac Miller, and this is one of those songs that instantly makes me think of you. ♡",
      "artwork": "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e0250570144b4a9a459406f9a3d",
      "spotifyTrackId": "51pshtuYkgUQnt5huMPbKL",
      "spotifyUrl": "https://open.spotify.com/track/51pshtuYkgUQnt5huMPbKL"
    },
    {
      "id": 6,
      "title": "'03 Bonnie & Clyde",
      "artist": "JAY-Z feat. Beyoncé",
      "album": "The Blueprint 2: The Gift & The Curse",
      "year": 2002,
      "message": "I don't even know if you know this song, but I really like it, and something about it gives me such an us vibe. ♡",
      "artwork": "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02b7c45af95aaf599cee3acf08",
      "spotifyTrackId": "5ljCWsDlSyJ41kwqym2ORw",
      "spotifyUrl": "https://open.spotify.com/track/5ljCWsDlSyJ41kwqym2ORw",
      "appleUrl": "https://music.apple.com/us/song/1440935229"
    },
    {
      "id": 7,
      "title": "Come On Eileen",
      "artist": "Dexys Midnight Runners",
      "album": "Too Rye Ay",
      "year": 1982,
      "message": "You're always playing this song, and it gives me such good vibes. I can't listen to it without thinking of you and smiling.",
      "artwork": "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e02d76cc2f77662cac38f84b4c6",
      "spotifyTrackId": "0EMmVUYs9ZZRHtlADB88uz",
      "spotifyUrl": "https://open.spotify.com/track/0EMmVUYs9ZZRHtlADB88uz"
    },
    {
      "id": 8,
      "title": "No Church in the Wild",
      "artist": "JAY-Z & Kanye West feat. Frank Ocean & The-Dream",
      "album": "Watch The Throne",
      "year": 2011,
      "message": "You play this song all the time, and I love that it's not one of the songs everyone usually plays. There's something about it that feels so uniquely you.",
      "artwork": "https://image-cdn-ak.spotifycdn.com/image/ab67616d00001e0252e61456aa4995ba48d94e30",
      "spotifyTrackId": "7r6PigmGzlB3YPB7wvBBbi",
      "spotifyUrl": "https://open.spotify.com/track/7r6PigmGzlB3YPB7wvBBbi"
    },
    {
      "id": 9,
      "title": "American Pie",
      "artist": "Don McLean",
      "album": "American Pie",
      "year": 1971,
      "message": "I still remember making a TikTok for you with this song. There's something so American about it that always makes me think of you. My favorite American. ♡",
      "artwork": "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e020085dd4362653ef4c54ebbeb",
      "spotifyTrackId": "1fDsrQ23eTAVFElUMaf38X",
      "spotifyUrl": "https://open.spotify.com/track/1fDsrQ23eTAVFElUMaf38X"
    },
    {
      "id": 10,
      "title": "Take Me Home, Country Roads",
      "artist": "John Denver",
      "album": "Poems, Prayers and Promises",
      "year": 1971,
      "message": "This song reminds me of America, but most importantly, it reminds me of you. I know how much you love it, and it makes me think about how lucky I am that coming to America led me to you. ♡",
      "artwork": "https://image-cdn-fa.spotifycdn.com/image/ab67616d00001e02795c9ba853f5a9f7a88b4e31",
      "spotifyTrackId": "1YYhDizHx7PnDhAhko6cDS",
      "spotifyUrl": "https://open.spotify.com/track/1YYhDizHx7PnDhAhko6cDS"
    }
  ],

  // State
  activeArtistKey: 'mac',

  init() {
    this.initPlaylistSection();
    this.initRemindSongs();
    this.initVinylRecords();
  },

  // --------------------------------------------------------------------------
  // 1. Shared Playlist Section
  // --------------------------------------------------------------------------
  initPlaylistSection() {
    const storedUrl = localStorage.getItem(this.STORAGE_PLAYLIST_URL);
    let savedUrl = storedUrl === this.previousDefaultPlaylistUrl
      ? this.defaultPlaylistUrl
      : this.normalizePlaylistUrl(storedUrl) || this.defaultPlaylistUrl;
    if (storedUrl === this.previousDefaultPlaylistUrl) {
      localStorage.setItem(this.STORAGE_PLAYLIST_URL, this.defaultPlaylistUrl);
    }
    this.renderPlaylistEmbed(savedUrl);

    const editBtn = document.getElementById('btn-edit-playlist');
    const modal = document.getElementById('playlist-modal');
    const saveBtn = document.getElementById('btn-save-playlist');
    const cancelBtn = document.getElementById('btn-cancel-playlist');
    const input = document.getElementById('playlist-url-input');
    const openSpotifyBtn = document.getElementById('btn-open-playlist-spotify');
    const addSongSpotifyBtn = document.getElementById('btn-add-song-spotify');

    [openSpotifyBtn, addSongSpotifyBtn].forEach(button => {
      if (button) button.href = savedUrl;
    });

    if (editBtn && modal) {
      editBtn.addEventListener('click', () => {
        if (input) input.value = savedUrl;
        modal.classList.remove('hidden');
      });
    }

    if (cancelBtn && modal) {
      cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }

    if (saveBtn && input && modal) {
      saveBtn.addEventListener('click', () => {
        const val = this.normalizePlaylistUrl(input.value.trim());
        if (!val) {
          input.setCustomValidity('Please enter a valid Spotify playlist link or URI.');
          input.reportValidity();
          input.setCustomValidity('');
          return;
        }
        if (val) {
          savedUrl = val;
          localStorage.setItem(this.STORAGE_PLAYLIST_URL, val);
          this.renderPlaylistEmbed(val);
          [openSpotifyBtn, addSongSpotifyBtn].forEach(button => {
            if (button) button.href = val;
          });
        }
        modal.classList.add('hidden');
      });
    }
  },

  normalizePlaylistUrl(value) {
    if (!value) return null;
    const match = value.match(/^spotify:playlist:([a-zA-Z0-9]{22})$/) ||
      value.match(/^https:\/\/open\.spotify\.com\/(?:embed\/)?playlist\/([a-zA-Z0-9]{22})(?:[/?#].*)?$/);
    return match ? `https://open.spotify.com/playlist/${match[1]}` : null;
  },

  renderPlaylistEmbed(url) {
    const container = document.getElementById('spotify-playlist-embed-container');
    if (!container) return;

    // Convert standard Spotify playlist URL to embed URL
    // e.g., https://open.spotify.com/playlist/XYZ -> https://open.spotify.com/embed/playlist/XYZ
    let embedSrc = url;
    if (url.includes('open.spotify.com/playlist/')) {
      embedSrc = url.replace('open.spotify.com/playlist/', 'open.spotify.com/embed/playlist/');
    }

    container.innerHTML = `
      <iframe class="playlist-embed-frame"
        title="Spotify playlist: 1st🖤"
        src="${embedSrc}?utm_source=generator&theme=1"
        width="100%" height="352"
        frameBorder="0"
        allowfullscreen="" 
        allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
        loading="lazy">
      </iframe>
    `;
  },

  // --------------------------------------------------------------------------
  // 2. Songs That Remind Me Of You
  // --------------------------------------------------------------------------
  initRemindSongs() {
    const expanded = document.getElementById('remind-expanded');
    const toggle = document.getElementById('remind-toggle');
    toggle.addEventListener('click', () => {
      expanded.hidden = !expanded.hidden;
      if (expanded.hidden) {
        for (const player of expanded.querySelectorAll('.remind-preview[open]')) {
          player.open = false;
          player.querySelector('iframe')?.remove();
        }
      }
      this.updateRemindToggle(this.getRemindSongs().length);
      const target = expanded.hidden ? toggle : expanded.querySelector('h3');
      if (target) {
        target.focus({ preventScroll: true });
        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        target.scrollIntoView({ block: 'nearest', behavior: reducedMotion ? 'auto' : 'smooth' });
      }
    });
    this.renderRemindSongs();

    const modal = document.getElementById('remind-song-modal');
    const form = document.getElementById('song-memory-form');
    const status = document.getElementById('song-memory-status');
    document.getElementById('btn-add-remind-song').addEventListener('click', () => modal.showModal());
    document.getElementById('btn-cancel-remind-song').addEventListener('click', () => modal.close());
    form.addEventListener('submit', event => {
      event.preventDefault();
      const song = Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, value.trim()]));
      if (!song.title || !song.artist || !song.message) {
        status.textContent = 'Add a title, artist and personal note.';
        return;
      }
      const links = { spotifyUrl: ['open.spotify.com'], appleUrl: ['music.apple.com'],
        youtubeUrl: ['www.youtube.com', 'youtube.com', 'youtu.be'], artwork: [] };
      for (const [field, hosts] of Object.entries(links)) {
        if (song[field] && !this.musicUrl(song[field], hosts)) {
          status.textContent = 'Enter a valid HTTPS link for ' + form.elements.namedItem(field).labels[0].textContent.trim() + '.';
          return;
        }
      }
      const track = this.remindTrackId(song);
      if (song.spotifyUrl && !track) {
        status.textContent = 'Use a Spotify link to the individual track.';
        return;
      }
      if (track) song.spotifyTrackId = track;
      if (this.getRemindSongs().some(existing => this.sameRemindSong(existing, song))) {
        status.textContent = 'This song is already in the collection.';
        return;
      }
      song.id = Date.now();
      try {
        localStorage.setItem(this.STORAGE_MEMORY_SONGS, JSON.stringify([...this.savedRemindSongs(), song]));
      } catch {
        status.textContent = 'This browser could not save your song.';
        return;
      }
      form.reset();
      status.textContent = '';
      modal.close();
      expanded.hidden = false;
      this.renderRemindSongs();
    });
  },

  musicUrl(value, hosts = []) {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && (!hosts.length || hosts.includes(url.hostname)) ? url.href : '';
    } catch { return ''; }
  },

  remindTrackId(song) {
    const link = this.musicUrl(song.spotifyUrl, ['open.spotify.com']);
    const path = link ? new URL(link).pathname : '';
    return path.match(/^\/(?:intl-[a-z]+\/)?track\/([a-zA-Z0-9]{22})\/?$/)?.[1] ||
      (/^[a-zA-Z0-9]{22}$/.test(song.spotifyTrackId) ? song.spotifyTrackId : '');
  },

  sameRemindSong(first, second) {
    const track = song => {
      const id = this.remindTrackId(song);
      return ['2R0MyM9H0B0VovqO1o4858', '21IYMdzTrzSe191Cy5eMap'].includes(id)
        ? this.initialRemindSongs[0].spotifyTrackId : id;
    };
    if (track(first) && track(first) === track(second)) return true;
    const normalize = value => String(value || '').normalize('NFD').toLowerCase().replace(/[^a-z0-9]/g, '');
    if (normalize(first.title) !== normalize(second.title)) return false;
    const leadArtist = song => normalize(String(song.artist || '').split(/\bfeat\.?|\bfeaturing\b|\s+&\s+|,\s+/i)[0]);
    return Boolean(leadArtist(first)) && leadArtist(first) === leadArtist(second);
  },

  savedRemindSongs() {
    try {
      const stored = JSON.parse(localStorage.getItem(this.STORAGE_MEMORY_SONGS));
      if (Array.isArray(stored)) return stored.filter(song => song && typeof song === 'object' && song.title);
    } catch { /* The built-in collection remains available. */ }
    return [];
  },

  getRemindSongs() {
    const extras = [];
    for (const saved of this.savedRemindSongs()) {
      if (![...this.initialRemindSongs, ...extras].some(song => this.sameRemindSong(song, saved))) extras.push(saved);
    }
    // Keep the dedicated finale at the end, including on browsers with extra memories.
    return [...this.initialRemindSongs.slice(0, -1), ...extras, this.initialRemindSongs.at(-1)];
  },

  updateRemindToggle(total) {
    const expanded = document.getElementById('remind-expanded');
    const toggle = document.getElementById('remind-toggle');
    toggle.hidden = total <= 3;
    toggle.setAttribute('aria-expanded', String(!expanded.hidden));
    toggle.textContent = expanded.hidden ? 'View All ' + total + ' Songs ♡' : 'Show Less ♡';
  },

  renderRemindSongs() {
    const create = (tag, text, className) => {
      const el = document.createElement(tag);
      if (text) el.textContent = text;
      if (className) el.className = className;
      return el;
    };
    const songs = this.getRemindSongs();
    let activePlayer;
    const cards = songs.map(song => {
      const card = create('article', '', 'remind-song-card');
      const cover = create('div', '', 'remind-cover');
      const fallback = create('span', song.album || song.title, 'remind-cover-caption');
      fallback.setAttribute('aria-hidden', 'true');
      cover.append(fallback);
      const artwork = this.musicUrl(song.artwork);
      if (artwork) {
        const image = create('img', '', 'remind-artwork');
        image.alt = song.album ? 'Cover of ' + song.album : 'Cover for ' + song.title;
        image.width = image.height = 300;
        image.loading = 'lazy';
        image.decoding = 'async';
        image.addEventListener('error', () => image.remove(), { once: true });
        image.src = artwork;
        cover.append(image);
      }

      const title = create('h3', song.title, 'remind-song-title');
      title.tabIndex = -1;
      const info = create('div', '', 'remind-song-header');
      info.append(title, create('p', song.artist, 'remind-song-artist'));
      const release = [song.album, song.year].filter(Boolean).join(' · ');
      if (release) info.append(create('p', release, 'remind-song-release'));
      card.append(cover, info, create('p', song.message, 'remind-song-quote'));

      const links = create('div', '', 'remind-music-links');
      const track = this.remindTrackId(song);
      for (const [value, label, hosts] of [
        [song.spotifyUrl || (track && 'https://open.spotify.com/track/' + track), 'Listen on Spotify', ['open.spotify.com']],
        [song.appleUrl, 'Apple Music', ['music.apple.com']],
        [song.youtubeUrl, 'YouTube', ['www.youtube.com', 'youtube.com', 'youtu.be']]
      ]) {
        const url = this.musicUrl(value, hosts);
        if (!url) continue;
        const link = create('a', label, label === 'Listen on Spotify' ? 'btn-spotify-pill' : 'remind-alt-link');
        link.href = url;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.setAttribute('aria-label', label + ': ' + song.title);
        links.append(link);
      }
      if (links.children.length) card.append(links);

      if (track) {
        const player = create('details', '', 'remind-preview');
        player.append(create('summary', 'Listen here ♡'));
        player.addEventListener('toggle', () => {
          if (!player.open) {
            player.querySelector('iframe')?.remove();
            if (activePlayer === player) activePlayer = undefined;
            return;
          }
          if (activePlayer && activePlayer !== player) {
            activePlayer.open = false;
            activePlayer.querySelector('iframe')?.remove();
          }
          activePlayer = player;
          if (player.querySelector('iframe')) return;

          const frame = create('iframe', '', 'remind-spotify-embed');
          frame.title = 'Spotify player: ' + song.title;
          frame.src = 'https://open.spotify.com/embed/track/' + track;
          frame.width = '100%';
          frame.height = '152';
          frame.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
          frame.allowFullscreen = true;
          player.append(frame);
        });
        card.append(player);
      }
      return card;
    });
    document.getElementById('remind-songs-list').replaceChildren(...cards.slice(0, 3));
    document.getElementById('remind-more-songs').replaceChildren(...cards.slice(3));
    this.updateRemindToggle(songs.length);
  },

  // --------------------------------------------------------------------------
  // 3. Dom's Favorite Artists — Interactive Vinyl Records
  // --------------------------------------------------------------------------
  initVinylRecords() {
    const vinylEls = document.querySelectorAll('.interactive-vinyl');
    vinylEls.forEach(el => {
      el.addEventListener('click', () => {
        const key = el.getAttribute('data-artist');
        this.selectArtist(key);
      });
    });

    const closeBtn = document.getElementById('btn-close-artist-player');
    if (closeBtn) closeBtn.addEventListener('click', () => this.closeArtistPlayer());
  },

  selectArtist(key) {
    const artist = this.artists[key];
    if (!artist) return;
    this.activeArtistKey = key;

    // Update active vinyl styling
    document.querySelectorAll('.interactive-vinyl').forEach(el => {
      const match = el.getAttribute('data-artist') === key;
      el.classList.toggle('active', match);
      el.setAttribute('aria-pressed', match ? 'true' : 'false');
    });

    // Update player card details
    const nameEl = document.getElementById('active-artist-name');
    const linkEl = document.getElementById('active-artist-spotify-link');
    const embedEl = document.getElementById('artist-spotify-embed-container');
    const spotlightEl = document.getElementById('active-artist-spotlight');

    if (nameEl) nameEl.textContent = artist.name;
    document.getElementById('active-artist-genre').textContent = artist.genre;
    document.getElementById('active-artist-bio').textContent = artist.bio;
    if (linkEl) linkEl.href = artist.spotifyUrl;
    if (spotlightEl) spotlightEl.classList.remove('hidden');

    if (embedEl) {
      embedEl.innerHTML = `
        <iframe style="border-radius:12px" 
          title="Spotify playlist: ${artist.name}"
          src="https://open.spotify.com/embed/playlist/${artist.playlistId}?utm_source=generator&theme=0"
          width="100%" height="352" 
          frameBorder="0" 
          allowfullscreen="" 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy">
        </iframe>
      `;
    }
  },

  closeArtistPlayer() {
    const spotlightEl = document.getElementById('active-artist-spotlight');
    const embedEl = document.getElementById('artist-spotify-embed-container');
    if (spotlightEl) spotlightEl.classList.add('hidden');
    if (embedEl) embedEl.replaceChildren();

    document.querySelectorAll('.interactive-vinyl').forEach(el => {
      if (el.getAttribute('data-artist') === this.activeArtistKey) el.focus();
      el.classList.remove('active');
      el.setAttribute('aria-pressed', 'false');
    });
    this.activeArtistKey = null;
  }
};

document.addEventListener('DOMContentLoaded', () => {
  MusicApp.init();
});
