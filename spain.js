'use strict';

const spainSources = {
  turia: ['Valencia’s Turia Gardens', 'https://www.spain.info/en/places-of-interest/turia-gardens/'],
  guggenheim: ['Guggenheim Museum Bilbao’s building guide', 'https://www.guggenheim-bilbao.eus/en/the-building'],
  sanJuan: ['Alicante’s San Juan bonfire tradition', 'https://www.spain.info/en/calendar/bonfires-san-juan-alicante/'],
  units: ['NIST on U.S. customary and metric units', 'https://www.nist.gov/pml/owm/metric-si/unit-conversion/approximate-conversions-us-customary-measures-metric'],
  cuisine: ['Spain’s traditional regional dishes', 'https://www.spain.info/en/discover-spain/dishes-traditional-cuisine-spain/'],
  madrid: ['Madrid’s official tourism guide', 'https://www.esmadrid.com/en/madrid-top-10'],
  travel: ['Spain’s official destination guide', 'https://www.spain.info/en/destinations/'],
  festivals: ['Turespaña’s festival guide', 'https://www.spain.info/export/sites/segtur/.content/Folletos/folletos/Fiestas_de_Espana_EN.pdf'],
  culture: ['Spain’s official guide to customs', 'https://www.spain.info/en/about-spain/'],
  christmas: ['Christmas customs', 'https://www.spain.info/en/top/christmas-traditions-spain/'],
  food: ['Turespaña’s gastronomy guide', 'https://www.spain.info/export/sites/segtur/.content/Folletos/folletos/Gastronomia_Ingles_A4_Final_Web.pdf'],
  unesco: ['UNESCO World Heritage in Spain', 'https://whc.unesco.org/en/statesparties/es'],
  regions: ['The Spanish government’s guide to the autonomous communities', 'https://www.lamoncloa.gob.es/lang/en/espana/Paginas/state-organization.aspx'],
  languages: ['The Spanish Constitution, section 3', 'https://www.senado.es/web/conocersenado/normas/constitucion/detalleconstitucioncompleta/index.html?lang=en'],
  football: ['Real Madrid club history', 'https://www.realmadrid.com/en-US/news/club/latest-news/120-years-in-the-making'],
  cups: ['FIFA’s Real Madrid profile', 'https://www.fifa.com/en/articles/real-madrid-club-profile-history-players-qualified'],
  words: ['Royal Spanish Academy dictionary', 'https://dle.rae.es/'],
  travelTips: ['Spain’s travel information', 'https://www.spain.info/en/travel-tips/'],
  tipping: ['Emily Post Institute tipping guide', 'https://emilypost.com/advice/general-tipping-guide']
};

const madridStops = [
  ['madrid', 'Gran Vía', 'Follow Madrid’s theatre avenue from its ornate façades to the lights around Callao.', 'madrid'],
  ['sol', 'Puerta del Sol', 'Find the Kilometer Zero plaque, the bear and strawberry tree, and the clock behind the New Year’s chimes.', 'madrid'],
  ['plaza-mayor', 'Plaza Mayor', 'Step through an archway into a square lined with arcades and red façades.', 'madrid'],
  ['retiro', 'El Retiro', 'Walk around the lake and look for the glass Palacio de Cristal among the trees.', 'madrid'],
  ['palace', 'Royal Palace', 'Visit the palace by Plaza de la Armería, with the Royal Collections Gallery nearby.', 'madrid'],
  ['bernabeu', 'Santiago Bernabéu', 'Real Madrid’s home ground sits on the Paseo de la Castellana.', 'madrid'],
  ['cibeles', 'Plaza de Cibeles', 'Look for the fountain and the ornate Palacio de Cibeles at this grand junction.', 'madrid']
];

