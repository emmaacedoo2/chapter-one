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
    duration: "medium",
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
    duration: "medium",
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
    duration: "medium",
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
    title: "Late Night Walk & Song Queue",
    budget: "free",
    budgetText: "free (just gas)",
    location: "out",
    locationText: "going out",
    category: "romantic",
    categoryText: "romantic",
    duration: "medium",
    durationText: "1 hour",
    description: "take a walk and take turns queueing songs that remind us of each other or favorite throwbacks."
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
    duration: "medium",
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
    description: "set up blankets and cushions on the floor, share snacks already in the pantry, turn off all the lights, and tell ghost stories."
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
    duration: "medium",
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
    duration: "medium",
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
    duration: "medium",
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
    duration: "medium",
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
    duration: "medium",
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
    duration: "medium",
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
    duration: "medium",
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


// New ideas keep stable IDs so favorites and completed dates remain intact.
const EXTRA_DATE_ROWS = [
  [
    "food",
    "home",
    "free",
    "short",
    "Pantry Tapas",
    "Turn leftovers into three tiny plates, name each one, and share your favorite bite."
  ],
  [
    "food",
    "home",
    "free",
    "short",
    "Tea Flight",
    "Brew teas already in the cupboard, compare their flavors, and pick a shared winner."
  ],
  [
    "food",
    "home",
    "cheap",
    "medium",
    "Dumpling Workshop",
    "Fold dumplings together, try different shapes, and toast the funniest one."
  ],
  [
    "food",
    "home",
    "cheap",
    "medium",
    "Breakfast for Dinner",
    "Make pancakes and eggs for dinner, set the table, and invent a breakfast toast."
  ],
  [
    "food",
    "home",
    "cheap",
    "medium",
    "Five-Ingredient Feast",
    "Choose five affordable ingredients, cook a meal together, and rate your invention."
  ],
  [
    "food",
    "home",
    "cheap",
    "short",
    "Blind Snack Lab",
    "Blindfold each other for a snack tasting, guess the flavors, and crown a surprise favorite."
  ],
  [
    "food",
    "home",
    "cheap",
    "medium",
    "Homemade Ice Cream",
    "Make ice cream in a bag, choose toppings, and share the first spoonful."
  ],
  [
    "food",
    "home",
    "cheap",
    "medium",
    "Mystery Ingredient",
    "Each choose an inexpensive secret ingredient, cook with both, and name the finished dish."
  ],
  [
    "food",
    "home",
    "cheap",
    "short",
    "Fancy Toast Bar",
    "Set out bread and toppings, make each other a surprise toast, and compare creations."
  ],
  [
    "food",
    "home",
    "cheap",
    "medium",
    "Pasta From Scratch",
    "Mix and roll simple pasta dough, cook it together, and serve it by candlelight."
  ],
  [
    "food",
    "home",
    "cheap",
    "medium",
    "Sushi Rolling",
    "Prepare veggie sushi rolls, practice rolling, and award a prize for the wonkiest."
  ],
  [
    "food",
    "home",
    "cheap",
    "short",
    "Cookie Decorating",
    "Decorate a batch of cookies with silly faces, exchange your favorites, and taste test."
  ],
  [
    "food",
    "home",
    "medium",
    "medium",
    "Fondue Evening",
    "Make a cheese fondue, prepare dippers, and feed each other a favorite combination."
  ],
  [
    "food",
    "home",
    "medium",
    "medium",
    "Taco Flight",
    "Make several taco fillings, assemble mini tacos, and vote for the best combination."
  ],
  [
    "food",
    "out",
    "cheap",
    "short",
    "Dessert Detour",
    "Visit a new dessert counter, share one treat, and rate it together."
  ],
  [
    "food",
    "out",
    "cheap",
    "medium",
    "Farmers Market",
    "Browse a farmers market, choose a seasonal snack within budget, and share it outside."
  ],
  [
    "food",
    "out",
    "cheap",
    "medium",
    "Bakery Crawl",
    "Visit two bakeries, split a small treat at each, and choose a winner."
  ],
  [
    "food",
    "out",
    "medium",
    "medium",
    "Dim Sum Brunch",
    "Visit a dim sum restaurant, share a few dishes within budget, and pick a favorite bite."
  ],
  [
    "food",
    "out",
    "medium",
    "medium",
    "Food Truck Picnic",
    "Find a food truck, share a meal at a nearby table, and pick a song for the walk back."
  ],
  [
    "food",
    "out",
    "expensive",
    "medium",
    "Tasting Menu",
    "Book a tasting menu within your budget, savor each course, and pick your favorite together."
  ],
  [
    "movies",
    "home",
    "free",
    "short",
    "Trailer Jury",
    "Watch trailers for free releases online, score them dramatically, and choose a future movie."
  ],
  [
    "movies",
    "home",
    "free",
    "medium",
    "Silent Film Night",
    "Find a public-domain silent film, invent dialogue together, and take a curtain call."
  ],
  [
    "movies",
    "home",
    "free",
    "medium",
    "Documentary Club",
    "Watch a free documentary, discuss one surprising fact, and choose your next topic."
  ],
  [
    "movies",
    "home",
    "free",
    "short",
    "Pilot Roulette",
    "Pick a free-to-watch pilot neither knows, watch it, and vote on a second episode."
  ],
  [
    "movies",
    "home",
    "free",
    "short",
    "Movie Scene Dub",
    "Mute a familiar scene you already own, improvise dialogue, and replay your best performance."
  ],
  [
    "movies",
    "home",
    "cheap",
    "medium",
    "Themed Cinema",
    "Choose a movie you can access, make a matching snack, and introduce it like cinema hosts."
  ],
  [
    "movies",
    "home",
    "cheap",
    "medium",
    "Animation Double Feature",
    "Watch two short animated films you can access, share popcorn, and compare art styles."
  ],
  [
    "movies",
    "out",
    "cheap",
    "medium",
    "Matinee Date",
    "Find a discounted matinee, share a small snack, and review the film on your walk."
  ],
  [
    "movies",
    "out",
    "medium",
    "medium",
    "Outdoor Screening",
    "Find an outdoor film screening, bring a blanket, and hold hands under the screen."
  ],
  [
    "movies",
    "out",
    "expensive",
    "long",
    "Film Festival Day",
    "Choose a local festival pass, see a couple of screenings, and compare your favorites over dinner."
  ],
  [
    "active",
    "home",
    "free",
    "short",
    "Sock Skating",
    "Clear a safe floor, slide in socks to music, and invent a two-person routine."
  ],
  [
    "active",
    "home",
    "free",
    "short",
    "Living Room Yoga",
    "Follow a free beginner yoga video, stretch together, and finish with a calming breath."
  ],
  [
    "active",
    "home",
    "free",
    "short",
    "Fitness Dice",
    "Assign simple movements to dice rolls, take turns rolling, and celebrate finishing together."
  ],
  [
    "active",
    "home",
    "free",
    "medium",
    "Dance Class at Home",
    "Follow a free beginner dance lesson, practice the steps, and perform your routine together."
  ],
  [
    "active",
    "home",
    "cheap",
    "medium",
    "Table Tennis Improvised",
    "Use a small ball and makeshift paddles on a clear table, play a friendly match, and shake hands."
  ],
  [
    "active",
    "out",
    "free",
    "short",
    "Sunrise Stroll",
    "Meet the morning on a nearby walk, watch the light change, and share a quiet hug."
  ],
  [
    "active",
    "out",
    "free",
    "medium",
    "Park Frisbee",
    "Take a frisbee you already own to a park, invent trick throws, and cheer each other on."
  ],
  [
    "active",
    "out",
    "free",
    "medium",
    "Beach Volleyball",
    "Bring a ball to a public beach court, practice serves, and celebrate a good rally."
  ],
  [
    "active",
    "out",
    "free",
    "medium",
    "Neighborhood Run",
    "Choose a comfortable route, jog at a shared pace, and cool down with a walk."
  ],
  [
    "active",
    "out",
    "free",
    "medium",
    "Hilltop Hike",
    "Choose a nearby free trail, walk to a viewpoint, and enjoy the view side by side."
  ],
  [
    "active",
    "out",
    "free",
    "short",
    "Playground Challenge",
    "Visit an empty public playground, try the swings, and challenge each other to a gentle race."
  ],
  [
    "active",
    "out",
    "cheap",
    "medium",
    "Mini Golf",
    "Play a round of mini golf, invent a silly victory dance, and congratulate the winner."
  ],
  [
    "active",
    "out",
    "cheap",
    "medium",
    "Public Swim",
    "Visit a public pool, swim a few relaxed laps, and race to the shallow end."
  ],
  [
    "active",
    "out",
    "medium",
    "medium",
    "Bowling Rivalry",
    "Book a lane, play a friendly game, and invent ridiculous bowling nicknames."
  ],
  [
    "active",
    "out",
    "medium",
    "medium",
    "Climbing Wall",
    "Try a beginner climbing session, encourage each other, and celebrate reaching a new hold."
  ],
  [
    "active",
    "out",
    "medium",
    "medium",
    "Roller Rink",
    "Rent skates at a rink, practice together, and dedicate one song to each other."
  ],
  [
    "active",
    "out",
    "medium",
    "medium",
    "Kayak Tandem",
    "Rent a tandem kayak on calm water, paddle a short route, and enjoy a shore-side break."
  ],
  [
    "active",
    "out",
    "expensive",
    "medium",
    "Horseback Trail",
    "Book a beginner-friendly guided ride, enjoy the scenery, and share your favorite moment afterward."
  ],
  [
    "active",
    "out",
    "expensive",
    "long",
    "Ski Day",
    "Rent equipment at a beginner-friendly slope, take a lesson, and warm up together afterward."
  ],
  [
    "active",
    "out",
    "expensive",
    "long",
    "Adventure Course",
    "Book a ropes course, encourage each other through obstacles, and celebrate with a high five."
  ],
  [
    "romantic",
    "home",
    "free",
    "short",
    "Playlist Exchange",
    "Make each other a playlist from songs you can access, listen together, and explain one choice."
  ],
  [
    "romantic",
    "home",
    "free",
    "short",
    "Love Notes Swap",
    "Write each other a short note, exchange them, and read them over a quiet drink."
  ],
  [
    "romantic",
    "home",
    "free",
    "short",
    "Window Stargazing",
    "Turn off the lights, watch the sky from a window, and make up a constellation together."
  ],
  [
    "romantic",
    "home",
    "free",
    "medium",
    "No-Phone Evening",
    "Put phones away, share a meal you already have, and ask each other three thoughtful questions."
  ],
  [
    "romantic",
    "home",
    "free",
    "medium",
    "Dream Map",
    "Sketch places and experiences you hope to try, compare maps, and choose one small dream."
  ],
  [
    "romantic",
    "home",
    "free",
    "short",
    "Compliment Cards",
    "Write three specific compliments each, shuffle them, and read them aloud together."
  ],
  [
    "romantic",
    "home",
    "cheap",
    "medium",
    "Candlelit Dinner",
    "Cook a simple affordable dinner, set the table with candles, and make a toast to today."
  ],
  [
    "romantic",
    "home",
    "cheap",
    "medium",
    "Indoor Picnic",
    "Lay out a blanket, share simple groceries, and tell each other a favorite thing about today."
  ],
  [
    "romantic",
    "home",
    "medium",
    "medium",
    "At-Home Coffeehouse",
    "Make specialty drinks and a simple snack at home, play café music, and write each other a note."
  ],
  [
    "romantic",
    "out",
    "free",
    "short",
    "Sunset Bench",
    "Find a public bench with a view, watch the sunset, and share a quiet moment."
  ],
  [
    "romantic",
    "out",
    "free",
    "medium",
    "Meteor Shower Watch",
    "Check a meteor-shower forecast, find a safe public viewing spot, and count shooting stars together."
  ],
  [
    "romantic",
    "out",
    "free",
    "medium",
    "Moonlit Walk",
    "Choose a well-lit familiar route, walk slowly, and share a wish for the future."
  ],
  [
    "romantic",
    "out",
    "free",
    "short",
    "Beach Sunrise",
    "Watch the sunrise from a public beach, listen to the waves, and share a hug."
  ],
  [
    "romantic",
    "out",
    "cheap",
    "medium",
    "Sunset Beach Picnic",
    "Pack simple snacks and a blanket, watch the sunset at the beach, and leave a sweet note."
  ],
  [
    "romantic",
    "out",
    "cheap",
    "medium",
    "Flower Market Stroll",
    "Browse a flower market, choose one inexpensive stem, and give it to each other."
  ],
  [
    "romantic",
    "out",
    "medium",
    "medium",
    "Rooftop Toast",
    "Visit an accessible rooftop café, share a drink, and toast the view together."
  ],
  [
    "romantic",
    "out",
    "expensive",
    "medium",
    "Dinner Cruise",
    "Reserve a dinner cruise, watch the shoreline from the water, and exchange a little toast."
  ],
  [
    "romantic",
    "out",
    "expensive",
    "long",
    "Anniversary Getaway",
    "Book a nearby overnight stay, explore on foot, and write each other a note for the morning."
  ],
  [
    "romantic",
    "out",
    "expensive",
    "medium",
    "Concert Evening",
    "Choose a concert you both want to see, dress up, and dedicate a song to each other."
  ],
  [
    "romantic",
    "out",
    "free",
    "short",
    "Handwritten Postcards",
    "Write notes on paper you already have, exchange them in a park, and read them together."
  ],
  [
    "funny",
    "home",
    "free",
    "short",
    "Bad Drawing Duel",
    "Draw each other without looking at the page, reveal the portraits, and sign your masterpieces."
  ],
  [
    "funny",
    "home",
    "free",
    "short",
    "Accent Newsroom",
    "Take turns reading harmless headlines in invented voices, then award the best anchor."
  ],
  [
    "funny",
    "home",
    "free",
    "short",
    "Mystery Object Ads",
    "Grab household objects, pitch each one as a luxury invention, and choose the best commercial."
  ],
  [
    "funny",
    "home",
    "free",
    "medium",
    "Kitchen Talent Show",
    "Perform ridiculous two-minute talents, score each act, and present an imaginary trophy."
  ],
  [
    "funny",
    "home",
    "free",
    "short",
    "Emoji Story Battle",
    "Send each other an emoji-only story, guess the plot, and reveal the real version."
  ],
  [
    "funny",
    "home",
    "free",
    "medium",
    "Reverse Charades",
    "Act out clues together while one guesses, swap roles, and celebrate the funniest answer."
  ],
  [
    "funny",
    "home",
    "free",
    "short",
    "Dramatic Readings",
    "Read an ordinary instruction manual like a dramatic monologue, then applaud each other."
  ],
  [
    "funny",
    "home",
    "cheap",
    "medium",
    "Dollar Store Sculpture",
    "Use inexpensive craft supplies to build odd sculptures, name them, and host a tiny gallery."
  ],
  [
    "funny",
    "out",
    "free",
    "short",
    "Tour Guide Challenge",
    "Give each other ridiculous fictional tours of a familiar public street, then rate your guides."
  ],
  [
    "funny",
    "out",
    "free",
    "medium",
    "Public Statue Poses",
    "Find public statues, copy their poses for photos, and choose the funniest match."
  ],
  [
    "funny",
    "out",
    "cheap",
    "medium",
    "Secondhand Book Hunt",
    "Find the strangest book cover in a secondhand shop, read its blurb aloud, and choose a favorite."
  ],
  [
    "funny",
    "out",
    "cheap",
    "short",
    "Blind Menu Point",
    "At an affordable café, point to a budget-friendly item without looking and share the result."
  ],
  [
    "funny",
    "out",
    "medium",
    "medium",
    "Karaoke Booth",
    "Book a private karaoke room, perform a duet, and give each other an imaginary award."
  ],
  [
    "funny",
    "out",
    "medium",
    "medium",
    "Arcade Tournament",
    "Set an arcade budget, challenge each other to three games, and celebrate the silliest win."
  ],
  [
    "funny",
    "out",
    "expensive",
    "medium",
    "Improv Show",
    "Buy tickets to an improv show, laugh together, and invent a scene on the way home."
  ],
  [
    "creative",
    "home",
    "free",
    "short",
    "Paper Airplane Lab",
    "Fold planes from scrap paper, test their flights, and decorate the champion together."
  ],
  [
    "creative",
    "home",
    "free",
    "medium",
    "Found Poetry",
    "Cut words from old paper you already have, arrange a poem, and read it to each other."
  ],
  [
    "creative",
    "home",
    "free",
    "medium",
    "Photo Story",
    "Use your phones to stage a five-photo story at home, add captions, and share the ending."
  ],
  [
    "creative",
    "home",
    "free",
    "short",
    "Origami Notes",
    "Fold scrap paper into simple hearts, write notes inside, and exchange them."
  ],
  [
    "creative",
    "home",
    "free",
    "medium",
    "Story Chain",
    "Take turns writing a paragraph of a story, read it aloud, and give it a ridiculous title."
  ],
  [
    "creative",
    "home",
    "free",
    "short",
    "Portrait Sketches",
    "Use paper and pencils you have to sketch each other, swap portraits, and sign them."
  ],
  [
    "creative",
    "home",
    "cheap",
    "medium",
    "Watercolor Postcards",
    "Paint imagined landscapes on small cards, write a message on each, and exchange them."
  ],
  [
    "creative",
    "home",
    "cheap",
    "medium",
    "Collage Night",
    "Collect old magazines and inexpensive glue, make collages, and explain your favorite detail."
  ],
  [
    "creative",
    "home",
    "cheap",
    "medium",
    "Beaded Keychains",
    "Use inexpensive beads and cord to make each other a keychain, then exchange your designs."
  ],
  [
    "creative",
    "home",
    "cheap",
    "medium",
    "Tie-Dye Together",
    "Use a small dye kit on old shirts, make patterns, and reveal the results after drying."
  ],
  [
    "creative",
    "home",
    "cheap",
    "medium",
    "Custom Puzzle",
    "Draw a picture on cardboard, cut it into pieces, and solve each other's puzzles."
  ],
  [
    "creative",
    "home",
    "medium",
    "medium",
    "Candle Making",
    "Use a candle-making kit, choose scents, and name your finished candles together."
  ],
  [
    "creative",
    "out",
    "free",
    "medium",
    "Architecture Sketchwalk",
    "Walk through a neighborhood, sketch interesting buildings, and exchange your drawings."
  ],
  [
    "creative",
    "out",
    "free",
    "medium",
    "Nature Photography",
    "Walk a public trail, photograph colors and textures, and share your favorite shot."
  ],
  [
    "creative",
    "out",
    "cheap",
    "medium",
    "Museum Sketch Date",
    "Visit a low-cost museum, sketch a favorite exhibit where permitted, and compare notes."
  ],
  [
    "creative",
    "out",
    "medium",
    "medium",
    "Pottery Painting",
    "Choose small pieces at a pottery studio, paint them, and reveal your designs together."
  ],
  [
    "creative",
    "out",
    "expensive",
    "medium",
    "Glassblowing Class",
    "Book a beginner glassblowing workshop, make small pieces, and celebrate learning together."
  ],
  [
    "creative",
    "out",
    "expensive",
    "long",
    "Art Workshop Day",
    "Book a day-long art workshop, learn a new technique, and share your creations afterward."
  ],
  [
    "outdoors",
    "out",
    "free",
    "short",
    "Cloud Watching",
    "Find a public patch of grass, spot shapes in the clouds, and make up a shared story."
  ],
  [
    "outdoors",
    "out",
    "free",
    "medium",
    "Tide Pool Explorer",
    "Check safe low-tide conditions, observe tide pools without touching wildlife, and share discoveries."
  ],
  [
    "outdoors",
    "out",
    "free",
    "medium",
    "Neighborhood Explorer",
    "Pick a neighborhood new to you, wander public streets, and choose a favorite building."
  ],
  [
    "outdoors",
    "out",
    "free",
    "medium",
    "Birdwatching Walk",
    "Visit a public park, look for birds, and compare your sightings without disturbing them."
  ],
  [
    "outdoors",
    "out",
    "free",
    "medium",
    "Garden Wander",
    "Explore a free public garden, find an interesting plant, and take a photo together."
  ],
  [
    "outdoors",
    "out",
    "free",
    "medium",
    "Beachcombing",
    "Walk a public beach, look for interesting shells without disturbing wildlife, and compare finds."
  ],
  [
    "outdoors",
    "out",
    "free",
    "medium",
    "Leaf Color Hunt",
    "Walk among fall leaves, photograph your favorite colors, and pick a winning view."
  ],
  [
    "outdoors",
    "out",
    "free",
    "short",
    "Snow Sculptures",
    "After snowfall, build tiny snow sculptures outside and give each one a silly name."
  ],
  [
    "outdoors",
    "out",
    "free",
    "medium",
    "Spring Blossom Walk",
    "Find a public path with spring blooms, enjoy the colors, and take a photo together."
  ],
  [
    "outdoors",
    "out",
    "free",
    "medium",
    "Waterfront Wander",
    "Follow a public waterfront path, pause at a viewpoint, and share a quiet conversation."
  ],
  [
    "outdoors",
    "out",
    "free",
    "long",
    "Trail and Picnic Day",
    "Pack food you already have, hike a free local trail, and rest together at a scenic stop."
  ],
  [
    "outdoors",
    "out",
    "cheap",
    "medium",
    "Kite Afternoon",
    "Bring an inexpensive kite to an open park, take turns flying it, and cheer for every launch."
  ],
  [
    "outdoors",
    "out",
    "cheap",
    "medium",
    "Pumpkin Patch",
    "Visit a local pumpkin patch, choose one small pumpkin, and plan a funny face for it."
  ],
  [
    "outdoors",
    "out",
    "cheap",
    "medium",
    "Holiday Lights Walk",
    "Walk through a decorated public neighborhood, bring a warm drink from home, and pick a favorite display."
  ],
  [
    "outdoors",
    "out",
    "medium",
    "medium",
    "Botanical Garden",
    "Visit a ticketed botanical garden, explore a new section, and choose a favorite flower."
  ],
  [
    "outdoors",
    "out",
    "medium",
    "long",
    "Orchard Picking",
    "Visit a pick-your-own orchard, gather fruit within budget, and share a fresh piece together."
  ],
  [
    "outdoors",
    "out",
    "expensive",
    "long",
    "National Park Day",
    "Plan a day trip to a park with entry fees, explore a suitable trail, and picnic at a viewpoint."
  ],
  [
    "outdoors",
    "out",
    "expensive",
    "long",
    "Sailing Excursion",
    "Book a guided sailing trip, enjoy the shoreline, and toast the adventure afterward."
  ],
  [
    "creative",
    "home",
    "free",
    "medium",
    "Remote Drawing Relay",
    "On a video call, take turns adding to a shared digital drawing, then reveal the finished artwork."
  ],
  [
    "romantic",
    "home",
    "free",
    "short",
    "Remote Tea Date",
    "Brew drinks in your own homes, meet on video, and share one good thing from your day."
  ],
  [
    "movies",
    "home",
    "free",
    "medium",
    "Remote Movie Night",
    "Start the same free film at the same time, chat on a call, and compare favorite scenes."
  ],
  [
    "funny",
    "home",
    "free",
    "short",
    "Remote Show and Tell",
    "On a video call, present a strange household object, invent its backstory, and vote for the best tale."
  ],
  [
    "food",
    "home",
    "cheap",
    "medium",
    "Remote Cook-Along",
    "Choose the same inexpensive recipe, cook in your own kitchens on video, and eat together on the call."
  ],
  [
    "active",
    "home",
    "free",
    "short",
    "Remote Stretch Break",
    "Join a video call, follow the same gentle stretch routine, and cheer each other through it."
  ],
  [
    "romantic",
    "home",
    "free",
    "medium",
    "Remote Future Trip",
    "On a call, explore a destination online, save free attractions, and make a dream itinerary together."
  ],
  [
    "funny",
    "home",
    "free",
    "medium",
    "Remote Trivia",
    "Take turns hosting a free online trivia round over video, keep score, and award a virtual crown."
  ],
  [
    "creative",
    "home",
    "free",
    "short",
    "Remote Playlist Swap",
    "Share playlists online, listen to a song together on a call, and explain your choices."
  ],
  [
    "romantic",
    "home",
    "free",
    "short",
    "Remote Stargazing",
    "Step outside safely in your own locations, call each other, and describe the sky you see."
  ],
["food", "home", "cheap", "medium", "Soup and Bread", "Make a simple soup and bread together, set the table, and share a warm bowl."],
["food", "out", "cheap", "short", "Bubble Tea Stop", "Visit a bubble tea shop, choose different flavors, and share a taste."],
["food", "out", "medium", "medium", "Brunch Adventure", "Choose a new brunch spot, share a dish, and linger over conversation."],
["movies", "home", "free", "medium", "Director Spotlight", "Watch a free film by a director new to you, discuss its style, and pick a favorite scene."],
["active", "out", "free", "short", "Seaside Sprint", "Walk a safe stretch of beach, race between two landmarks, and cool down together."],
["active", "out", "cheap", "medium", "Disc Golf", "Borrow or bring discs to a free course, play a round, and cheer each other's best throw."],
["romantic", "home", "free", "medium", "Slow Dance Night", "Choose music you already have, clear a little floor space, and slow dance together."],
["romantic", "out", "free", "medium", "Golden Hour Photos", "Take turns photographing each other in a public park at golden hour, then pick a favorite."],
["funny", "home", "free", "short", "Impressions Contest", "Imitate fictional characters, guess each impression, and present a pretend award."],
["funny", "out", "free", "short", "Alphabet Walk", "Find objects beginning with different letters on a walk, compare lists, and celebrate the oddest find."],
["creative", "home", "cheap", "medium", "Postcard Painting", "Paint small postcards with inexpensive supplies, write a message on each, and swap them."],
["creative", "out", "cheap", "medium", "Street Art Hunt", "Walk through an area known for public murals, photograph favorites, and discuss the colors."],
["outdoors", "out", "free", "medium", "Creekside Walk", "Follow a safe public creekside path, listen to the water, and share a peaceful pause."],
["outdoors", "out", "cheap", "medium", "Beach Sandcastles", "Bring a small bucket to a public beach, build a sandcastle together, and name your kingdom."],
["outdoors", "out", "medium", "long", "Ferry Exploration", "Take a local ferry to a new area, explore on foot, and enjoy the return view together."],
["romantic", "home", "cheap", "medium", "Chocolate Tasting", "Buy a few small chocolates, taste them slowly, and feed each other your favorite."],
["creative", "home", "free", "short", "Paper Garland", "Fold and cut scrap paper into hearts, string them together, and hang your shared creation."],
["funny", "home", "cheap", "medium", "Gingerbread Architects", "Build a small gingerbread house from a kit, decorate it wildly, and admire the construction."],
["food", "home", "cheap", "medium", "Valentine Cookies", "Bake simple heart-shaped cookies, decorate them together, and exchange the first two."]
];
const CATEGORY_LABELS = { food: 'food', movies: 'movies & shows', active: 'something active', romantic: 'romantic', funny: 'something funny', creative: 'creative', outdoors: 'outdoors' };
const EXTRA_DATE_IDEAS = EXTRA_DATE_ROWS.map(([category, location, budget, duration, title, description], index) => ({
  id: 1001 + index, title, description, category, location, budget, duration,
  categoryText: CATEGORY_LABELS[category], locationText: location === 'home' ? 'at home' : 'going out',
  budgetText: { free: 'free', cheap: 'cheap ($1–20)', medium: 'medium ($20–60)', expensive: 'expensive ($60+)' }[budget],
  durationText: { short: 'under 1 hour', medium: '1–3 hours', long: 'all day' }[duration]
}));
DATE_IDEAS.push(...EXTRA_DATE_IDEAS);

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

  pickRandomIdea(surprise = false) {
    const matching = surprise ? this.ideas : this.filterIdeas();
    const resultBox = document.getElementById('date-result-card');
    const emptyBox = document.getElementById('date-empty-state');

    if (matching.length === 0) {
      this.currentIdea = null;
      if (resultBox) resultBox.classList.add('hidden');
      if (emptyBox) emptyBox.classList.remove('hidden');
      return;
    }

    if (emptyBox) emptyBox.classList.add('hidden');

    let history = [];
    try { history = JSON.parse(localStorage.getItem('date_generator_recent')) || []; } catch (e) { /* Storage can be unavailable. */ }
    if (!Array.isArray(history)) history = [];
    let candidates = matching.filter(i => !history.includes(i.id));
    if (!candidates.length) candidates = matching.filter(i => i.id !== (this.previousIdeaId || history[0]));
    if (!candidates.length) candidates = matching;
    const selected = candidates[Math.floor(Math.random() * candidates.length)];
    this.currentIdea = selected;
    this.previousIdeaId = selected.id;
    history = [selected.id, ...history.filter(id => id !== selected.id)].slice(0, 40);
    try { localStorage.setItem('date_generator_recent', JSON.stringify(history)); } catch (e) { /* Still works without storage. */ }
    document.getElementById('idea-surprise').classList.toggle('hidden', !surprise);

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

    document.getElementById('btn-surprise').addEventListener('click', () => this.pickRandomIdea(true));

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
