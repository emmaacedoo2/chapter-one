// ==========================================================================
// Date Ideas Database & Logic
// Personal date idea generator for boyfriend & girlfriend
// ==========================================================================

const DATE_IDEAS = [
  {
    id: 1,
    title: "Homemade Pizza Showdown",
    budget: "cheap", // cheap ($1–20)
    budgetText: "$10–15 for ingredients",
    location: "home",
    locationText: "at home",
    category: "food",
    categoryText: "food",
    duration: "medium", // 1–3 hours
    durationText: "1.5–2 hours",
    description: "we buy premade dough, split it in half, and compete on who makes the better crust and weirdest topping combo. loser does the dishes."
  },
  {
    id: 2,
    title: "Blanket Fort Movie Marathon",
    budget: "free",
    budgetText: "free",
    location: "home",
    locationText: "at home",
    category: "movies",
    categoryText: "movies & shows",
    duration: "medium",
    durationText: "2–3 hours",
    description: "drag every blanket and pillow in the house into the living room, build a fortress, and watch childhood comfort movies with popcorn."
  },
  {
    id: 3,
    title: "Supermarket Snack Draft",
    budget: "cheap",
    budgetText: "~$15 total",
    location: "home",
    locationText: "at home",
    category: "food",
    categoryText: "food",
    duration: "short", // under 1 hour
    durationText: "45 mins",
    description: "we each get $7 to pick 3 random snacks or drinks the other person has never tried, then do a blind taste test at the kitchen table."
  },
  {
    id: 4,
    title: "Late Night Diner Run",
    budget: "cheap",
    budgetText: "$15–20",
    location: "out",
    locationText: "going out",
    category: "food",
    categoryText: "food",
    duration: "short",
    durationText: "1 hour",
    description: "slip on hoodies and go get fries, pancakes, and milkshakes at an ungodly hour just to sit in a booth and talk."
  },
  {
    id: 5,
    title: "Thrift Store Outfit Swap",
    budget: "cheap",
    budgetText: "$10–15",
    location: "out",
    locationText: "going out",
    category: "funny",
    categoryText: "something funny",
    duration: "medium",
    durationText: "1.5 hours",
    description: "go to a thrift store with a $10 budget to pick out the most chaotic or surprisingly stylish outfit for each other, then grab coffee in them."
  },
  {
    id: 6,
    title: "Sunset Picnic With Cheap Takeout",
    budget: "cheap",
    budgetText: "$15–20",
    location: "out",
    locationText: "going out",
    category: "romantic",
    categoryText: "romantic",
    duration: "short",
    durationText: "1 hour",
    description: "grab burritos or burgers, drive to a high spot or park, and watch the sunset from a blanket or the hood of the car."
  },
  {
    id: 7,
    title: "Chaotic Co-Op Video Game Night",
    budget: "free",
    budgetText: "free",
    location: "home",
    locationText: "at home",
    category: "active",
    categoryText: "something active",
    duration: "medium",
    durationText: "2 hours",
    description: "play Overcooked, Mario Kart, or It Takes Two until we either achieve telepathic teamwork or rage quit laughing."
  },
  {
    id: 8,
    title: "Bob Ross Painting Challenge",
    budget: "cheap",
    budgetText: "~$12 for canvases & paint",
    location: "home",
    locationText: "at home",
    category: "creative",
    categoryText: "creative",
    duration: "medium",
    durationText: "1.5 hours",
    description: "grab dollar store canvases, put on Bob Ross on YouTube, and try to keep up without pausing. happy little accidents only."
  },
  {
    id: 9,
    title: "Pretend Restaurant At Home",
    budget: "cheap",
    budgetText: "$10–15",
    location: "home",
    locationText: "at home",
    category: "funny",
    categoryText: "something funny",
    duration: "medium",
    durationText: "1.5 hours",
    description: "one of us writes a silly handwritten menu, the other orders, and we dress up way too fancy just to eat pasta at our kitchen counter."
  },
  {
    id: 10,
    title: "Bookstore Hunt & Chapter One",
    budget: "cheap",
    budgetText: "$5–15 (coffee or book)",
    location: "out",
    locationText: "going out",
    category: "creative",
    categoryText: "creative",
    duration: "short",
    durationText: "1 hour",
    description: "wander a bookstore, pick a book we think the other would love, and read the first chapter together over iced drinks."
  },
  {
    id: 11,
    title: "Arcade Air Hockey Duel",
    budget: "medium", // medium ($20–60)
    budgetText: "$20–30",
    location: "out",
    locationText: "going out",
    category: "active",
    categoryText: "something active",
    duration: "medium",
    durationText: "1.5 hours",
    description: "find a retro arcade, get a cup of tokens, and bet on who wins at air hockey, racing games, and claw machines."
  },
  {
    id: 12,
    title: "Late Night Drive & Song Queue",
    budget: "free",
    budgetText: "free (just gas)",
    location: "out",
    locationText: "going out",
    category: "romantic",
    categoryText: "romantic",
    duration: "short",
    durationText: "1 hour",
    description: "take turns queueing songs that remind us of each other or guilty pleasure throwbacks with windows down and zero destination."
  },
  {
    id: 13,
    title: "Sunset Walk & Iced Coffee",
    budget: "cheap",
    budgetText: "$8–12",
    location: "out",
    locationText: "going out",
    category: "outdoors",
    categoryText: "outdoors",
    duration: "short",
    durationText: "45 mins",
    description: "grab our favorite iced drinks and take a slow, aimless walk through a pretty neighborhood we don't usually visit."
  },
  {
    id: 14,
    title: "Bake Something Way Too Ambitious",
    budget: "cheap",
    budgetText: "$10–15",
    location: "home",
    locationText: "at home",
    category: "food",
    categoryText: "food",
    duration: "medium",
    durationText: "2 hours",
    description: "pick a dessert recipe with way too many steps (cinnamon rolls, soufflé, or lava cake) and see if we can finish without a kitchen disaster."
  },
  {
    id: 15,
    title: "Museum Day With Fake Backstories",
    budget: "cheap",
    budgetText: "$10–20 (or free days)",
    location: "out",
    locationText: "going out",
    category: "creative",
    categoryText: "creative",
    duration: "medium",
    durationText: "2 hours",
    description: "visit an art or history museum and make up ridiculous, unhinged backstories for all the portraits and statues."
  },
  {
    id: 16,
    title: "Mini Golf Showdown",
    budget: "medium",
    budgetText: "$25–35",
    location: "out",
    locationText: "going out",
    category: "active",
    categoryText: "something active",
    duration: "short",
    durationText: "1 hour",
    description: "play 18 holes of mini golf. winner gets bragging rights and dessert; loser carries the bags."
  },
  {
    id: 17,
    title: "Living Room Indoor Campout",
    budget: "free",
    budgetText: "free",
    location: "home",
    locationText: "at home",
    category: "romantic",
    categoryText: "romantic",
    duration: "medium",
    durationText: "2–3 hours",
    description: "set up blankets and cushions on the floor, make stovetop s'mores, turn off all the lights, and tell ghost stories."
  },
  {
    id: 18,
    title: "Farmer's Market Breakfast Stroll",
    budget: "cheap",
    budgetText: "$10–20",
    location: "out",
    locationText: "going out",
    category: "food",
    categoryText: "food",
    duration: "medium",
    durationText: "1.5 hours",
    description: "stroll around in the morning, sample fresh pastries and berries, and pick one weird ingredient to cook together later."
  },
  {
    id: 19,
    title: "Fancy Dress-Up Dinner Date",
    budget: "expensive", // expensive ($60+)
    budgetText: "$70–120",
    location: "out",
    locationText: "going out",
    category: "romantic",
    categoryText: "romantic",
    duration: "medium",
    durationText: "2 hours",
    description: "dress all the way up and treat ourselves to that nice sit-down spot we've both been saving on Instagram."
  },
  {
    id: 20,
    title: "Fridge Mocktail / Drink Contest",
    budget: "free",
    budgetText: "free (using fridge stash)",
    location: "home",
    locationText: "at home",
    category: "creative",
    categoryText: "creative",
    duration: "short",
    durationText: "40 mins",
    description: "each invent a signature drink using only whatever juices, sodas, and garnishes we already have, and score each other on presentation."
  },
  {
    id: 21,
    title: "Full Day Beach or Lake Trip",
    budget: "free",
    budgetText: "free",
    location: "out",
    locationText: "going out",
    category: "outdoors",
    categoryText: "outdoors",
    duration: "long", // all day
    durationText: "all day (4–6 hours)",
    description: "pack towels, snacks, a speaker, and sunscreen, and spend the entire day swimming, napping, and doing absolutely nothing."
  },
  {
    id: 22,
    title: "Bowling Alley Nostalgia Night",
    budget: "medium",
    budgetText: "$25–40",
    location: "out",
    locationText: "going out",
    category: "funny",
    categoryText: "something funny",
    duration: "medium",
    durationText: "1.5 hours",
    description: "rent the ugly shoes, order greasy bowling alley fries, and celebrate every single gutter ball like an Olympic medal."
  },
  {
    id: 23,
    title: "2000s Music Video Rabbit Hole",
    budget: "free",
    budgetText: "free",
    location: "home",
    locationText: "at home",
    category: "movies",
    categoryText: "movies & shows",
    duration: "short",
    durationText: "1 hour",
    description: "put YouTube on the TV and take turns putting on the most iconic or bizarre music videos from our childhoods."
  },
  {
    id: 24,
    title: "High-Stakes Board Game Duel",
    budget: "free",
    budgetText: "free",
    location: "home",
    locationText: "at home",
    category: "funny",
    categoryText: "something funny",
    duration: "medium",
    durationText: "1.5 hours",
    description: "best 2 out of 3 in Scrabble, Uno, Catan, or Battleship. winner picks breakfast tomorrow morning."
  },
  {
    id: 25,
    title: "Photo Scavenger Hunt",
    budget: "free",
    budgetText: "free",
    location: "out",
    locationText: "going out",
    category: "funny",
    categoryText: "something funny",
    duration: "short",
    durationText: "1 hour",
    description: "make a quick list of 8 random things to find outside (a cute dog, a yellow car, a weird sign) and take selfie proof with each."
  },
  {
    id: 26,
    title: "Botanical Garden Greenhouse Stroll",
    budget: "cheap",
    budgetText: "$10–18",
    location: "out",
    locationText: "going out",
    category: "outdoors",
    categoryText: "outdoors",
    duration: "medium",
    durationText: "1.5 hours",
    description: "walk through warm greenhouses and flower gardens, take photos of each other, and enjoy the peace and quiet."
  },
  {
    id: 27,
    title: "Air-Dry Clay Sculpting Night",
    budget: "cheap",
    budgetText: "~$10 for clay",
    location: "home",
    locationText: "at home",
    category: "creative",
    categoryText: "creative",
    duration: "medium",
    durationText: "1.5 hours",
    description: "get cheap modeling clay and sculpt little trinkets, ring trays, or goofy miniatures of each other to keep on our desks."
  },
  {
    id: 28,
    title: "Trunk Cinema Under The Stars",
    budget: "cheap",
    budgetText: "$10 for snacks",
    location: "out",
    locationText: "going out",
    category: "movies",
    categoryText: "movies & shows",
    duration: "medium",
    durationText: "2 hours",
    description: "back the car into a quiet viewpoint, pile pillows in the trunk or back seats, and watch a downloaded movie on a laptop."
  },
  {
    id: 29,
    title: "Try A Brand New Cuisine",
    budget: "medium",
    budgetText: "$35–50",
    location: "out",
    locationText: "going out",
    category: "food",
    categoryText: "food",
    duration: "medium",
    durationText: "1.5 hours",
    description: "find a cuisine neither of us has ever tried before (Ethiopian, Nepalese, Greek, or Peruvian) and order the house specialty."
  },
  {
    id: 30,
    title: "500-Piece Puzzle & Lo-Fi Session",
    budget: "free",
    budgetText: "free",
    location: "home",
    locationText: "at home",
    category: "creative",
    categoryText: "creative",
    duration: "medium",
    durationText: "2 hours",
    description: "put on a chill lo-fi beat stream, crack open a puzzle, and see how fast we can finish the outer border."
  },
  {
    id: 31,
    title: "Small Town Explorer Day Trip",
    budget: "medium",
    budgetText: "$30–50",
    location: "out",
    locationText: "going out",
    category: "outdoors",
    categoryText: "outdoors",
    duration: "long",
    durationText: "all day (5 hours)",
    description: "drive 45 minutes out of town to explore a historic main street, poke through antique shops, and try a small local bakery."
  },
  {
    id: 32,
    title: "The Great Two-Shop Ice Cream Crawl",
    budget: "cheap",
    budgetText: "$12–16",
    location: "out",
    locationText: "going out",
    category: "food",
    categoryText: "food",
    duration: "short",
    durationText: "45 mins",
    description: "get one scoop at two different ice cream spots in one night and passionately argue over who has the superior waffle cone."
  },
  {
    id: 33,
    title: "Lego Set Build & Podcast",
    budget: "medium",
    budgetText: "$25–45",
    location: "home",
    locationText: "at home",
    category: "creative",
    categoryText: "creative",
    duration: "medium",
    durationText: "2 hours",
    description: "grab a botanical or pop-culture Lego set, split the bags, and build it together piece by piece while chatting."
  },
  {
    id: 34,
    title: "Stargazing Blanket On The Grass",
    budget: "free",
    budgetText: "free",
    location: "out",
    locationText: "going out",
    category: "romantic",
    categoryText: "romantic",
    duration: "short",
    durationText: "1 hour",
    description: "grab a warm blanket, download a night sky constellation app, and count how many satellites and shooting stars we can spot."
  },
  {
    id: 35,
    title: "Living Room Spa & Face Mask Reset",
    budget: "cheap",
    budgetText: "$6–10 for sheet masks",
    location: "home",
    locationText: "at home",
    category: "romantic",
    categoryText: "romantic",
    duration: "short",
    durationText: "45 mins",
    description: "put on cooling sheet masks, cucumber slices on eyes, soft acoustic music, and take turns giving 10-minute shoulder massages."
  },
  {
    id: 36,
    title: "Escape Room Teamwork Test",
    budget: "medium",
    budgetText: "$50–60",
    location: "out",
    locationText: "going out",
    category: "active",
    categoryText: "something active",
    duration: "short",
    durationText: "1 hour",
    description: "get locked in a puzzle room and see if our combined brain cells can break us out in under 60 minutes."
  },
  {
    id: 37,
    title: "Morning Diner Hash Browns & Crossword",
    budget: "cheap",
    budgetText: "$15–20",
    location: "out",
    locationText: "going out",
    category: "food",
    categoryText: "food",
    duration: "short",
    durationText: "1 hour",
    description: "head to a cozy breakfast spot for coffee, eggs, and crispy hash browns, and solve the daily crossword together on one phone."
  },
  {
    id: 38,
    title: "DIY Living Room Photobooth",
    budget: "free",
    budgetText: "free",
    location: "home",
    locationText: "at home",
    category: "funny",
    categoryText: "something funny",
    duration: "short",
    durationText: "30 mins",
    description: "set up phone on a timer against some books, grab goofy props or sunglasses, and take 4-shot photobooth strips."
  },
  {
    id: 39,
    title: "Roller Skating or Ice Skating",
    budget: "cheap",
    budgetText: "$15–20",
    location: "out",
    locationText: "going out",
    category: "active",
    categoryText: "something active",
    duration: "medium",
    durationText: "1.5 hours",
    description: "hold hands so neither of us wipes out, circle the rink to upbeat music, and laugh our way through sore ankles."
  },
  {
    id: 40,
    title: "Scenic Hike & Summit Sandwiches",
    budget: "free",
    budgetText: "free",
    location: "out",
    locationText: "going out",
    category: "outdoors",
    categoryText: "outdoors",
    duration: "medium",
    durationText: "2.5 hours",
    description: "pack turkey or cheese sandwiches into backpacks, hike a scenic trail, and eat lunch sitting on rocks with a view."
  },
  {
    id: 41,
    title: "Ikea Dream House Tour & Meatballs",
    budget: "cheap",
    budgetText: "$10–15",
    location: "out",
    locationText: "going out",
    category: "funny",
    categoryText: "something funny",
    duration: "short",
    durationText: "1 hour",
    description: "walk through the showroom pretending we're buying a $2M penthouse, test every couch, and finish with cinnamon buns or meatballs."
  },
  {
    id: 42,
    title: "Disposable Camera Mystery Day",
    budget: "cheap",
    budgetText: "~$15 for disposable camera",
    location: "out",
    locationText: "going out",
    category: "creative",
    categoryText: "creative",
    duration: "long",
    durationText: "all day",
    description: "buy a single disposable camera, take candid snapshots of our day without seeing how they turned out, and get them developed next week."
  },
  {
    id: 43,
    title: "Candlelit Living Room Fondue",
    budget: "cheap",
    budgetText: "$12–15",
    location: "home",
    locationText: "at home",
    category: "romantic",
    categoryText: "romantic",
    duration: "short",
    durationText: "45 mins",
    description: "melt chocolate or cheese on the stove, chop up apples, strawberries, and bread cubes, turn off the big lights and dip away."
  },
  {
    id: 44,
    title: "Live Standup Comedy Show",
    budget: "medium",
    budgetText: "$35–50",
    location: "out",
    locationText: "going out",
    category: "funny",
    categoryText: "something funny",
    duration: "medium",
    durationText: "2 hours",
    description: "go to an open mic or local comedy club, grab sodas or drinks, and laugh at good jokes (or cringe together at bad ones)."
  },
  {
    id: 45,
    title: "Pub or Diner Trivia Showdown",
    budget: "cheap",
    budgetText: "$15–25",
    location: "out",
    locationText: "going out",
    category: "active",
    categoryText: "something active",
    duration: "medium",
    durationText: "2 hours",
    description: "enter trivia night as a team of two, test our weird pop culture and geography knowledge, and order loaded fries."
  },
  {
    id: 46,
    title: "Aquarium Date & Ocean Tunnel",
    budget: "expensive",
    budgetText: "$65–85",
    location: "out",
    locationText: "going out",
    category: "romantic",
    categoryText: "romantic",
    duration: "medium",
    durationText: "2 hours",
    description: "walk through the underwater glass tunnel, watch the giant rays glide overhead, and look at sleepy sea otters."
  },
  {
    id: 47,
    title: "Coin-Toss Mystery Road Trip",
    budget: "cheap",
    budgetText: "$15 for gas & snacks",
    location: "out",
    locationText: "going out",
    category: "outdoors",
    categoryText: "outdoors",
    duration: "medium",
    durationText: "2 hours",
    description: "get in the car, flip a coin at every third intersection (heads = left, tails = right), and see where we end up an hour later."
  },
  {
    id: 48,
    title: "Skip Dinner, Straight To Fancy Dessert",
    budget: "medium",
    budgetText: "$25–35",
    location: "out",
    locationText: "going out",
    category: "food",
    categoryText: "food",
    duration: "short",
    durationText: "45 mins",
    description: "skip a heavy dinner entirely and go straight to a fancy bakery or upscale restaurant lounge just to order fancy cake and hot chocolate."
  },
  {
    id: 49,
    title: "Paint Each Other's Portraits",
    budget: "cheap",
    budgetText: "~$8 for paper & markers",
    location: "home",
    locationText: "at home",
    category: "creative",
    categoryText: "creative",
    duration: "short",
    durationText: "30 mins",
    description: "sit across from each other with markers and draw each other's portraits without looking down at the paper. the worse it is, the funnier."
  },
  {
    id: 50,
    title: "Zoo Afternoon & Pretzel Stroll",
    budget: "medium",
    budgetText: "$35–50",
    location: "out",
    locationText: "going out",
    category: "outdoors",
    categoryText: "outdoors",
    duration: "medium",
    durationText: "2.5 hours",
    description: "spend an easy afternoon wandering under shade trees, watching the red pandas, and sharing a giant warm salted pretzel."
  },
  {
    id: 51,
    title: "Carnival Rides & Funnel Cake",
    budget: "expensive",
    budgetText: "$60–80",
    location: "out",
    locationText: "going out",
    category: "active",
    categoryText: "something active",
    duration: "long",
    durationText: "all day (4 hours)",
    description: "ride the ferris wheel at dusk, split a massive powdered-sugar funnel cake, and try to win a plush toy on a rigged ring toss."
  },
  {
    id: 52,
    title: "Living Room Dance Tutorial Disaster",
    budget: "free",
    budgetText: "free",
    location: "home",
    locationText: "at home",
    category: "funny",
    categoryText: "something funny",
    duration: "short",
    durationText: "30 mins",
    description: "put on a beginner salsa or swing dance tutorial on the TV and laugh as we step on each other's toes in our socks."
  },
  {
    id: 53,
    title: "Korean BBQ or All-You-Can-Eat Hot Pot",
    budget: "expensive",
    budgetText: "$65–90",
    location: "out",
    locationText: "going out",
    category: "food",
    categoryText: "food",
    duration: "medium",
    durationText: "2 hours",
    description: "cook thin slices of meat and dumplings right at the table grill, load up on side dishes, and eat until we need to unbutton our pants."
  },
  {
    id: 54,
    title: "Early Sunrise & Warm Donut Run",
    budget: "cheap",
    budgetText: "$6–10",
    location: "out",
    locationText: "going out",
    category: "romantic",
    categoryText: "romantic",
    duration: "short",
    durationText: "1 hour",
    description: "set an early alarm, drive to catch the first morning light while it's still quiet outside, and stop by a local bakery for fresh warm donuts."
  },
  {
    id: 55,
    title: "Power Outage Candlelit Q&A",
    budget: "free",
    budgetText: "free",
    location: "home",
    locationText: "at home",
    category: "romantic",
    categoryText: "romantic",
    duration: "medium",
    durationText: "1.5 hours",
    description: "turn off all screens and overhead lights, light candles, sit on the carpet, and ask each other the 36 questions to fall in love or funny 'would you rather's."
  }
];