const spainDestinations = [
  ['cibeles', 'Madrid', 'Boulevards, parks and art museums in the capital.', 'The Paseo del Prado and Buen Retiro form a UNESCO-listed landscape.', 'Pair a museum visit with a walk in El Retiro.', 'unesco'],
  ['barcelona', 'Barcelona', 'Modernisme and the Mediterranean in the same city.', 'The Nativity façade and crypt of the Sagrada Família are part of the UNESCO listing for Gaudí’s works.', 'Look for Gaudí’s details with time to spare.', 'unesco'],
  ['seville', 'Seville', 'Orange-tree courtyards and shaded lanes in Andalusia.', 'Plaza de España was built for the 1929 exposition.', 'Circle its tiled alcoves in María Luisa Park.', 'travel'],
  ['granada', 'Granada', 'Hilltop views and layers of Andalusian history.', 'The Alhambra preserves Nasrid palace architecture.', 'Leave time for the Generalife gardens.', 'unesco'],
  ['valencia', 'Valencia', 'A Mediterranean city with a long park in its former riverbed.', 'Paella is rooted in Valencian cooking.', 'Plan a rice lunch and a walk through the Turia Garden.', 'turia'],
  ['malaga', 'Málaga', 'An Andalusian port with a walkable historic center.', 'Pablo Picasso was born here.', 'Visit the Alcazaba and walk down toward the port.', 'travel'],
  ['alicante', 'Alicante', 'A Costa Blanca city below a hilltop fortress.', 'Santa Bárbara Castle stands on Mount Benacantil.', 'Go up for the harbor view, then walk the waterfront.', 'travel'],
  ['san-sebastian', 'San Sebastián', 'A Basque coastal city curled around La Concha Bay.', 'Donostia is its Basque name.', 'Walk the bay and try pintxos in the old town.', 'travel'],
  ['bilbao', 'Bilbao', 'A riverside Basque city with a strong design identity.', 'Frank Gehry designed the Guggenheim Museum Bilbao.', 'Follow the river on foot to see the museum from several angles.', 'guggenheim'],
  ['galicia', 'Galicia', 'An Atlantic region with estuaries, seafood and pilgrimage routes.', 'The Camino de Santiago ends at Santiago de Compostela for many pilgrims.', 'Visit the old town and try pulpo a la gallega.', 'unesco'],
  ['balearics', 'Balearic Islands', 'Mediterranean islands with coves, old towns and coastal trails.', 'Mallorca is the largest island in the group.', 'Visit Palma’s cathedral or find a sunset by the water.', 'travel'],
  ['canaries', 'Canary Islands', 'Atlantic islands shaped by volcanic landscapes.', 'Teide National Park is on Tenerife.', 'See the volcanic scenery and walk a marked trail.', 'unesco']
];

const spainFood = [
  ['tortilla', 'Tortilla de patatas', 'A thick egg-and-potato omelette. The onion question is a matter of taste.'],
  ['croquetas', 'Croquetas', 'Crisp crumbs around a creamy filling. Ham is a classic option.'],
  ['jamon', 'Jamón ibérico', 'Thin slices of cured ham from Iberian pigs. Acorn-fed ham is one category.'],
  ['paella', 'Paella valenciana', 'Rice cooked in a wide, shallow pan. Valencian versions traditionally use meat and beans.'],
  ['bravas', 'Patatas bravas', 'Potato pieces with a punchy sauce. Recipes change from bar to bar.'],
  ['churros', 'Churros con chocolate', 'Fried dough meant for dipping into thick hot chocolate.'],
  ['gazpacho', 'Gazpacho', 'A chilled vegetable soup associated with Andalusia, usually tomato-based.'],
  ['pan-tomate', 'Pan con tomate', 'Bread rubbed with tomato and dressed with olive oil. In Catalan, pa amb tomàquet.'],
  ['pulpo', 'Pulpo a la gallega', 'Galician-style octopus with olive oil, salt and paprika.'],
  ['calamares', 'Bocadillo de calamares', 'Fried squid rings in a roll, a Madrid classic around Plaza Mayor.'],
  ['pintxos', 'Pintxos', 'Small Basque bar bites, often served on bread with a skewer.']
];

