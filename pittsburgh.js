'use strict';
const gallery = document.querySelector('#photo-gallery');
const credits = document.querySelector('#photo-credits');
photos.forEach((photo, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.setAttribute('aria-label', `Enlarge photo: ${photo.title}`);
  const img = document.createElement('img');
  img.src = photo.src; img.alt = photo.caption; img.loading = 'lazy'; img.decoding = 'async';
  if (photo.width) { img.width = photo.width; img.height = photo.height; }
  const caption = document.createElement('span'); caption.textContent = photo.title.replace(/\.[^.]+$/, '');
  button.append(img, caption); button.addEventListener('click', () => openPhoto(index, button)); gallery.append(button);
  const credit = document.createElement('li');
  const link = document.createElement('a'); link.href = photo.source; link.textContent = photo.title;
  credit.append(link, ` — ${photo.author}; `);
  if (photo.licenseUrl) { const license = document.createElement('a'); license.href = photo.licenseUrl; license.textContent = photo.license; credit.append(license); } else credit.append(photo.license);
  if (photo.src.endsWith('.webp')) credit.append(' · resized to WebP');
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
facts.push(
  ['Emergency care pioneers', 'Freedom House Ambulance Service in the Hill District helped establish modern paramedic care.'],
  ['The Point', 'Point State Park marks the confluence and preserves the site of historic forts.'],
  ['A market district', 'The Strip District is known for specialty grocers, produce stands and food markets.'],
  ['Classrooms with a story', 'The Cathedral of Learning contains Nationality Rooms that reflect different cultures.'],
  ['The Three Sisters', 'The Roberto Clemente, Andy Warhol and Rachel Carson bridges span the Allegheny.'],
  ['A walk-off championship', 'Bill Mazeroski ended the 1960 World Series with a home run for the Pirates.'],
  ['A famous towel', 'Broadcaster Myron Cope introduced the Terrible Towel in 1975.'],
  ['Two ways uphill', 'The Duquesne and Monongahela inclines serve Mount Washington.']
);
facts.forEach(([title, body]) => { const card = document.createElement('details'); card.className = 'fact'; const summary = document.createElement('summary'); summary.textContent = title; const p = document.createElement('p'); p.textContent = body; card.append(summary,p); document.querySelector('#facts').append(card); });
const photoIndex = key => photos.findIndex(photo => photo.src.endsWith('/' + key + '.webp'));
const places = [
['Downtown skyline','See the towers and river junction from the slopes of Mount Washington.','https://www.visitpittsburgh.com/neighborhoods/mount-washington/',0],
['Pittsburgh bridges','Look down the Allegheny for the Three Sisters, including the Roberto Clemente Bridge.','https://www.visitpittsburgh.com/media/press-kit/pittsburgh-facts-trivia/',photoIndex('pgh-bridge')],
['North Shore','Follow the riverfront paths between the ballpark and stadium.','https://www.mlb.com/pirates/ballpark',photoIndex('pgh-north')],

['Mount Washington','A hillside neighborhood with sweeping views of downtown and the rivers. Come for the overlooks and sunset.','https://www.visitpittsburgh.com/neighborhoods/mt-washington/',0],
['Duquesne Incline','Ride a historic incline up Mount Washington for a memorable view of the city.','https://www.duquesneincline.org/',photoIndex('pgh-incline') < 0 ? 2 : photoIndex('pgh-incline')],
['Point State Park','At the meeting of the rivers, this downtown park makes a lovely picnic and waterfront stroll.','https://www.pa.gov/agencies/dcnr/recreation/where-to-go/state-parks/find-a-park/point-state-park.html',1],
['Strip District','A lively market neighborhood full of food shops and places to wander together.','https://www.visitpittsburgh.com/neighborhoods/strip-district/',6],
['Phipps Conservatory','Explore glasshouse gardens and seasonal displays for a colorful, relaxed date.','https://www.phipps.conservatory.org/',photoIndex('pgh-phipps')],
['Andy Warhol Museum','Discover the Pittsburgh-born artist through art and archives in his hometown.','https://www.warhol.org/',photoIndex('pgh-warhol')],
['Cathedral of Learning','The University of Pittsburgh landmark houses the beautiful Nationality Rooms.','https://www.nationalityrooms.pitt.edu/',photoIndex('pgh-cathedral')],
['PNC Park','The Pirates’ riverside ballpark offers baseball with a skyline backdrop.','https://www.mlb.com/pirates/ballpark',4],
['Acrisure Stadium','Home of the Steelers on the North Shore: a destination for a black-and-gold game day.','https://acrisurestadium.com/',3],
['PPG Paints Arena','The Penguins’ home arena also hosts concerts and other events.','https://www.ppgpaintsarena.com/',5],
['Carnegie Museum of Natural History','Meet dinosaurs and explore the natural world in Oakland.','https://carnegiemnh.org/',null],
['Kennywood','A historic amusement park in nearby West Mifflin, with rides for a playful day out.','https://www.kennywood.com/',photoIndex('pgh-kennywood')]];
places.forEach(([name,description,url,photo]) => { const card=document.createElement('article'); card.className='place'; if(photo!==null && photos[photo]) { const img=document.createElement('img'); img.src=photos[photo].src; img.alt=photos[photo].title.replace(/\.[^.]+$/, ''); img.loading='lazy'; card.append(img); } const div=document.createElement('div'); const heading=document.createElement('h3'); heading.textContent=name; const p=document.createElement('p'); p.textContent=description; const a=document.createElement('a'); a.href=url; a.textContent='Explore this place ↗'; div.append(heading,p,a); card.append(div); document.querySelector('#places-grid').append(card); });
const activities=['Watch the sunset from Mount Washington','Ride the Duquesne Incline','Go to a Steelers game','Take photos on the yellow bridges','Have a picnic in Point State Park','Explore the Strip District','Visit Phipps Conservatory','Go on an ice cream date','See Pittsburgh at night','Go to a Pirates game','Explore a museum','Take a photo with the skyline behind us'];
// Checklist indexes are the stored IDs. Add future activities at the end.
activities.push('Walk the North Shore Riverfront Park', 'See a Penguins game',
  'Visit the Heinz History Center', 'Try a sandwich in the Strip District');
TravelGuide.checklist({ list: document.querySelector('#bucket-list'), label: document.querySelector('#progress'),
  bar: document.querySelector('#pgh-progress-bar'), activities, key: 'chapter_one_pittsburgh_bucket_v1' });

const dialect = [
  ['Yinz', 'You all.', 'Are yinz coming to the game?'],
  ['Dahntahn', 'A local pronunciation of downtown.', 'We’re heading dahntahn.'],
  ['Slippy', 'Slippery.', 'The steps are slippy this morning.'],
  ['Redd up', 'Tidy up.', 'Let’s redd up before everyone comes over.'],
  ['Gumband', 'A rubber band.', 'Put a gumband around those postcards.'],
  ['Nebby', 'Nosy or overly curious.', 'Don’t get nebby about the surprise.'],
  ['N’at', 'And that, or and so on.', 'We got sandwiches, fries, n’at.'],
  ['Jagoff', 'A rude word for an irritating person.', 'Don’t be a jagoff in the parking lot.'],
  ['Jaggerbush', 'A thorny bush.', 'Stay clear of that jaggerbush.'],
  ['Stillers', 'A local pronunciation of Steelers.', 'The Stillers play on Sunday.'],
  ['Pop', 'A soft drink.', 'Want a pop with your sandwich?'],
  ['Walsh', 'A local pronunciation of wash.', 'I’ll walsh the dishes.']
];
const words = document.querySelector('#pgh-words');
for (const [word, definition, example] of dialect) {
  words.append(TravelGuide.node('dt', word), TravelGuide.node('dd', definition + ' “' + example + '”'));
}
for (const card of document.querySelectorAll('[data-food-photo]')) {
  const photo = photos[photoIndex(card.dataset.foodPhoto)];
  if (!photo) continue;
  const image = document.createElement('img');
  image.src = photo.src;
  image.alt = photo.caption;
  image.loading = 'lazy';
  image.width = photo.width;
  image.height = photo.height;
  card.prepend(image);
}
document.querySelector('#pick-adventure').addEventListener('click',()=>{document.querySelector('#picked').textContent=activities[Math.floor(Math.random()*activities.length)]+' ♡';});
const steelersQuestions=[['How many Super Bowls have the Steelers won?',['Six','Three','Eight'],0],['What year was the team founded?',['1933','1975','1969'],0],['Where do the Steelers play their home games?',['Acrisure Stadium','PNC Park','PPG Paints Arena'],0],['Who created the Terrible Towel?',['Myron Cope','Andy Warhol','Art Rooney II'],0],['What colors are associated with the Steelers?',['Black and gold','Red and blue','Green and white'],0],['Which team did Pittsburgh defeat in Super Bowl XLIII?',['Arizona Cardinals','Minnesota Vikings','Seattle Seahawks'],0]];
const pittsburghQuestions=[['What does “yinz” mean?',['You all','Hello','Thank you'],0],['Which rivers meet to form the Ohio?',['Allegheny and Monongahela','Ohio and Mississippi','Delaware and Susquehanna'],0],['Which artist was born in Pittsburgh?',['Andy Warhol','Claude Monet','Frida Kahlo'],0],['What is tucked inside a classic Primanti sandwich?',['Fries and coleslaw','Pasta and cheese','Apples and honey'],0]];
const cityQuestions = [
  ['What is Pittsburgh’s industrial nickname?', 'Steel City', 'Motor City', 'Windy City', 'Music City'],
  ['Which river begins where the Allegheny and Monongahela meet?', 'Ohio', 'Mississippi', 'Hudson', 'Potomac'],
  ['What is the name of the park at the river confluence?', 'Point State Park', 'Frick Park', 'Schenley Park', 'Riverview Park'],
  ['Which neighborhood is known for river overlooks?', 'Mount Washington', 'Squirrel Hill', 'Shadyside', 'Bloomfield'],
  ['When did the Duquesne Incline open?', '1877', '1928', '1933', '1975'],
  ['Which incline also serves Mount Washington?', 'Monongahela Incline', 'Phipps Incline', 'Frick Incline', 'Schenley Incline'],
  ['Which neighborhood is famous for specialty grocers and markets?', 'Strip District', 'North Shore', 'Mount Washington', 'South Side Slopes'],
  ['What is the Pirates’ home ballpark?', 'PNC Park', 'Acrisure Stadium', 'PPG Paints Arena', 'Kennywood'],
  ['Which team plays at PPG Paints Arena?', 'Penguins', 'Steelers', 'Pirates', 'Riverhounds'],
  ['Who hit the walk-off home run to win the 1960 World Series?', 'Bill Mazeroski', 'Willie Stargell', 'Myron Cope', 'Franco Harris'],
  ['What team won the 1979 World Series?', 'Pittsburgh Pirates', 'Baltimore Orioles', 'Philadelphia Phillies', 'Boston Red Sox'],
  ['Which team won the Stanley Cup in both 2016 and 2017?', 'Pittsburgh Penguins', 'Vegas Golden Knights', 'Edmonton Oilers', 'Boston Bruins'],
  ['Which artist has a museum on the North Shore?', 'Andy Warhol', 'Georgia O’Keeffe', 'Edward Hopper', 'Jackson Pollock'],
  ['Which university houses the Nationality Rooms?', 'University of Pittsburgh', 'Penn State', 'Temple University', 'Drexel University'],
  ['What can you visit at Phipps Conservatory?', 'Glasshouse gardens', 'A baseball field', 'An incline station', 'A football museum'],
  ['Who pioneered paramedic services in Pittsburgh’s Hill District?', 'Freedom House Ambulance Service', 'The Pirates', 'The Duquesne Incline Society', 'The Nationality Rooms'],
  ['What is a pierogi?', 'A filled dumpling', 'A layered sandwich', 'A smoked sausage', 'A baked apple'],
  ['What does “redd up” mean?', 'Tidy up', 'Turn left', 'Go downhill', 'Make a sandwich'],
  ['What is a gumband?', 'A rubber band', 'A brass band', 'A bridge cable', 'A scarf'],
  ['What does “slippy” mean?', 'Slippery', 'Hungry', 'Late', 'Noisy'],
  ['Which area code gives “the 412” its name?', '412', '215', '212', '305'],
  ['Which river do the Three Sisters bridges cross?', 'Allegheny', 'Monongahela', 'Ohio', 'Susquehanna'],
  ['Which baseball player is honored by a Three Sisters bridge?', 'Roberto Clemente', 'Hank Aaron', 'Babe Ruth', 'Jackie Robinson'],
  ['Kennywood is best known as what?', 'An amusement park', 'A rail station', 'A conservatory', 'A football stadium']
].map(([question, ...options]) => [question, options]);

TravelGuide.quiz(document.querySelector('#steelers-quiz .quiz-content'), steelersQuestions, { length: 6 });
TravelGuide.quiz(document.querySelector('#pittsburgh-quiz .quiz-content'), [...pittsburghQuestions, ...steelersQuestions, ...cityQuestions]);
