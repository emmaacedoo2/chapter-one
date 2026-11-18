// ==========================================================================
// Our Songs - JavaScript Controller & Data
// Chapter One Music Page
// ==========================================================================

const MusicApp = {
  // Storage keys
  STORAGE_PLAYLIST_URL: 'chapter_one_playlist_url',
  STORAGE_MEMORY_SONGS: 'chapter_one_memory_songs',
  STORAGE_VOTES: 'chapter_one_music_votes',
  STORAGE_BATTLE_STATS: 'chapter_one_battle_stats',
  STORAGE_BUCKET_LIST: 'chapter_one_concert_bucket_list',
  STORAGE_ATTENDED_LIST: 'chapter_one_concert_attended_list',
  STORAGE_LAST_VISIT: 'chapter_one_concert_last_visit',

  // Config defaults
  defaultPlaylistUrl: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M', // Default preview playlist until custom is provided

  // Dom's favorite artists data
  artists: {
    mac: {
      name: 'Mac Miller',
      genre: 'Hip Hop / Jazz Rap',
      bio: 'One of Dom\'s all-time favorites. From Swimming to Circles and Watching Movies.',
      spotifyId: '4LLpKhyESsy2m20YgfWMKN',
      spotifyUrl: 'https://open.spotify.com/artist/4LLpKhyESsy2m20YgfWMKN',
      color: '#d4a373'
    },
    suicideboys: {
      name: '$uicideboy$',
      genre: 'Underground Hip Hop / Dark Trap',
      bio: 'Scrim & Ruby. Hard-hitting 808s and raw emotion.',
      spotifyId: '1VPdgZBMT69kVOFAG592oI',
      spotifyUrl: 'https://open.spotify.com/artist/1VPdgZBMT69kVOFAG592oI',
      color: '#a81d1d'
    },
    x: {
      name: 'XXXTENTACION',
      genre: 'Alternative / Emo Rap',
      bio: 'Jahseh Onfroy. From acoustic ballads like Jocelyn Flores to energetic anthems.',
      spotifyId: '15UsOTVnJzReFVN1VCnxy4',
      spotifyUrl: 'https://open.spotify.com/artist/15UsOTVnJzReFVN1VCnxy4',
      color: '#2b2b36'
    }
  },

  // Initial personal memory songs
  initialRemindSongs: [
    {
      id: 1,
      title: 'Sailor Song',
      artist: 'Gigi Perez',
      message: 'i don\'t even know how to explain it, but this is the first song that will always remind me of you. every time i hear it, i think of you.',
      spotifyTrackId: '2R0MyM9H0B0VovqO1o4858',
      spotifyUrl: 'https://open.spotify.com/track/2R0MyM9H0B0VovqO1o4858'
    }
  ],

  // Game A: Guess the song data
  guessSongs: [
    {
      artist: 'Mac Miller',
      year: '2018',
      album: 'Swimming',
      clue: 'The opening track of Swimming. Starts with soft strings and reflective vocals about self-care and swimming through life.',
      answer: 'Come Back to Earth',
      options: ['Come Back to Earth', 'Self Care', 'Hurt Feelings', '2009']
    },
    {
      artist: 'Gigi Perez',
      year: '2024',
      album: 'Single',
      clue: 'Our signature track. A soft acoustic folk melody that blew up and became our personal anthem.',
      answer: 'Sailor Song',
      options: ['Sailor Song', 'Sometimes (Backwood)', 'The Man', 'Sally']
    },
    {
      artist: '$uicideboy$',
      year: '2015',
      album: 'My Liver Will Handle What My Heart Can\'t',
      clue: 'One of the duo\'s most iconic melancholic tracks with a dark acoustic loop and reflective verses.',
      answer: 'Kill Yourself (Part III)',
      options: ['Kill Yourself (Part III)', 'Paris', 'Antarctica', 'Carrollton']
    },
    {
      artist: 'XXXTENTACION',
      year: '2017',
      album: '17',
      clue: 'Features a haunting Shiloh Dynasty vocal loop and acoustic guitar. Dedicated to a lost friend.',
      answer: 'Jocelyn Flores',
      options: ['Jocelyn Flores', 'Sad!', 'Moonlight', 'Everybody Dies In Their Nightmares']
    },
    {
      artist: 'Mac Miller',
      year: '2020',
      album: 'Circles',
      clue: 'A gentle, uplifting posthumous track about taking small steps forward every day.',
      answer: 'Good News',
      options: ['Good News', 'Blue World', 'Circles', 'Woods']
    }
  ],

  // Game B: Finish the Song Title Challenge
  finishSongQuestions: [
    {
      prompt: 'Complete this famous Mac Miller track from Swimming: "Self ______"',
      answer: 'Care',
      options: ['Care', 'Love', 'Destruction', 'Reflection'],
      note: 'Released in 2018 on the acclaimed album Swimming.'
    },
    {
      prompt: 'Complete this iconic $uicideboy$ track title: "...And to Those I Love, Thanks for ______"',
      answer: 'Sticking Around',
      options: ['Sticking Around', 'Being Here', 'The Memories', 'Listening'],
      note: 'One of their most streamed and emotional songs worldwide.'
    },
    {
      prompt: 'Complete this XXXTENTACION track title from the 17 album: "Everybody Dies in Their ______"',
      answer: 'Nightmares',
      options: ['Nightmares', 'Dreams', 'Sleep', 'Thoughts'],
      note: 'A rapid-fire acoustic track with Shiloh Dynasty sample.'
    },
    {
      prompt: 'Complete the title of Gigi Perez\'s breakthrough anthem: "______ Song"',
      answer: 'Sailor',
      options: ['Sailor', 'Summer', 'Secret', 'Sunset'],
      note: 'Our special song ❤️'
    },
    {
      prompt: 'Complete this beloved Mac Miller song title: "Donald ______"',
      answer: 'Trump',
      options: ['Trump', 'Duck', 'Glover', 'Miller'],
      note: 'From his classic 2011 mixtape Best Day Ever.'
    }
  ],

  // Game C: This or That pairs
  thisOrThatPairs: [
    {
      songA: { title: 'Come Back to Earth', artist: 'Mac Miller' },
      songB: { title: 'Jocelyn Flores', artist: 'XXXTENTACION' }
    },
    {
      songA: { title: 'Sailor Song', artist: 'Gigi Perez' },
      songB: { title: 'Good News', artist: 'Mac Miller' }
    },
    {
      songA: { title: 'Antarctica', artist: '$uicideboy$' },
      songB: { title: 'Sad!', artist: 'XXXTENTACION' }
    },
    {
      songA: { title: '2009', artist: 'Mac Miller' },
      songB: { title: '...And to Those I Love', artist: '$uicideboy$' }
    },
    {
      songA: { title: 'Moonlight', artist: 'XXXTENTACION' },
      songB: { title: 'Self Care', artist: 'Mac Miller' }
    }
  ],

  // Game D: Dom vs Emma Battle Matchups
  battleRounds: [
    {
      domSong: { title: 'Self Care', artist: 'Mac Miller' },
      emmaSong: { title: 'Sailor Song', artist: 'Gigi Perez' }
    },
    {
      domSong: { title: 'Antarctica', artist: '$uicideboy$' },
      emmaSong: { title: 'Good Luck, Babe!', artist: 'Chappell Roan' }
    },
    {
      domSong: { title: 'Jocelyn Flores', artist: 'XXXTENTACION' },
      emmaSong: { title: 'Birds of a Feather', artist: 'Billie Eilish' }
    },
    {
      domSong: { title: '2009', artist: 'Mac Miller' },
      emmaSong: { title: 'Espresso', artist: 'Sabrina Carpenter' }
    },
    {
      domSong: { title: '...And to Those I Love', artist: '$uicideboy$' },
      emmaSong: { title: 'Kill Bill', artist: 'SZA' }
    }
  ],

  // Tampa Concerts Data (Realistic curated upcoming Tampa area events)
  tampaConcerts: [
    {
      id: 'tampa-1',
      artist: 'Gigi Perez & Friends',
      venue: 'The Orpheum — Tampa, FL',
      dateText: 'Coming Soon',
      dateISO: '2027-02-14',
      badge: 'Favorite Artist',
      ticketUrl: 'https://www.ticketmaster.com/search?q=Gigi+Perez+Tampa',
      isNew: true
    },
    {
      id: 'tampa-2',
      artist: '$uicideboy$ — Grey Day Tour',
      venue: 'Amalie Arena — Tampa, FL',
      dateText: 'Fall Tour Date',
      dateISO: '2027-09-20',
      badge: 'Dom\'s Favorite',
      ticketUrl: 'https://www.ticketmaster.com/search?q=Suicideboys+Tampa',
      isNew: true
    },
    {
      id: 'tampa-3',
      artist: 'Mac Miller Celebration of Life Tribute',
      venue: 'Crowbar — Ybor City, Tampa, FL',
      dateText: 'Special Night',
      dateISO: '2027-01-19',
      badge: 'Tribute Event',
      ticketUrl: 'https://www.ticketmaster.com/search?q=Mac+Miller+Tribute+Tampa',
      isNew: false
    },
    {
      id: 'tampa-4',
      artist: 'Billie Eilish — Hit Me Hard and Soft Tour',
      venue: 'Amalie Arena — Tampa, FL',
      dateText: 'Live in Tampa',
      dateISO: '2026-12-15',
      badge: 'Upcoming Major Show',
      ticketUrl: 'https://www.ticketmaster.com/search?q=Billie+Eilish+Tampa',
      isNew: false
    },
    {
      id: 'tampa-5',
      artist: 'Indie & Hip Hop Weekend at MidFlorida Amphitheatre',
      venue: 'MIDFLORIDA Credit Union Amphitheatre — Tampa, FL',
      dateText: 'Summer Season',
      dateISO: '2027-06-12',
      badge: 'Outdoor Venue',
      ticketUrl: 'https://www.ticketmaster.com/midflorida-credit-union-amphitheatre-tickets-tampa/venue/106886',
      isNew: false
    }
  ],

  // State
  activeArtistKey: 'mac',
  guessIndex: 0,
  guessScore: 0,
  finishIndex: 0,
  finishScore: 0,
  thisOrThatIndex: 0,
  thisOrThatRankings: {},
  battleIndex: 0,
  battleScoreDom: 0,
  battleScoreEmma: 0,
  wrappedSlideIndex: 0,

  init() {
    this.initPlaylistSection();
    this.initRemindSongs();
    this.initVinylRecords();
    this.initGames();
    this.initWrapped();
    this.initConcerts();
    this.initBucketList();
  },

  // --------------------------------------------------------------------------
  // 1. Shared Playlist Section
  // --------------------------------------------------------------------------
  initPlaylistSection() {
    const savedUrl = localStorage.getItem(this.STORAGE_PLAYLIST_URL) || this.defaultPlaylistUrl;
    this.renderPlaylistEmbed(savedUrl);

    const editBtn = document.getElementById('btn-edit-playlist');
    const modal = document.getElementById('playlist-modal');
    const saveBtn = document.getElementById('btn-save-playlist');
    const cancelBtn = document.getElementById('btn-cancel-playlist');
    const input = document.getElementById('playlist-url-input');
    const openSpotifyBtn = document.getElementById('btn-open-playlist-spotify');

    if (openSpotifyBtn) {
      openSpotifyBtn.href = savedUrl;
    }

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
        const val = input.value.trim();
        if (val) {
          localStorage.setItem(this.STORAGE_PLAYLIST_URL, val);
          this.renderPlaylistEmbed(val);
          if (openSpotifyBtn) openSpotifyBtn.href = val;
        }
        modal.classList.add('hidden');
      });
    }
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
      <iframe style="border-radius:12px" 
        src="${embedSrc}?utm_source=generator&theme=0" 
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
    this.renderRemindSongs();

    const addBtn = document.getElementById('btn-add-remind-song');
    const modal = document.getElementById('remind-song-modal');
    const saveBtn = document.getElementById('btn-save-remind-song');
    const cancelBtn = document.getElementById('btn-cancel-remind-song');

    if (addBtn && modal) {
      addBtn.addEventListener('click', () => modal.classList.remove('hidden'));
    }
    if (cancelBtn && modal) {
      cancelBtn.addEventListener('click', () => modal.classList.add('hidden'));
    }

    if (saveBtn && modal) {
      saveBtn.addEventListener('click', () => {
        const title = document.getElementById('new-song-title')?.value.trim();
        const artist = document.getElementById('new-song-artist')?.value.trim();
        const msg = document.getElementById('new-song-message')?.value.trim();
        const spotifyLink = document.getElementById('new-song-spotify')?.value.trim();

        if (title && artist && msg) {
          const songs = this.getRemindSongs();
          songs.push({
            id: Date.now(),
            title,
            artist,
            message: msg,
            spotifyUrl: spotifyLink || 'https://open.spotify.com'
          });
          localStorage.setItem(this.STORAGE_MEMORY_SONGS, JSON.stringify(songs));
          this.renderRemindSongs();
          modal.classList.add('hidden');
          // Reset fields
          document.getElementById('new-song-title').value = '';
          document.getElementById('new-song-artist').value = '';
          document.getElementById('new-song-message').value = '';
          document.getElementById('new-song-spotify').value = '';
        }
      });
    }
  },

  getRemindSongs() {
    try {
      const stored = localStorage.getItem(this.STORAGE_MEMORY_SONGS);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [...this.initialRemindSongs];
  },

  renderRemindSongs() {
    const listEl = document.getElementById('remind-songs-list');
    if (!listEl) return;

    const songs = this.getRemindSongs();
    listEl.innerHTML = songs.map(song => `
      <article class="remind-song-card" data-song-id="${song.id}">
        <div class="remind-song-header">
          <div class="song-meta-box">
            <span class="song-note-badge">♫ personal memory</span>
            <h3 class="remind-song-title">${song.title}</h3>
            <p class="remind-song-artist">by ${song.artist}</p>
          </div>
          <a href="${song.spotifyUrl}" target="_blank" rel="noopener noreferrer" class="btn-spotify-pill" title="Listen on Spotify">
            <span>Spotify</span> &nearr;
          </a>
        </div>
        <div class="remind-song-body">
          <p class="remind-song-quote">"${song.message}"</p>
        </div>
        ${song.spotifyTrackId ? `
          <div class="remind-spotify-embed">
            <iframe style="border-radius:12px" 
              src="https://open.spotify.com/embed/track/${song.spotifyTrackId}?utm_source=generator&theme=0" 
              width="100%" height="152" 
              frameBorder="0" 
              allowfullscreen="" 
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
              loading="lazy">
            </iframe>
          </div>
        ` : ''}
      </article>
    `).join('');
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

    this.selectArtist('mac');
  },

  selectArtist(key) {
    this.activeArtistKey = key;
    const artist = this.artists[key];
    if (!artist) return;

    // Update active vinyl styling
    document.querySelectorAll('.interactive-vinyl').forEach(el => {
      const match = el.getAttribute('data-artist') === key;
      el.classList.toggle('active', match);
      el.setAttribute('aria-pressed', match ? 'true' : 'false');
    });

    // Update player card details
    const nameEl = document.getElementById('active-artist-name');
    const genreEl = document.getElementById('active-artist-genre');
    const bioEl = document.getElementById('active-artist-bio');
    const linkEl = document.getElementById('active-artist-spotify-link');
    const embedEl = document.getElementById('artist-spotify-embed-container');

    if (nameEl) nameEl.textContent = artist.name;
    if (genreEl) genreEl.textContent = artist.genre;
    if (bioEl) bioEl.textContent = artist.bio;
    if (linkEl) linkEl.href = artist.spotifyUrl;

    if (embedEl) {
      embedEl.innerHTML = `
        <iframe style="border-radius:12px" 
          src="https://open.spotify.com/embed/artist/${artist.spotifyId}?utm_source=generator&theme=0" 
          width="100%" height="352" 
          frameBorder="0" 
          allowfullscreen="" 
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
          loading="lazy">
        </iframe>
      `;
    }
  },

  // --------------------------------------------------------------------------
  // 4. Music Mini-Games (A, B, C, D)
  // --------------------------------------------------------------------------
  initGames() {
    // Game Tab Switcher
    const gameTabs = document.querySelectorAll('.game-tab-btn');
    gameTabs.forEach(btn => {
      btn.addEventListener('click', () => {
        gameTabs.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const target = btn.getAttribute('data-game-target');
        document.querySelectorAll('.game-view-panel').forEach(panel => {
          panel.classList.add('hidden');
        });
        const targetPanel = document.getElementById(target);
        if (targetPanel) targetPanel.classList.remove('hidden');
      });
    });

    this.initGameA();
    this.initGameB();
    this.initGameC();
    this.initGameD();
  },

  // GAME A — Guess the Song
  initGameA() {
    this.renderGameAQuestion();

    const restartBtn = document.getElementById('btn-restart-game-a');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.guessIndex = 0;
        this.guessScore = 0;
        this.renderGameAQuestion();
      });
    }
  },

  renderGameAQuestion() {
    const q = this.guessSongs[this.guessIndex];
    const container = document.getElementById('game-a-play-area');
    const finishedBox = document.getElementById('game-a-finished');
    const scoreBadge = document.getElementById('game-a-score');

    if (scoreBadge) scoreBadge.textContent = this.guessScore;

    if (!q) {
      // Game finished
      if (container) container.classList.add('hidden');
      if (finishedBox) finishedBox.classList.remove('hidden');
      document.getElementById('game-a-final-score').textContent = this.guessScore;
      return;
    }

    if (finishedBox) finishedBox.classList.add('hidden');
    if (container) container.classList.remove('hidden');

    document.getElementById('guess-artist-name').textContent = q.artist;
    document.getElementById('guess-album-year').textContent = `${q.album} (${q.year})`;
    document.getElementById('guess-clue-text').textContent = `"${q.clue}"`;

    const optionsBox = document.getElementById('guess-options-grid');
    if (optionsBox) {
      optionsBox.innerHTML = q.options.map(opt => `
        <button type="button" class="game-choice-btn" onclick="MusicApp.handleGuessA('${opt.replace(/'/g, "\\'")}')">
          ${opt}
        </button>
      `).join('');
    }
    const feedbackEl = document.getElementById('guess-feedback');
    if (feedbackEl) feedbackEl.textContent = '';
  },

  handleGuessA(selected) {
    const q = this.guessSongs[this.guessIndex];
    const feedbackEl = document.getElementById('guess-feedback');

    if (selected === q.answer) {
      this.guessScore += 10;
      if (feedbackEl) {
        feedbackEl.innerHTML = '<span class="correct-text">Yes! Correct! +10 pts</span>';
      }
    } else {
      if (feedbackEl) {
        feedbackEl.innerHTML = `<span class="incorrect-text">Not quite! It was "${q.answer}"</span>`;
      }
    }

    // Disable buttons after guess
    document.querySelectorAll('#guess-options-grid .game-choice-btn').forEach(btn => {
      btn.disabled = true;
      if (btn.textContent.trim() === q.answer) btn.classList.add('correct-choice');
      if (btn.textContent.trim() === selected && selected !== q.answer) btn.classList.add('wrong-choice');
    });

    setTimeout(() => {
      this.guessIndex++;
      this.renderGameAQuestion();
    }, 1400);
  },

  // GAME B — Finish the Song Title
  initGameB() {
    this.renderGameBQuestion();

    const restartBtn = document.getElementById('btn-restart-game-b');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.finishIndex = 0;
        this.finishScore = 0;
        this.renderGameBQuestion();
      });
    }
  },

  renderGameBQuestion() {
    const q = this.finishSongQuestions[this.finishIndex];
    const container = document.getElementById('game-b-play-area');
    const finishedBox = document.getElementById('game-b-finished');
    const scoreBadge = document.getElementById('game-b-score');

    if (scoreBadge) scoreBadge.textContent = this.finishScore;

    if (!q) {
      if (container) container.classList.add('hidden');
      if (finishedBox) finishedBox.classList.remove('hidden');
      document.getElementById('game-b-final-score').textContent = this.finishScore;
      return;
    }

    if (finishedBox) finishedBox.classList.add('hidden');
    if (container) container.classList.remove('hidden');

    document.getElementById('finish-prompt-text').textContent = q.prompt;
    document.getElementById('finish-note-text').textContent = q.note;

    const optionsBox = document.getElementById('finish-options-grid');
    if (optionsBox) {
      optionsBox.innerHTML = q.options.map(opt => `
        <button type="button" class="game-choice-btn" onclick="MusicApp.handleGuessB('${opt.replace(/'/g, "\\'")}')">
          ${opt}
        </button>
      `).join('');
    }
    const feedbackEl = document.getElementById('finish-feedback');
    if (feedbackEl) feedbackEl.textContent = '';
  },

  handleGuessB(selected) {
    const q = this.finishSongQuestions[this.finishIndex];
    const feedbackEl = document.getElementById('finish-feedback');

    if (selected === q.answer) {
      this.finishScore += 10;
      if (feedbackEl) {
        feedbackEl.innerHTML = '<span class="correct-text">Boom! You nailed it! +10 pts</span>';
      }
    } else {
      if (feedbackEl) {
        feedbackEl.innerHTML = `<span class="incorrect-text">Close! It was "${q.answer}"</span>`;
      }
    }

    document.querySelectorAll('#finish-options-grid .game-choice-btn').forEach(btn => {
      btn.disabled = true;
      if (btn.textContent.trim() === q.answer) btn.classList.add('correct-choice');
      if (btn.textContent.trim() === selected && selected !== q.answer) btn.classList.add('wrong-choice');
    });

    setTimeout(() => {
      this.finishIndex++;
      this.renderGameBQuestion();
    }, 1400);
  },

  // GAME C — This or That
  initGameC() {
    this.renderThisOrThat();

    const restartBtn = document.getElementById('btn-restart-game-c');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        this.thisOrThatIndex = 0;
        this.thisOrThatRankings = {};
        this.renderThisOrThat();
      });
    }
  },

  renderThisOrThat() {
    const pair = this.thisOrThatPairs[this.thisOrThatIndex];
    const playArea = document.getElementById('game-c-play-area');
    const finishedBox = document.getElementById('game-c-finished');

    if (!pair) {
      if (playArea) playArea.classList.add('hidden');
      if (finishedBox) finishedBox.classList.remove('hidden');
      this.renderPodium();
      return;
    }

    if (finishedBox) finishedBox.classList.add('hidden');
    if (playArea) playArea.classList.remove('hidden');

    document.getElementById('this-song-title').textContent = pair.songA.title;
    document.getElementById('this-song-artist').textContent = pair.songA.artist;

    document.getElementById('that-song-title').textContent = pair.songB.title;
    document.getElementById('that-song-artist').textContent = pair.songB.artist;

    document.getElementById('round-c-counter').textContent = `Round ${this.thisOrThatIndex + 1} of ${this.thisOrThatPairs.length}`;
  },

  voteThisOrThat(choice) {
    const pair = this.thisOrThatPairs[this.thisOrThatIndex];
    const chosen = choice === 'A' ? pair.songA : pair.songB;

    // Record vote
    const key = `${chosen.title} — ${chosen.artist}`;
    this.thisOrThatRankings[key] = (this.thisOrThatRankings[key] || 0) + 1;

    // Store in global votes for Wrapped
    this.recordGlobalVote(chosen.title, chosen.artist);

    this.thisOrThatIndex++;
    this.renderThisOrThat();
  },

  renderPodium() {
    const listEl = document.getElementById('podium-ranking-list');
    if (!listEl) return;

    const sorted = Object.entries(this.thisOrThatRankings).sort((a, b) => b[1] - a[1]);
    listEl.innerHTML = sorted.map(([song, votes], idx) => `
      <div class="podium-item">
        <span class="podium-rank">#${idx + 1}</span>
        <span class="podium-song">${song}</span>
        <span class="podium-votes">winner!</span>
      </div>
    `).join('');
  },

  // GAME D — Dom vs Emma Music Battle
  initGameD() {
    this.renderBattle();

    const rematchBtn = document.getElementById('btn-rematch-battle');
    if (rematchBtn) {
      rematchBtn.addEventListener('click', () => {
        this.battleIndex = 0;
        this.battleScoreDom = 0;
        this.battleScoreEmma = 0;
        this.renderBattle();
      });
    }
  },

  renderBattle() {
    const match = this.battleRounds[this.battleIndex];
    const playArea = document.getElementById('game-d-play-area');
    const finishedBox = document.getElementById('game-d-finished');

    const domScoreBadge = document.getElementById('dom-battle-score');
    const emmaScoreBadge = document.getElementById('emma-battle-score');

    if (domScoreBadge) domScoreBadge.textContent = this.battleScoreDom;
    if (emmaScoreBadge) emmaScoreBadge.textContent = this.battleScoreEmma;

    if (!match) {
      if (playArea) playArea.classList.add('hidden');
      if (finishedBox) finishedBox.classList.remove('hidden');

      let winnerMsg = 'It\'s an absolute tie!! Great minds think alike!';
      if (this.battleScoreDom > this.battleScoreEmma) {
        winnerMsg = 'Dom takes the crown this round!! 🏆';
      } else if (this.battleScoreEmma > this.battleScoreDom) {
        winnerMsg = 'Emma takes the crown this round!! 🏆';
      }
      document.getElementById('battle-winner-declaration').textContent = winnerMsg;

      // Save to localStorage stats for Wrapped
      this.recordBattleResult(this.battleScoreDom, this.battleScoreEmma);
      return;
    }

    if (finishedBox) finishedBox.classList.add('hidden');
    if (playArea) playArea.classList.remove('hidden');

    document.getElementById('battle-dom-song').textContent = match.domSong.title;
    document.getElementById('battle-dom-artist').textContent = match.domSong.artist;

    document.getElementById('battle-emma-song').textContent = match.emmaSong.title;
    document.getElementById('battle-emma-artist').textContent = match.emmaSong.artist;

    document.getElementById('battle-round-badge').textContent = `Faceoff ${this.battleIndex + 1} of ${this.battleRounds.length}`;
  },

  voteBattle(who) {
    const match = this.battleRounds[this.battleIndex];
    if (who === 'dom') {
      this.battleScoreDom++;
      this.recordGlobalVote(match.domSong.title, match.domSong.artist);
    } else {
      this.battleScoreEmma++;
      this.recordGlobalVote(match.emmaSong.title, match.emmaSong.artist);
    }

    this.battleIndex++;
    this.renderBattle();
  },

  recordGlobalVote(title, artist) {
    try {
      const votes = JSON.parse(localStorage.getItem(this.STORAGE_VOTES)) || {};
      const key = `${title} — ${artist}`;
      votes[key] = (votes[key] || 0) + 1;
      localStorage.setItem(this.STORAGE_VOTES, JSON.stringify(votes));
    } catch (e) {
      console.error(e);
    }
  },

  recordBattleResult(dom, emma) {
    try {
      const stats = JSON.parse(localStorage.getItem(this.STORAGE_BATTLE_STATS)) || { domWins: 0, emmaWins: 0, ties: 0 };
      if (dom > emma) stats.domWins++;
      else if (emma > dom) stats.emmaWins++;
      else stats.ties++;
      localStorage.setItem(this.STORAGE_BATTLE_STATS, JSON.stringify(stats));
    } catch (e) {
      console.error(e);
    }
  },

  // --------------------------------------------------------------------------
  // 5. Our Music Wrapped
  // --------------------------------------------------------------------------
  initWrapped() {
    this.updateWrappedData();

    const prevBtn = document.getElementById('wrapped-prev-btn');
    const nextBtn = document.getElementById('wrapped-next-btn');

    if (prevBtn) {
      prevBtn.addEventListener('click', () => this.changeWrappedSlide(-1));
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', () => this.changeWrappedSlide(1));
    }

    this.showWrappedSlide(0);
  },

  updateWrappedData() {
    // 1. Most-voted song
    try {
      const votes = JSON.parse(localStorage.getItem(this.STORAGE_VOTES)) || {};
      const sorted = Object.entries(votes).sort((a, b) => b[1] - a[1]);
      const topSongEl = document.getElementById('wrapped-top-song');
      if (topSongEl) {
        topSongEl.textContent = sorted.length > 0 ? sorted[0][0] : 'Sailor Song — Gigi Perez';
      }
    } catch (e) {
      console.error(e);
    }

    // 2. Battle stats
    try {
      const stats = JSON.parse(localStorage.getItem(this.STORAGE_BATTLE_STATS)) || { domWins: 0, emmaWins: 0 };
      const battleStatsEl = document.getElementById('wrapped-battle-score');
      if (battleStatsEl) {
        battleStatsEl.textContent = `Dom: ${stats.domWins} wins  vs  Emma: ${stats.emmaWins} wins`;
      }
    } catch (e) {
      console.error(e);
    }

    // 3. Songs in collection
    const songs = this.getRemindSongs();
    const countEl = document.getElementById('wrapped-memory-count');
    if (countEl) countEl.textContent = `${songs.length} song${songs.length === 1 ? '' : 's'}`;
  },

  changeWrappedSlide(delta) {
    const slides = document.querySelectorAll('.wrapped-slide');
    let nextIdx = this.wrappedSlideIndex + delta;
    if (nextIdx < 0) nextIdx = 0;
    if (nextIdx >= slides.length) nextIdx = slides.length - 1;
    this.showWrappedSlide(nextIdx);
  },

  showWrappedSlide(index) {
    const slides = document.querySelectorAll('.wrapped-slide');
    if (slides.length === 0) return;

    this.wrappedSlideIndex = index;
    slides.forEach((s, idx) => {
      s.classList.toggle('active', idx === index);
    });

    const prevBtn = document.getElementById('wrapped-prev-btn');
    const nextBtn = document.getElementById('wrapped-next-btn');
    const counter = document.getElementById('wrapped-slide-counter');

    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === slides.length - 1;
    if (counter) counter.textContent = `${index + 1} / ${slides.length}`;
  },

  // --------------------------------------------------------------------------
  // 6. Concerts Near Us — Tampa
  // --------------------------------------------------------------------------
  initConcerts() {
    this.renderConcerts();

    const refreshBtn = document.getElementById('btn-refresh-concerts');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        refreshBtn.classList.add('spinning');
        setTimeout(() => {
          refreshBtn.classList.remove('spinning');
          this.renderConcerts();
        }, 600);
      });
    }

    const filterSelect = document.getElementById('concert-filter-select');
    if (filterSelect) {
      filterSelect.addEventListener('change', () => this.renderConcerts());
    }

    // Save visit timestamp for new concert badge
    const lastVisit = localStorage.getItem(this.STORAGE_LAST_VISIT);
    if (!lastVisit) {
      localStorage.setItem(this.STORAGE_LAST_VISIT, Date.now().toString());
    }
  },

  renderConcerts() {
    const listEl = document.getElementById('tampa-concerts-grid');
    const filterSelect = document.getElementById('concert-filter-select');
    if (!listEl) return;

    const filter = filterSelect ? filterSelect.value : 'all';

    let filtered = this.tampaConcerts;
    if (filter === 'favorites') {
      filtered = this.tampaConcerts.filter(c => c.badge.includes('Favorite') || c.badge.includes('Tribute'));
    }

    listEl.innerHTML = filtered.map(c => `
      <article class="concert-card">
        <div class="concert-header">
          <span class="concert-badge">${c.badge}</span>
          ${c.isNew ? '<span class="concert-new-indicator">NEW</span>' : ''}
        </div>
        <h3 class="concert-artist-name">${c.artist}</h3>
        <p class="concert-venue-text">📍 ${c.venue}</p>
        <p class="concert-date-text">🗓️ ${c.dateText}</p>
        <div class="concert-actions-bar">
          <a href="${c.ticketUrl}" target="_blank" rel="noopener noreferrer" class="btn-ticket-link">
            Tickets & Info &nearr;
          </a>
          <button type="button" class="btn-wishlist-add" onclick="MusicApp.addConcertToBucketList('${c.artist.replace(/'/g, "\\'")}', '${c.venue.replace(/'/g, "\\'")}', '${c.dateText}')">
            + Wishlist
          </button>
        </div>
      </article>
    `).join('');
  },

  // --------------------------------------------------------------------------
  // 7. Concert Bucket List & Attended Memories
  // --------------------------------------------------------------------------
  initBucketList() {
    this.renderBucketList();

    const addBtn = document.getElementById('btn-add-bucket-item');
    if (addBtn) {
      addBtn.addEventListener('click', () => {
        const artist = document.getElementById('bucket-artist-input')?.value.trim();
        const venue = document.getElementById('bucket-venue-input')?.value.trim();
        const note = document.getElementById('bucket-note-input')?.value.trim();

        if (artist) {
          const list = this.getBucketList();
          list.push({
            id: Date.now(),
            artist,
            venue: venue || 'Tampa, FL or anywhere together',
            note: note || '',
            dateAdded: new Date().toLocaleDateString()
          });
          localStorage.setItem(this.STORAGE_BUCKET_LIST, JSON.stringify(list));
          this.renderBucketList();

          document.getElementById('bucket-artist-input').value = '';
          document.getElementById('bucket-venue-input').value = '';
          document.getElementById('bucket-note-input').value = '';
        }
      });
    }
  },

  getBucketList() {
    try {
      const stored = localStorage.getItem(this.STORAGE_BUCKET_LIST);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      { id: 101, artist: 'Gigi Perez', venue: 'Any small acoustic venue in Florida', note: 'Must hear Sailor Song live together!', dateAdded: 'Nov 2026' },
      { id: 102, artist: '$uicideboy$', venue: 'Amalie Arena', note: 'Dom\'s dream concert', dateAdded: 'Nov 2026' }
    ];
  },

  getAttendedList() {
    try {
      const stored = localStorage.getItem(this.STORAGE_ATTENDED_LIST);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [];
  },

  addConcertToBucketList(artist, venue, dateText) {
    const list = this.getBucketList();
    list.push({
      id: Date.now(),
      artist,
      venue,
      note: `Added from Tampa concerts list (${dateText})`,
      dateAdded: new Date().toLocaleDateString()
    });
    localStorage.setItem(this.STORAGE_BUCKET_LIST, JSON.stringify(list));
    this.renderBucketList();

    // Scroll smoothly to bucket list
    const el = document.getElementById('bucket-list-section');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  },

  markAsAttended(id) {
    const bucket = this.getBucketList();
    const itemIdx = bucket.findIndex(b => b.id === id);
    if (itemIdx === -1) return;

    const item = bucket.splice(itemIdx, 1)[0];
    localStorage.setItem(this.STORAGE_BUCKET_LIST, JSON.stringify(bucket));

    const attended = this.getAttendedList();
    attended.push({
      ...item,
      attendedDate: new Date().toLocaleDateString()
    });
    localStorage.setItem(this.STORAGE_ATTENDED_LIST, JSON.stringify(attended));

    this.renderBucketList();
  },

  removeBucketItem(id) {
    const bucket = this.getBucketList().filter(b => b.id !== id);
    localStorage.setItem(this.STORAGE_BUCKET_LIST, JSON.stringify(bucket));
    this.renderBucketList();
  },

  removeAttendedItem(id) {
    const attended = this.getAttendedList().filter(b => b.id !== id);
    localStorage.setItem(this.STORAGE_ATTENDED_LIST, JSON.stringify(attended));
    this.renderBucketList();
  },

  renderBucketList() {
    const wishlistEl = document.getElementById('concert-wishlist-cards');
    const attendedEl = document.getElementById('concert-attended-cards');

    const wishlist = this.getBucketList();
    const attended = this.getAttendedList();

    if (wishlistEl) {
      if (wishlist.length === 0) {
        wishlistEl.innerHTML = '<p class="empty-note">No concerts on our wishlist yet. Add one above!</p>';
      } else {
        wishlistEl.innerHTML = wishlist.map(item => `
          <div class="bucket-card">
            <div class="bucket-card-header">
              <h4 class="bucket-artist-title">${item.artist}</h4>
              <button type="button" class="btn-delete-item" onclick="MusicApp.removeBucketItem(${item.id})" title="Delete">✕</button>
            </div>
            <p class="bucket-venue">${item.venue}</p>
            ${item.note ? `<p class="bucket-note">"${item.note}"</p>` : ''}
            <div class="bucket-card-footer">
              <span class="bucket-added-date">Added: ${item.dateAdded}</span>
              <button type="button" class="btn-mark-attended" onclick="MusicApp.markAsAttended(${item.id})">
                Attended! ✓
              </button>
            </div>
          </div>
        `).join('');
      }
    }

    if (attendedEl) {
      if (attended.length === 0) {
        attendedEl.innerHTML = '<p class="empty-note">We haven\'t checked any concerts off our list yet! When we go to one, hit "Attended! ✓" to save the memory here.</p>';
      } else {
        attendedEl.innerHTML = attended.map(item => `
          <div class="bucket-card attended-memory-card">
            <div class="bucket-card-header">
              <h4 class="bucket-artist-title">✓ ${item.artist}</h4>
              <button type="button" class="btn-delete-item" onclick="MusicApp.removeAttendedItem(${item.id})" title="Delete">✕</button>
            </div>
            <p class="bucket-venue">📍 ${item.venue}</p>
            ${item.note ? `<p class="bucket-note">"${item.note}"</p>` : ''}
            <div class="attended-photo-placeholder">
              <span>Concert Photo Memory</span>
            </div>
            <span class="bucket-attended-date">Date seen: ${item.attendedDate}</span>
          </div>
        `).join('');
      }
    }
  }
};

document.addEventListener('DOMContentLoaded', () => {
  MusicApp.init();
});