const spainFacts = [
  ['Madrid is Spain’s capital.', 'madrid'],
  ['Spain shares the Iberian Peninsula with Portugal.', 'culture'],
  ['The Balearics lie in the Mediterranean.', 'travel'],
  ['The Canaries lie in the Atlantic, off northwestern Africa.', 'travel'],
  ['Teide National Park protects a volcanic landscape on Tenerife.', 'unesco'],
  ['Spain’s official state language is Castilian Spanish. Other Spanish languages can be co-official in their autonomous communities.', 'languages'],
  ['Galician is used alongside Spanish in Galicia.', 'regions'],
  ['Basque, or Euskara, is spoken in the Basque Country.', 'travel'],
  ['Valencian is used alongside Spanish in the Valencian Community.', 'travel'],
  ['Santiago de Compostela’s old town has a World Heritage listing.', 'unesco'],
  ['The Alhambra and the Generalife are part of the same World Heritage listing.', 'unesco'],
  ['The Prado and Retiro area is listed as the Landscape of Light.', 'unesco'],
  ['Gran Vía is known for theatres and cinemas.', 'madrid'],
  ['Kilometer Zero is marked in Puerta del Sol.', 'madrid'],
  ['The Bernabéu is home to Real Madrid.', 'madrid'],
  ['Real Madrid was founded in 1902.', 'football'],
  ['Real Madrid won the first five European Cups.', 'cups'],
  ['Paella comes from Valencia’s rice-growing tradition.', 'food'],
  ['Horchata in Valencia is commonly made with tiger nuts.', 'food'],
  ['Pintxos are closely associated with Basque bar culture.', 'food'],
  ['The twelve grapes are eaten one per midnight chime on New Year’s Eve.', 'christmas'],
  ['Children often receive gifts around Three Kings Day, January 6.', 'christmas'],
  ['Valencia’s Fallas tradition includes large figures that are burned at the end of the festival.', 'culture'],
  ['Seville’s April Fair is known for its casetas, or festival booths.', 'culture'],
  ['Meals in Spain are often served later than U.S. visitors expect.', 'culture'],
  ['A tapa is a small portion. It can be ordered on its own or shared.', 'food']
];

const spainTraditions = [
  ['Three Kings Day', 'Look for the January 5 parades before the January 6 holiday, when many families exchange gifts.', 'christmas'],
  ['Twelve grapes', 'One grape per midnight chime on New Year’s Eve. Puerta del Sol is a famous place to follow the countdown.', 'christmas'],
  ['Semana Santa', 'Holy Week processions vary by town. Seville is especially known for its elaborate processions.', 'festivals'],
  ['Las Fallas', 'Valencia fills with large satirical figures during this March festival. Many are burned at the close.', 'festivals'],
  ['Feria de Abril', 'Seville’s spring fair brings music, dancing and gatherings in rows of casetas.', 'festivals'],
  ['San Juan', 'Some coastal communities mark midsummer with bonfires around the night of June 23.', 'sanJuan'],
  ['Sanfermines', 'Pamplona’s July celebrations include processions, music and the running of the bulls.', 'festivals']
];

const comparison = [
  ['Lunch and dinner', 'Lunch often spans 1–4 p.m. and dinner 8–11 p.m.', 'Earlier meals are common. A 6 p.m. dinner can feel perfectly normal.'],
  ['Tipping', 'A tip is appreciated, with no standard restaurant percentage.', 'A percentage tip is customary at many full-service restaurants.'],
  ['Greetings', 'Two cheek kisses can be familiar in social settings. Follow the other person’s lead.', 'A hello, handshake or hug may fit, depending on the setting.'],
  ['Football', 'Fútbol normally means soccer.', 'Football usually means the game played in helmets.'],
  ['Getting around', 'Madrid and other large cities have metro networks. Trains link major cities.', 'Some cities have extensive transit. Cars are common in many suburbs and smaller places.'],
  ['Measurements', 'Road distances use kilometers.', 'Road distances are commonly given in miles.'],
  ['Temperature', 'Weather forecasts use Celsius.', 'Weather forecasts generally use Fahrenheit.'],
  ['Food culture', 'A tapas outing can mean sharing several small plates.', 'Small plates exist too. Individual entrées are common at sit-down meals.'],
  ['Social life', 'A plaza or terrace can be the meeting spot for a long evening out.', 'Porches, parks and neighborhood restaurants can play a similar role.'],
  ['Holiday traditions', 'Three Kings parades and New Year’s grapes are familiar traditions.', 'Thanksgiving and a New Year’s ball drop are familiar examples.']
];

const spainActivities = [
  'Watch Real Madrid play at the Bernabéu', 'Eat churros with chocolate in Madrid',
  'Walk through El Retiro', 'Have a tapas night', 'Explore Gran Vía',
  'Visit the Alhambra', 'See the Sagrada Família', 'Watch a sunset in Mallorca',
  'Try authentic Valencian paella', 'Visit a Spanish Christmas market', 'Take a road trip through Spain',
  'Spend a day at a Mediterranean beach', 'Visit a traditional Spanish festival',
  'Eat croquetas together', 'Explore a new Spanish city', 'Find Kilometer Zero at Puerta del Sol',
  'Explore the Royal Palace', 'Try pintxos in San Sebastián', 'Walk along the river in Bilbao',
  'Visit Santiago de Compostela', 'See the volcanic landscape of Teide', 'Explore Plaza de España in Seville'
];