// ==========================================================================
// Date Ideas Manager & Controller
// ==========================================================================
const DateApp = {
  ideas: DATE_IDEAS,
  currentIdea: null,
  previousIdeaId: null,

  // Storage keys
  STORAGE_FAVORITES: 'anniversary_fav_date_ideas',
  STORAGE_COMPLETED: 'anniversary_done_date_ideas',

  favorites: [],
  completed: [],

  init() {
    this.loadStorage();
    this.bindEvents();
    this.updateCounters();
    this.renderSavedLists();
  },

  loadStorage() {
    try {
      this.favorites = JSON.parse(localStorage.getItem(this.STORAGE_FAVORITES)) || [];
      this.completed = JSON.parse(localStorage.getItem(this.STORAGE_COMPLETED)) || [];
    } catch (e) {
      this.favorites = [];
      this.completed = [];
    }
  },

  saveStorage() {
    try {
      localStorage.setItem(this.STORAGE_FAVORITES, JSON.stringify(this.favorites));
      localStorage.setItem(this.STORAGE_COMPLETED, JSON.stringify(this.completed));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
    this.updateCounters();
    this.renderSavedLists();
  },

  updateCounters() {
    const doneCountEl = document.getElementById('completed-count-badge');
    const favCountEl = document.getElementById('favorites-count-badge');
    if (doneCountEl) doneCountEl.textContent = this.completed.length;
    if (favCountEl) favCountEl.textContent = this.favorites.length;
  },

  getActiveFilters() {
    const getVal = (name) => {
      const checked = document.querySelector(`input[name="${name}"]:checked`);
      return checked ? checked.value : 'all';
    };

    return {
      budget: getVal('filter-budget'),
      location: getVal('filter-location'),
      category: getVal('filter-category'),
      duration: getVal('filter-duration')
    };
  },

  filterIdeas() {
    const filters = this.getActiveFilters();

    return this.ideas.filter(idea => {
      // Budget check
      if (filters.budget !== 'all' && idea.budget !== filters.budget) {
        return false;
      }
      // Location check
      if (filters.location !== 'all' && idea.location !== filters.location) {
        return false;
      }
      // Category check
      if (filters.category !== 'all' && idea.category !== filters.category) {
        return false;
      }
      // Duration check
      if (filters.duration !== 'all' && idea.duration !== filters.duration) {
        return false;
      }
      return true;
    });
  },

  pickRandomIdea() {
    const matching = this.filterIdeas();
    const resultBox = document.getElementById('date-result-card');
    const emptyBox = document.getElementById('date-empty-state');

    if (matching.length === 0) {
      this.currentIdea = null;
      if (resultBox) resultBox.classList.add('hidden');
      if (emptyBox) emptyBox.classList.remove('hidden');
      return;
    }

    if (emptyBox) emptyBox.classList.add('hidden');

    // Avoid immediately repeating previous idea if options exist
    let candidates = matching;
    if (matching.length > 1 && this.previousIdeaId) {
      candidates = matching.filter(i => i.id !== this.previousIdeaId);
    }

    const randomIndex = Math.floor(Math.random() * candidates.length);
    const selected = candidates[randomIndex];

    this.currentIdea = selected;
    this.previousIdeaId = selected.id;

    this.renderCurrentIdea(selected);
  },

  renderCurrentIdea(idea) {
    const resultBox = document.getElementById('date-result-card');
    if (!resultBox) return;

    // Trigger subtle reveal animation
    resultBox.classList.remove('hidden');
    resultBox.classList.remove('revealed');
    // Force reflow
    void resultBox.offsetWidth;
    resultBox.classList.add('revealed');

    document.getElementById('idea-title').textContent = idea.title;
    document.getElementById('idea-desc').textContent = idea.description;
    document.getElementById('idea-budget').textContent = idea.budgetText;
    document.getElementById('idea-location').textContent = idea.locationText;
    document.getElementById('idea-duration').textContent = idea.durationText;
    document.getElementById('idea-category').textContent = idea.categoryText;

    this.updateCurrentActionButtons();
  },

  updateCurrentActionButtons() {
    if (!this.currentIdea) return;

    const isFav = this.favorites.includes(this.currentIdea.id);
    const isDone = this.completed.includes(this.currentIdea.id);

    const favBtn = document.getElementById('btn-toggle-favorite');
    const doneBtn = document.getElementById('btn-toggle-completed');

    if (favBtn) {
      favBtn.classList.toggle('active', isFav);
      favBtn.querySelector('.btn-label').textContent = isFav ? 'saved to favorites' : 'save to favorites';
    }

    if (doneBtn) {
      doneBtn.classList.toggle('active', isDone);
      doneBtn.querySelector('.btn-label').textContent = isDone ? 'plan completed! ✓' : 'we did this!';
    }
  },

  toggleFavorite(id) {
    const idx = this.favorites.indexOf(id);
    if (idx > -1) {
      this.favorites.splice(idx, 1);
    } else {
      this.favorites.push(id);
    }
    this.saveStorage();
    if (this.currentIdea && this.currentIdea.id === id) {
      this.updateCurrentActionButtons();
    }
  },

  toggleCompleted(id) {
    const idx = this.completed.indexOf(id);
    if (idx > -1) {
      this.completed.splice(idx, 1);
    } else {
      this.completed.push(id);
    }
    this.saveStorage();
    if (this.currentIdea && this.currentIdea.id === id) {
      this.updateCurrentActionButtons();
    }
  },

  resetFilters() {
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
      if (radio.value === 'all') {
        radio.checked = true;
      }
    });
    // Pick fresh
    this.pickRandomIdea();
  },

  renderSavedLists() {
    const favList = document.getElementById('favorites-list');
    const doneList = document.getElementById('completed-list');

    if (favList) {
      if (this.favorites.length === 0) {
        favList.innerHTML = '<p class="empty-list-note">no favorites saved yet. click the little heart on any plan you like!</p>';
      } else {
        favList.innerHTML = this.favorites.map(id => {
          const idea = this.ideas.find(i => i.id === id);
          if (!idea) return '';
          return `
            <div class="saved-item-card">
              <div class="saved-item-header">
                <span class="saved-item-title">${idea.title}</span>
                <button type="button" class="btn-remove-saved" onclick="DateApp.toggleFavorite(${idea.id})" title="remove from favorites">✕</button>
              </div>
              <p class="saved-item-desc">${idea.description}</p>
              <div class="saved-item-tags">
                <span>${idea.budgetText}</span>
                <span>•</span>
                <span>${idea.locationText}</span>
                <span>•</span>
                <span>${idea.durationText}</span>
              </div>
            </div>
          `;
        }).join('');
      }
    }

    if (doneList) {
      if (this.completed.length === 0) {
        doneList.innerHTML = '<p class="empty-list-note">no dates checked off yet! when we finish one, hit "we did this!" to track our memories.</p>';
      } else {
        doneList.innerHTML = this.completed.map(id => {
          const idea = this.ideas.find(i => i.id === id);
          if (!idea) return '';
          return `
            <div class="saved-item-card completed-card">
              <div class="saved-item-header">
                <span class="saved-item-title">✓ ${idea.title}</span>
                <button type="button" class="btn-remove-saved" onclick="DateApp.toggleCompleted(${idea.id})" title="unmark completed">✕</button>
              </div>
              <p class="saved-item-desc">${idea.description}</p>
              <div class="saved-item-tags">
                <span>${idea.budgetText}</span>
                <span>•</span>
                <span>${idea.locationText}</span>
              </div>
            </div>
          `;
        }).join('');
      }
    }
  },

  bindEvents() {
    // Pick button
    const pickBtn = document.getElementById('btn-pick-idea');
    if (pickBtn) {
      pickBtn.addEventListener('click', () => this.pickRandomIdea());
    }

    // Another one button
    const anotherBtn = document.getElementById('btn-another-idea');
    if (anotherBtn) {
      anotherBtn.addEventListener('click', () => this.pickRandomIdea());
    }

    // Reset filters button
    const resetBtn = document.getElementById('btn-reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => this.resetFilters());
    }

    // Favorite toggle button on current idea
    const favBtn = document.getElementById('btn-toggle-favorite');
    if (favBtn) {
      favBtn.addEventListener('click', () => {
        if (this.currentIdea) this.toggleFavorite(this.currentIdea.id);
      });
    }

    // Completed toggle button on current idea
    const doneBtn = document.getElementById('btn-toggle-completed');
    if (doneBtn) {
      doneBtn.addEventListener('click', () => {
        if (this.currentIdea) this.toggleCompleted(this.currentIdea.id);
      });
    }

    // Filter changes can pick fresh or keep ready
    document.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', () => {
        // Automatically update result if currently visible
        const resultBox = document.getElementById('date-result-card');
        if (resultBox && !resultBox.classList.contains('hidden')) {
          this.pickRandomIdea();
        }
      });
    });

    // Tab buttons for generator vs favorites vs completed
    const tabBtns = document.querySelectorAll('.sub-tab-btn');
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const targetId = btn.getAttribute('data-target');
        document.querySelectorAll('.tab-view-section').forEach(sec => {
          sec.classList.add('hidden');
        });
        const targetSec = document.getElementById(targetId);
        if (targetSec) targetSec.classList.remove('hidden');
      });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  DateApp.init();
});
