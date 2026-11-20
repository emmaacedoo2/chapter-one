(() => {
  // Availability is separate from recommendations and intentionally empty until verified.
  const availability = {};
  const movies = [
    ['The Princess Bride',1987,'Adventure','A farmhand sets out to rescue his true love.','A funny, quotable fairy tale for two.'],
    ['When Harry Met Sally...',1989,'Romance','Two friends wonder whether love can grow between them.','A cozy classic full of sharp conversation.'],
    ['10 Things I Hate About You',1999,'Romance','A teen romance unfolds around an unusual dating arrangement.','Playful chemistry and a memorable soundtrack.'],
    ['The Notebook',2004,'Romance','A couple look back on a love tested by time.','Bring tissues for a big romantic story.'],
    ['Crazy Rich Asians',2018,'Comedy','A woman meets her boyfriend’s exceptionally wealthy family.','A colorful, funny date-night pick.'],
    ['The Proposal',2009,'Comedy','A boss and her assistant pretend to be engaged.','A lighthearted fake-dating favorite.'],
    ['Groundhog Day',1993,'Comedy','A weather reporter keeps reliving the same day.','A clever comedy with a sweet heart.'],
    ['Spider-Man: Into the Spider-Verse',2018,'Animation','Miles Morales discovers a world of spider-powered heroes.','A visually dazzling pick for Spider-Man fans.'],
    ['Spider-Man',2002,'Action','Peter Parker learns to live with extraordinary powers.','A classic web-swinging adventure.'],
    ['The Dark Knight',2008,'Action','Batman faces a criminal who thrives on chaos.','A gripping Gotham movie for superhero night.'],
    ['Top Gun: Maverick',2022,'Action','A veteran pilot trains a new team for a dangerous mission.','Big action and a crowd-pleasing story.'],
    ['Jurassic Park',1993,'Adventure','A dinosaur theme park goes disastrously wrong.','A thrilling adventure with unforgettable creatures.'],
    ['Indiana Jones and the Raiders of the Lost Ark',1981,'Adventure','An archaeologist races rivals to find a legendary artifact.','A classic adventure full of daring escapes.'],
    ['Knives Out',2019,'Thriller','A detective investigates a death in a wealthy family.','A witty mystery to solve together.'],
    ['The Sixth Sense',1999,'Thriller','A psychologist helps a boy troubled by frightening visions.','A suspenseful story worth discussing afterward.'],
    ['Get Out',2017,'Horror','A weekend visit to a girlfriend’s family takes a disturbing turn.','A clever and unsettling conversation starter.'],
    ['A Quiet Place',2018,'Horror','A family tries to survive creatures drawn to sound.','A tense choice for a brave movie night.'],
    ['Home Alone',1990,'Christmas','A child left behind defends his home from burglars.','A silly holiday favorite for a cozy evening.'],
    ['The Holiday',2006,'Christmas','Two women swap homes and find unexpected connections.','A warm holiday romance with plenty of charm.'],
    ['Elf',2003,'Christmas','A human raised by elves travels to New York.','A cheerful and very quotable Christmas comedy.'],
    ['Coco',2017,'Animation','A young musician journeys through the Land of the Dead.','Beautiful music and a heartfelt family story.'],
    ['WALL-E',2008,'Animation','A lonely robot follows a new friend across space.','A sweet adventure with very little need for words.'],
    ['Saving Private Ryan',1998,'Historical / War','A squad searches for a soldier during World War II.','A powerful historical drama for a serious evening.'],
    ['Dunkirk',2017,'Historical / War','Soldiers and civilians face a desperate wartime evacuation.','A tense, immersive historical thriller.']
  ].map(([title,year,genre,synopsis,why]) => ({title,year,genre,synopsis,why}));
  const key='chapter-one.movie-night.v1'; let saved={};
  try { saved=JSON.parse(localStorage.getItem(key)) || {}; } catch (_) { document.querySelector('#movie-storage').textContent='Saved data could not be read.'; }
  const $=s=>document.querySelector(s), list=$('#movie-list'), result=$('#movie-pick-result');
  [...new Set(movies.map(m=>m.genre))].sort().forEach(g=>$('#movie-genre').add(new Option(g,g)));
  const persist=()=>{try {localStorage.setItem(key,JSON.stringify(saved));} catch (_) {$('#movie-storage').textContent='Changes could not be saved on this device.';}};
  const filtered=()=>movies.filter(m=>m.title.toLowerCase().includes($('#movie-search').value.toLowerCase().trim()) && (!$('#movie-genre').value || m.genre===$('#movie-genre').value) && (!$('#movie-service').value || (availability[m.title]||[]).includes($('#movie-service').value)) && (!$('#movie-saved').checked || saved[m.title]?.state));
  const card=m=>{const state=saved[m.title]||{}; return `<article class="movie-card"><div class="movie-poster" aria-hidden="true">✦<span>${m.genre}</span>🎬</div><div class="movie-details"><p class="movie-meta">${m.year} · ${m.genre}</p><h3>${m.title}</h3><p>${m.synopsis}</p><p><strong>Why watch:</strong> ${m.why}</p><p class="movie-availability">US streaming: Not verified</p><div class="movie-actions"><button data-action="want" data-title="${m.title}">${state.state ? 'Remove from Watchlist' : 'Add to Watchlist'}</button><button data-action="watched" data-title="${m.title}">${state.state==='watched'?'Watched ✓':'Mark as Watched'}</button></div>${state.state==='watched'?`<label class="movie-rating">Your rating <select data-rating="${m.title}" aria-label="Rating for ${m.title}"><option value="0">Not rated</option>${[1,2,3,4,5].map(n=>`<option value="${n}" ${state.rating===n?'selected':''}>${n} ${n===1?'star':'stars'}</option>`).join('')}</select></label>`:state.state==='want'?'<p>Want to Watch ♡</p>':''}</div></article>`;};
  function render(){const items=filtered(); $('#movie-count').textContent=`${items.length} movie${items.length===1?'':'s'} to explore`; list.innerHTML=items.length?items.map(card).join(''):'<p class="movie-empty">No matches yet. Try another filter ♡</p>';}
  function pick(){const items=filtered(); if(!items.length){result.textContent='No matching movies yet. Try changing your filters ♡';return;} result.textContent='Finding a little movie magic…'; setTimeout(()=>{const current=filtered(); result.innerHTML=current.length?`<h3>Tonight’s pick ♡</h3>${card(current[Math.floor(Math.random()*current.length)])}<button id="movie-again" type="button">Pick Again</button>`:'No matching movies yet. Try changing your filters ♡';},300);}
  document.addEventListener('click',e=>{const b=e.target.closest('[data-action]'); if(b){const title=b.dataset.title; if(b.dataset.action==='want'){if(saved[title]?.state) delete saved[title]; else saved[title]={state:'want',rating:0};} else saved[title]={...saved[title],state:'watched'}; persist(); render(); if(result.querySelector('.movie-card')){const movie=movies.find(m=>m.title===title); if(movie) result.innerHTML=`<h3>Tonight’s pick ♡</h3>${card(movie)}<button id="movie-again" type="button">Pick Again</button>`;} } if(e.target.id==='movie-again')pick();});
  document.addEventListener('change',e=>{if(e.target.dataset.rating){saved[e.target.dataset.rating].rating=Number(e.target.value);persist();render();} });
  ['#movie-search','#movie-genre','#movie-service','#movie-saved'].forEach(s=>$(s).addEventListener('input',()=>{result.innerHTML='';render();}));
  $('#movie-reset').addEventListener('click',()=>{$('#movie-search').value='';$('#movie-genre').value='';$('#movie-service').value='';$('#movie-saved').checked=false;result.innerHTML='';render();}); $('#movie-pick').addEventListener('click',pick); render();
})();