const spainQuestions = [
  ['What is Spain’s capital?', 'Madrid', 'Barcelona', 'Seville', 'Valencia'],
  ['Which country shares the Iberian Peninsula with Spain?', 'Portugal', 'Ireland', 'Greece', 'Austria'],
  ['Which sea surrounds the Balearic Islands?', 'Mediterranean', 'Black Sea', 'North Sea', 'Baltic'],
  ['Which ocean surrounds the Canary Islands?', 'Atlantic', 'Pacific', 'Indian', 'Arctic'],
  ['On which island is Teide National Park?', 'Tenerife', 'Mallorca', 'Menorca', 'Ibiza'],
  ['Where is the Alhambra?', 'Granada', 'Bilbao', 'Alicante', 'Madrid'],
  ['What city is home to the Sagrada Família?', 'Barcelona', 'Málaga', 'Madrid', 'Seville'],
  ['Where is La Concha Bay?', 'San Sebastián', 'Valencia', 'Bilbao', 'Granada'],
  ['What is the Basque name for San Sebastián?', 'Donostia', 'Iruña', 'Gasteiz', 'Bilbo'],
  ['Where is the Guggenheim museum designed by Frank Gehry?', 'Bilbao', 'Granada', 'Valencia', 'Alicante'],
  ['Which city was Picasso born in?', 'Málaga', 'Madrid', 'Seville', 'Cádiz'],
  ['Where do many Camino de Santiago routes end?', 'Santiago de Compostela', 'Palma', 'Segovia', 'Salamanca'],
  ['Which region is associated with paella?', 'Valencia', 'Galicia', 'Asturias', 'Cantabria'],
  ['What is the main ingredient in tortilla de patatas besides eggs?', 'Potatoes', 'Chickpeas', 'Rice', 'Peppers'],
  ['What do you dip churros into on a classic Madrid outing?', 'Thick hot chocolate', 'Olive oil', 'Gazpacho', 'Tomato sauce'],
  ['Which dish is a chilled vegetable soup?', 'Gazpacho', 'Croquetas', 'Paella', 'Tortilla'],
  ['What are pintxos?', 'Small Basque bar bites', 'A type of rice pan', 'Hot chocolate', 'Cured ham'],
  ['What is pulpo a la gallega made with?', 'Octopus', 'Squid', 'Tuna', 'Chicken'],
  ['What is inside a bocadillo de calamares?', 'Fried squid rings', 'Grilled pork', 'Potato omelette', 'Octopus'],
  ['What does pa amb tomàquet mean?', 'Bread with tomato', 'Rice with beans', 'Eggs with potatoes', 'Chocolate with churros'],
  ['What are patatas bravas?', 'Potatoes with a punchy sauce', 'A cold soup', 'Green olives', 'Cured sausages'],
  ['What are Valencia’s traditional horchata drinks commonly made from?', 'Tiger nuts', 'Coffee beans', 'Grapes', 'Potatoes'],
  ['Which plaza has the Kilometer Zero plaque?', 'Puerta del Sol', 'Plaza Mayor', 'Plaza de España in Seville', 'Plaza de Cibeles'],
  ['What is El Retiro?', 'A park', 'A football stadium', 'A mountain', 'An island'],
  ['What kind of venue is Gran Vía known for?', 'Theatres', 'Ski lifts', 'Bullrings', 'Aquariums'],
  ['Which Spanish city has the Bernabéu?', 'Madrid', 'Barcelona', 'Bilbao', 'Valencia'],
  ['Which club plays home matches at the Bernabéu?', 'Real Madrid', 'FC Barcelona', 'Athletic Club', 'Sevilla FC'],
  ['When was Real Madrid founded?', '1902', '1956', '1978', '2000'],
  ['How many of the first European Cups did Real Madrid win in a row?', 'Five', 'One', 'Two', 'Three'],
  ['Which club faces Real Madrid in El Clásico?', 'FC Barcelona', 'Atlético Madrid', 'Valencia CF', 'Athletic Club'],
  ['How many grapes are eaten at midnight on New Year’s Eve?', 'Twelve', 'Six', 'Eight', 'Ten'],
  ['When is Three Kings Day?', 'January 6', 'December 24', 'March 19', 'June 24'],
  ['Which city is known for Las Fallas?', 'Valencia', 'Madrid', 'Bilbao', 'Málaga'],
  ['Which city hosts the famous Feria de Abril?', 'Seville', 'Barcelona', 'Alicante', 'Granada'],
  ['What does Semana Santa mean?', 'Holy Week', 'New Year’s Eve', 'Summer solstice', 'Three Kings Day'],
  ['Which tradition is associated with San Juan on some coasts?', 'Bonfires', 'Eating twelve grapes', 'Three Kings parades', 'Fallas figures'],
  ['Which city is associated with Sanfermines?', 'Pamplona', 'Madrid', 'Málaga', 'Palma'],
  ['Which language is official throughout Spain under its constitution?', 'Castilian Spanish', 'French', 'Portuguese', 'English'],
  ['What does gracias mean?', 'Thank you', 'Good morning', 'Please', 'Excuse me'],
  ['What does por favor mean?', 'Please', 'Goodbye', 'Good evening', 'See you tomorrow'],
  ['What does buenos días mean?', 'Good morning', 'Good night', 'Thank you', 'See you soon'],
  ['What could you ask for with “la cuenta, por favor”?', 'The bill', 'The menu', 'A glass of water', 'A seat by the door']
].map(([question, ...options]) => [question, options]);

