// ==========================================================================
// Our Songs - JavaScript Controller & Data
// Chapter One Music Page
// ==========================================================================

const MusicApp = {
  // Storage keys
  STORAGE_PLAYLIST_URL: 'chapter_one_playlist_url',
  STORAGE_MEMORY_SONGS: 'chapter_one_memory_songs',
  STORAGE_BUCKET_LIST: 'chapter_one_concert_bucket_list',
  STORAGE_ATTENDED_LIST: 'chapter_one_concert_attended_list',

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

  // Initial personal memory songs
  initialRemindSongs: [
    {
      id: 1,
      title: 'Sailor Song',
      artist: 'Gigi Perez',
      message: 'i don\'t even know how to explain it, but this is the first song that will always remind me of you. every time i hear it, i think of you.',
      spotifyTrackId: '21IYMdzTrzSe191Cy5eMap',
      spotifyUrl: 'https://open.spotify.com/track/21IYMdzTrzSe191Cy5eMap'
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

  STORAGE_VOTES: 'chapter_one_music_votes',
  STORAGE_BATTLE_STATS: 'chapter_one_battle_stats',
  guessIndex: 0, guessScore: 0, finishIndex: 0, finishScore: 0,
  thisOrThatIndex: 0, thisOrThatRankings: {}, classicBattleIndex: 0,
  battleScoreDom: 0, battleScoreEmma: 0, wrappedSlideIndex: 0,

  // State
  activeArtistKey: 'mac',

  init() {
    this.initPlaylistSection();
    this.initRemindSongs();
    this.initVinylRecords();
    this.initGames();
    this.initClassicGames();
    this.initWrapped();
    this.initConcertTabs();
    this.initBucketList();
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
      if (stored) return JSON.parse(stored).map(song =>
        song.spotifyTrackId === '2R0MyM9H0B0VovqO1o4858'
          ? { ...song, spotifyTrackId: '21IYMdzTrzSe191Cy5eMap', spotifyUrl: 'https://open.spotify.com/track/21IYMdzTrzSe191Cy5eMap' }
          : song
      );
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
            <span>Open in Spotify (if player unavailable)</span> &nearr;
          </a>
        </div>
        <div class="remind-song-body">
          <p class="remind-song-quote">"${song.message}"</p>
        </div>
        ${song.spotifyTrackId ? `
          <div class="remind-spotify-embed">
            <iframe title="Spotify track: ${song.title} by ${song.artist}" class="artist-playlist-frame" style="border-radius:12px"
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
  },

  initClassicGames() {
    // Game Tab Switcher
    const gameTabs = document.querySelectorAll('[data-game-target]');
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
    this.renderClassicBattle();

    const rematchBtn = document.getElementById('btn-rematch-battle');
    if (rematchBtn) {
      rematchBtn.addEventListener('click', () => {
        this.classicBattleIndex = 0;
        this.battleScoreDom = 0;
        this.battleScoreEmma = 0;
        this.renderClassicBattle();
      });
    }
  },

  renderClassicBattle() {
    const match = this.battleRounds[this.classicBattleIndex];
    const playArea = document.getElementById('game-d-play-area');
    const finishedBox = document.getElementById('game-d-finished');

    const domScoreBadge = document.getElementById('classic-dom-battle-score');
    const emmaScoreBadge = document.getElementById('classic-emma-battle-score');

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

    document.getElementById('battle-round-badge').textContent = `Faceoff ${this.classicBattleIndex + 1} of ${this.battleRounds.length}`;
  },

  voteBattle(who) {
    const match = this.battleRounds[this.classicBattleIndex];
    if (who === 'dom') {
      this.battleScoreDom++;
      this.recordGlobalVote(match.domSong.title, match.domSong.artist);
    } else {
      this.battleScoreEmma++;
      this.recordGlobalVote(match.emmaSong.title, match.emmaSong.artist);
    }

    this.classicBattleIndex++;
    this.renderClassicBattle();
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
    this.updateWrappedData();
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


  // Each player gets five turns, with questions and answers shuffled for each game.
  questions: [
    ['English pop', 'Who released the album 21?', 'Adele', 'Dua Lipa', 'Taylor Swift', 'Rihanna'],
    ['English pop', 'Who sings “Levitating”?', 'Dua Lipa', 'Adele', 'Sia', 'Lorde'],
    ['Spanish pop', 'Who sings “Bailando” with Descemer Bueno and Gente de Zona?', 'Enrique Iglesias', 'Ricky Martin', 'Juanes', 'Maluma'],
    ['Spanish pop', 'Who released the album El Mal Querer?', 'ROSALÍA', 'Shakira', 'Thalía', 'Paulina Rubio'],
    ['Reggaeton', 'Who released “Gasolina”?', 'Daddy Yankee', 'Don Omar', 'J Balvin', 'Ozuna'],
    ['Reggaeton', 'Who joins Luis Fonsi on the original “Despacito”?', 'Daddy Yankee', 'Bad Bunny', 'Maluma', 'J Balvin'],
    ['2000s hits', 'Who released “Crazy in Love” featuring Jay-Z?', 'Beyoncé', 'Alicia Keys', 'Ciara', 'Rihanna'],
    ['2000s hits', 'Which group released “Hey Ya!”?', 'OutKast', 'Black Eyed Peas', 'Gorillaz', 'Coldplay'],
    ['Rock', 'Which band released “Bohemian Rhapsody”?', 'Queen', 'Nirvana', 'Oasis', 'The Police'],
    ['Rock', 'Who is the lead singer of Paramore?', 'Hayley Williams', 'Amy Lee', 'Stevie Nicks', 'Debbie Harry'],
    ['Hip-hop', 'Which artist released the album To Pimp a Butterfly?', 'Kendrick Lamar', 'Drake', 'J. Cole', 'Kanye West'],
    ['Hip-hop', 'Who released “Lose Yourself”?', 'Eminem', 'Nas', 'Drake', 'Snoop Dogg'],
    ['Movie music', 'Who sings “My Heart Will Go On” from Titanic?', 'Celine Dion', 'Whitney Houston', 'Mariah Carey', 'Adele'],
    ['Movie music', 'Which film features “Let It Go” performed by Idina Menzel?', 'Frozen', 'Moana', 'Encanto', 'Tangled'],
    ['International', 'Which South Korean group released “Dynamite”?', 'BTS', 'BLACKPINK', 'TWICE', 'EXO'],
    ['International', 'Who performed “Waka Waka (This Time for Africa)” featuring Freshlyground?', 'Shakira', 'Karol G', 'Gloria Estefan', 'Anitta']
  ],
  shuffle(items) {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  },
  initGames() {
    document.getElementById('battle-next').addEventListener('click', () => { this.battleIndex++; this.renderBattle(); });
    document.getElementById('battle-replay').addEventListener('click', () => this.startBattle());
    this.startBattle();
  },
  startBattle() {
    this.battleQuestions = this.shuffle(this.questions).slice(0, 10);
    this.battleIndex = 0;
    this.battleScores = [0, 0];
    this.renderBattle();
  },
  renderBattle() {
    document.getElementById('dom-battle-score').textContent = this.battleScores[0];
    document.getElementById('emma-battle-score').textContent = this.battleScores[1];
    const done = this.battleIndex === this.battleQuestions.length;
    document.getElementById('battle-play').classList.toggle('hidden', done);
    document.getElementById('battle-finished').classList.toggle('hidden', !done);
    if (done) {
      document.getElementById('battle-winner').textContent = this.battleScores[0] === this.battleScores[1] ? "It's a tie! ♡" : `${this.battleScores[0] > this.battleScores[1] ? 'Dom' : 'Emma'} wins! 🏆`;
      return;
    }
    const [category, question, answer, ...others] = this.battleQuestions[this.battleIndex];
    document.getElementById('battle-turn').textContent = `${this.battleIndex % 2 ? 'Emma' : 'Dom'}'s turn · ${category}`;
    document.getElementById('battle-round').textContent = `Turn ${this.battleIndex + 1} of 10`;
    document.getElementById('battle-question').textContent = question;
    document.getElementById('battle-feedback').textContent = '';
    document.getElementById('battle-next').classList.add('hidden');
    const options = document.getElementById('battle-options');
    options.replaceChildren();
    this.shuffle([answer, ...others]).forEach(option => {
      const button = document.createElement('button');
      button.type = 'button'; button.className = 'game-choice-btn'; button.textContent = option;
      button.addEventListener('click', () => {
        options.querySelectorAll('button').forEach(b => { b.disabled = true; if (b.textContent === answer) b.classList.add('correct-choice'); });
        if (option === answer) this.battleScores[this.battleIndex % 2]++;
        else button.classList.add('wrong-choice');
        document.getElementById('dom-battle-score').textContent = this.battleScores[0];
        document.getElementById('emma-battle-score').textContent = this.battleScores[1];
        document.getElementById('battle-feedback').textContent = option === answer ? 'Correct! +1 point' : `The answer is ${answer}.`;
        document.getElementById('battle-next').classList.remove('hidden');
      });
      options.appendChild(button);
    });
  },
  initConcertTabs() {
    ['discover', 'wishlist'].forEach(name => document.getElementById(`tab-${name}`).addEventListener('click', () => this.showConcertTab(name)));
  },
  showConcertTab(name) {
    ['discover', 'wishlist'].forEach(tab => {
      const active = tab === name;
      document.getElementById(`tab-${tab}`).classList.toggle('active', active);
      document.getElementById(`tab-${tab}`).setAttribute('aria-selected', String(active));
      document.getElementById(`concert-${tab}`).classList.toggle('hidden', !active);
    });
  },
  getBucketList() {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_BUCKET_LIST)) || [
      { id: 101, artist: 'Gigi Perez', venue: 'Any small acoustic venue in Florida', note: 'Must hear Sailor Song live together!', dateAdded: 'Nov 2026' },
      { id: 102, artist: '$uicideboy$', venue: 'Amalie Arena', note: "Dom's dream concert", dateAdded: 'Nov 2026' }
    ]; } catch (e) { return []; }
  },
  getAttendedList() {
    try { return JSON.parse(localStorage.getItem(this.STORAGE_ATTENDED_LIST)) || []; } catch (e) { return []; }
  },
  initBucketList() {
    this.editingConcert = null;
    document.getElementById('wishlist-form').addEventListener('submit', event => {
      event.preventDefault();
      const fields = ['artist', 'venue', 'city', 'date', 'note'];
      const values = Object.fromEntries(fields.map(field => [field, document.getElementById(`bucket-${field}-input`).value.trim()]));
      if (!Object.values(values).some(Boolean)) { document.getElementById('wishlist-message').textContent = 'Add at least one detail.'; return; }
      const attended = this.editingConcert?.attended || false;
      const list = attended ? this.getAttendedList() : this.getBucketList();
      if (this.editingConcert) {
        const index = list.findIndex(item => String(item.id) === String(this.editingConcert.id));
        if (index !== -1) list[index] = { ...list[index], ...values };
      } else list.push({ id: Date.now(), ...values, dateAdded: new Date().toLocaleDateString() });
      if (this.saveConcerts(attended, list)) { this.resetConcertForm(); this.renderBucketList(); }
    });
    document.getElementById('wishlist-cancel').addEventListener('click', () => this.resetConcertForm());
    this.renderBucketList();
  },
  saveConcerts(attended, list) {
    try { localStorage.setItem(attended ? this.STORAGE_ATTENDED_LIST : this.STORAGE_BUCKET_LIST, JSON.stringify(list)); return true; }
    catch (e) { document.getElementById('wishlist-message').textContent = 'Could not save in this browser. Check your storage settings.'; return false; }
  },
  resetConcertForm() {
    document.getElementById('wishlist-form').reset(); this.editingConcert = null;
    document.getElementById('wishlist-save').textContent = '+ Add to Wishlist';
    document.getElementById('wishlist-cancel').classList.add('hidden');
    document.getElementById('wishlist-message').textContent = '';
  },
  renderBucketList() {
    [false, true].forEach(attended => {
      const container = document.getElementById(attended ? 'concert-attended-cards' : 'concert-wishlist-cards');
      const list = attended ? this.getAttendedList() : this.getBucketList();
      container.replaceChildren();
      if (!list.length) { container.textContent = attended ? 'No concerts attended yet.' : 'No concerts on our wishlist yet.'; return; }
      list.forEach(item => {
        const card = document.createElement('article'); card.className = 'bucket-card';
        const title = document.createElement('h4'); title.className = 'bucket-artist-title'; title.textContent = item.artist || 'Concert'; card.appendChild(title);
        [item.venue, item.city, item.date, item.note, attended && item.attendedDate ? `Date seen: ${item.attendedDate}` : null].filter(Boolean).forEach(value => { const p = document.createElement('p'); p.className = 'bucket-venue'; p.textContent = value; card.appendChild(p); });
        const action = (label, handler) => { const button = document.createElement('button'); button.type = 'button'; button.className = 'btn-action-outline'; button.textContent = label; button.addEventListener('click', handler); card.appendChild(button); };
        action('Edit', () => {
          this.editingConcert = { id: item.id, attended };
          ['artist', 'venue', 'city', 'date', 'note'].forEach(field => { document.getElementById(`bucket-${field}-input`).value = item[field] || ''; });
          document.getElementById('wishlist-save').textContent = 'Save changes'; document.getElementById('wishlist-cancel').classList.remove('hidden');
          document.getElementById('bucket-artist-input').focus();
        });
        action('Remove', () => { if (this.saveConcerts(attended, list.filter(entry => entry.id !== item.id))) { this.resetConcertForm(); this.renderBucketList(); } });
        if (!attended) action('Mark attended ✓', () => {
          const attendedList = this.getAttendedList();
          if (this.saveConcerts(true, [...attendedList, { ...item, attendedDate: new Date().toLocaleDateString() }]) && this.saveConcerts(false, list.filter(entry => entry.id !== item.id))) { this.resetConcertForm(); this.renderBucketList(); }
        });
        container.appendChild(card);
      });
    });
  }

};

document.addEventListener('DOMContentLoaded', () => {
  MusicApp.init();
});
