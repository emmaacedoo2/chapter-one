'use strict';
const gallery = document.querySelector('#photo-gallery');
const credits = document.querySelector('#photo-credits');
photos.forEach((photo, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-label', `Enlarge photo: ${photo.title}`);
  const img = document.createElement('img');
  img.src = photo.src; img.alt = photo.title.replace(/\.[^.]+$/, ''); img.loading = 'lazy';
  const caption = document.createElement('span'); caption.textContent = photo.title.replace(/\.[^.]+$/, '');
  button.append(img, caption); button.addEventListener('click', () => openPhoto(index, button)); gallery.append(button);
  const credit = document.createElement('li');
  const link = document.createElement('a'); link.href = photo.source; link.textContent = photo.title;
  credit.append(link, ` — ${photo.author}; `);
  if (photo.licenseUrl) { const license = document.createElement('a'); license.href = photo.licenseUrl; license.textContent = photo.license; credit.append(license); } else credit.append(photo.license);
  credits.append(credit);
});
const lightbox = document.querySelector('#lightbox'); let currentPhoto = 0; let lastPhotoButton;
function showPhoto() { const photo = photos[currentPhoto]; const image = document.querySelector('#lightbox-image'); image.src = photo.src; image.alt = photo.title.replace(/\.[^.]+$/, ''); document.querySelector('#lightbox-caption').textContent = `${photo.title} · ${currentPhoto + 1} / ${photos.length}`; }
function openPhoto(index, button) { currentPhoto = index; lastPhotoButton = button; showPhoto(); lightbox.showModal(); }
function movePhoto(step) { currentPhoto = (currentPhoto + step + photos.length) % photos.length; showPhoto(); }
lightbox.querySelector('.close').addEventListener('click', () => lightbox.close());
lightbox.querySelector('.prev').addEventListener('click', () => movePhoto(-1));
lightbox.querySelector('.next').addEventListener('click', () => movePhoto(1));
lightbox.addEventListener('close', () => lastPhotoButton?.focus());
lightbox.addEventListener('keydown', event => { if (event.key === 'ArrowLeft') movePhoto(-1); if (event.key === 'ArrowRight') movePhoto(1); });
let touchX = 0; lightbox.addEventListener('touchstart', event => { touchX = event.changedTouches[0].clientX; }, {passive:true}); lightbox.addEventListener('touchend', event => { const delta = event.changedTouches[0].clientX - touchX; if (Math.abs(delta) > 50) movePhoto(delta < 0 ? 1 : -1); }, {passive:true});
const facts = [['A city of steel','Pittsburgh is known as the Steel City, a nod to its industrial history.'],['Bridges everywhere','The City of Bridges has approximately 446 bridges, according to Visit Pittsburgh.'],['Three rivers','The Allegheny and Monongahela meet at the Point to form the Ohio River.'],['Pop art roots','Andy Warhol was born in Pittsburgh in 1928.'],['Say it like a local','“Yinz” is a Pittsburgh way to say “you all.”'],['A historic ride','The Duquesne Incline opened in 1877.'],['Fries inside?','Primanti Bros. sandwiches famously include fries and coleslaw between the bread.'],['Six rings','The Steelers have won six Super Bowls.'],['Black and gold','Pittsburgh is famous for the black and gold worn by its major sports teams.'],['The 412','412 is one of Pittsburgh’s telephone area codes.']];
facts.forEach(([title, body]) => { const card = document.createElement('details'); card.className = 'fact'; const summary = document.createElement('summary'); summary.textContent = title; const p = document.createElement('p'); p.textContent = body; card.append(summary,p); document.querySelector('#facts').append(card); });
const places = [
['Mount Washington','A hillside neighborhood with sweeping views of downtown and the rivers. Come for the overlooks and sunset.','https://www.visitpittsburgh.com/neighborhoods/mt-washington/',0],
['Duquesne Incline','Ride a historic incline up Mount Washington for a memorable view of the city.','https://www.duquesneincline.org/',3],
['Point State Park','At the meeting of the rivers, this downtown park makes a lovely picnic and waterfront stroll.','https://www.pa.gov/agencies/dcnr/recreation/where-to-go/state-parks/find-a-park/point-state-park.html',1],
['Strip District','A lively market neighborhood full of food shops and places to wander together.','https://www.visitpittsburgh.com/neighborhoods/strip-district/',6],
['Phipps Conservatory','Explore glasshouse gardens and seasonal displays for a colorful, relaxed date.','https://www.phipps.conservatory.org/',null],
['Andy Warhol Museum','Discover the Pittsburgh-born artist through art and archives in his hometown.','https://www.warhol.org/',null],
['Cathedral of Learning','The University of Pittsburgh landmark houses the beautiful Nationality Rooms.','https://www.nationalityrooms.pitt.edu/',null],
['PNC Park','The Pirates’ riverside ballpark offers baseball with a skyline backdrop.','https://www.mlb.com/pirates/ballpark',4],
['Acrisure Stadium','Home of the Steelers on the North Shore: a destination for a black-and-gold game day.','https://acrisurestadium.com/',3],
['PPG Paints Arena','The Penguins’ home arena also hosts concerts and other events.','https://www.ppgpaintsarena.com/',5],
['Carnegie Museum of Natural History','Meet dinosaurs and explore the natural world in Oakland.','https://carnegiemnh.org/',null],
['Kennywood','A historic amusement park in nearby West Mifflin, with rides for a playful day out.','https://www.kennywood.com/',null]];
places.forEach(([name,description,url,photo]) => { const card=document.createElement('article'); card.className='place'; if(photo!==null && photos[photo]) { const img=document.createElement('img'); img.src=photos[photo].src; img.alt=photos[photo].title.replace(/\.[^.]+$/, ''); img.loading='lazy'; card.append(img); } const div=document.createElement('div'); const heading=document.createElement('h3'); heading.textContent=name; const p=document.createElement('p'); p.textContent=description; const a=document.createElement('a'); a.href=url; a.textContent='Explore this place ↗'; div.append(heading,p,a); card.append(div); document.querySelector('#places-grid').append(card); });
const activities=['Watch the sunset from Mount Washington','Ride the Duquesne Incline','Go to a Steelers game','Take photos on the yellow bridges','Have a picnic in Point State Park','Explore the Strip District','Visit Phipps Conservatory','Go on an ice cream date','See Pittsburgh at night','Go to a Pirates game','Explore a museum','Take a photo with the skyline behind us'];
const storageKey='chapter_one_pittsburgh_bucket_v1'; let completed=[];
try { const saved=JSON.parse(localStorage.getItem(storageKey) || '[]'); if(Array.isArray(saved)) completed=saved; } catch { completed=[]; }
const list=document.querySelector('#bucket-list');
function updateProgress(){document.querySelector('#progress').textContent=`${completed.length} of ${activities.length} adventures completed ♡`;}
activities.forEach((activity,index)=>{const label=document.createElement('label');const input=document.createElement('input');input.type='checkbox';input.checked=completed.includes(index);const span=document.createElement('span');span.textContent=activity;input.addEventListener('change',()=>{completed=input.checked?[...new Set([...completed,index])]:completed.filter(item=>item!==index);try{localStorage.setItem(storageKey,JSON.stringify(completed));}catch{document.querySelector('#progress').textContent='Progress could not be saved on this device.';return;}updateProgress();});label.append(input,span);list.append(label);});updateProgress();
document.querySelector('#pick-adventure').addEventListener('click',()=>{document.querySelector('#picked').textContent=activities[Math.floor(Math.random()*activities.length)]+' ♡';});
const steelersQuestions=[['How many Super Bowls have the Steelers won?',['Six','Three','Eight'],0],['What year was the team founded?',['1933','1975','1969'],0],['Where do the Steelers play their home games?',['Acrisure Stadium','PNC Park','PPG Paints Arena'],0],['Who created the Terrible Towel?',['Myron Cope','Andy Warhol','Art Rooney II'],0],['What colors are associated with the Steelers?',['Black and gold','Red and blue','Green and white'],0],['Which team did Pittsburgh defeat in Super Bowl XLIII?',['Arizona Cardinals','Minnesota Vikings','Seattle Seahawks'],0]];
const pittsburghQuestions=[['What does “yinz” mean?',['You all','Hello','Thank you'],0],['Which rivers meet to form the Ohio?',['Allegheny and Monongahela','Ohio and Mississippi','Delaware and Susquehanna'],0],['Which artist was born in Pittsburgh?',['Andy Warhol','Claude Monet','Frida Kahlo'],0],['What is tucked inside a classic Primanti sandwich?',['Fries and coleslaw','Pasta and cheese','Apples and honey'],0]];
function makeQuiz(selector,questions){let index=0,score=0;const root=document.querySelector(`${selector} .quiz-content`);function render(){root.replaceChildren();if(index===questions.length){const result=document.createElement('p');result.textContent=`You got ${score} of ${questions.length}! ${score===questions.length?'A perfect score! 🖤💛':'Ready for another round? ♡'}`;const restart=document.createElement('button');restart.className='pill';restart.textContent='Play again';restart.addEventListener('click',()=>{index=0;score=0;render();});root.append(result,restart);return;}const [question,options,answer]=questions[index];const q=document.createElement('p');q.textContent=`${index+1} / ${questions.length} · ${question}`;const choices=document.createElement('div');choices.className='answers';const feedback=document.createElement('p');feedback.className='quiz-feedback';feedback.setAttribute('aria-live','polite');options.forEach((option,i)=>{const button=document.createElement('button');button.type='button';button.textContent=option;button.addEventListener('click',()=>{if(i===answer)score++;feedback.textContent=i===answer?'That’s right! ♡':`Not quite — ${options[answer]}.`;choices.querySelectorAll('button').forEach(b=>b.disabled=true);const next=document.createElement('button');next.type='button';next.className='pill quiz-next';next.textContent=index===questions.length-1?'See results':'Next question →';next.addEventListener('click',()=>{index++;render();});root.append(next);});choices.append(button);});root.append(q,choices,feedback);}render();}
makeQuiz('#steelers-quiz',steelersQuestions);makeQuiz('#pittsburgh-quiz',pittsburghQuestions);