const { node: guideNode } = TravelGuide;

function sourceLink(key, label = 'Source') {
  const link = guideNode('a', label);
  link.href = spainSources[key][1];
  return link;
}

function photoFor(id) {
  const photo = spainPhotos[id];
  if (!photo) {
    const tile = guideNode('div', '', 'guide-tile');
    tile.setAttribute('aria-hidden', 'true');
    return tile;
  }
  const image = guideNode('img');
  image.src = photo.src;
  image.alt = photo.caption;
  image.width = photo.width;
  image.height = photo.height;
  image.loading = 'lazy';
  image.decoding = 'async';
  return image;
}

function fillCards(selector, entries) {
  const root = document.querySelector(selector);
  entries.forEach(([id, title, description, fact, experience, source]) => {
    const card = guideNode('article', '', 'guide-card');
    const copy = guideNode('div', '', 'guide-copy');
    copy.append(guideNode('h3', title), guideNode('p', description));
    if (fact) copy.append(guideNode('p', fact, 'guide-fact'));
    if (experience) copy.append(guideNode('p', experience));
    if (source) copy.append(sourceLink(source));
    card.append(photoFor(id), copy);
    root.append(card);
  });
}

fillCards('#madrid-cards', madridStops.map(([id, name, description, source]) => [id, name, description, '', '', source]));
fillCards('#spain-cards', spainDestinations);
fillCards('#spain-food', spainFood.map(row => [...row, '', '', 'cuisine']));

for (const [fact, source] of spainFacts) {
  const item = guideNode('li', fact + ' ');
  item.append(sourceLink(source));
  document.querySelector('#spain-facts').append(item);
}
for (const [title, text, source] of spainTraditions) {
  const article = guideNode('article', '', 'guide-copy');
  article.append(guideNode('h3', title), guideNode('p', text), sourceLink(source));
  document.querySelector('#spain-traditions').append(article);
}
for (const [topic, spain, usa] of comparison) {
  const row = guideNode('tr');
  const header = guideNode('th', topic);
  header.scope = 'row';
  row.append(header, guideNode('td', spain), guideNode('td', usa));
  document.querySelector('#spain-comparison').append(row);
}
for (const [name, url] of Object.values(spainSources)) {
  const item = guideNode('li');
  const link = guideNode('a', name);
  link.href = url;
  item.append(link);
  document.querySelector('#spain-sources').append(item);
}
for (const photo of Object.values(spainPhotos)) {
  const item = guideNode('li');
  const original = guideNode('a', photo.title);
  original.href = photo.source;
  const license = guideNode('a', photo.license);
  license.href = photo.licenseUrl;
  item.append(original, ' · ' + photo.author + ' · ', license, ' · resized to WebP');
  document.querySelector('#spain-credits').append(item);
}
TravelGuide.checklist({ list: document.querySelector('#spain-list'), label: document.querySelector('#spain-progress'),
  bar: document.querySelector('#spain-progress-bar'), activities: spainActivities, key: 'chapter_one_spain_checklist_v1' });
TravelGuide.quiz(document.querySelector('#spain-quiz'), spainQuestions, {
  title: score => score === 10 ? 'Honorary Spaniard' : score >= 8 ? 'Almost Madrileño' :
    score >= 5 ? 'Tapas Expert' : 'Spanish Tourist'
});
