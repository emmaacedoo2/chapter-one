(() => {
  const originalMovies = [
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
  const extraMovies = [
  [
    "Iron Man",
    2008,
    "Action",
    "Marvel",
    "A billionaire inventor builds an extraordinary suit."
  ],
  [
    "The Incredible Hulk",
    2008,
    "Action",
    "Marvel",
    "A scientist searches for a cure to his dangerous transformation."
  ],
  [
    "Iron Man 2",
    2010,
    "Action",
    "Marvel",
    "Tony Stark faces new rivals and pressure over his technology."
  ],
  [
    "Thor",
    2011,
    "Fantasy",
    "Marvel",
    "A banished Asgardian prince discovers life on Earth."
  ],
  [
    "Captain America: The First Avenger",
    2011,
    "Action",
    "Marvel",
    "A determined recruit becomes a wartime superhero."
  ],
  [
    "The Avengers",
    2012,
    "Action",
    "Marvel",
    "Earth’s heroes join forces against an invading threat."
  ],
  [
    "Iron Man 3",
    2013,
    "Action",
    "Marvel",
    "Tony Stark confronts a dangerous new enemy."
  ],
  [
    "Thor: The Dark World",
    2013,
    "Fantasy",
    "Marvel",
    "Thor faces a threat that reaches across the realms."
  ],
  [
    "Captain America: The Winter Soldier",
    2014,
    "Action",
    "Marvel",
    "Steve Rogers uncovers danger within an intelligence agency."
  ],
  [
    "Guardians of the Galaxy",
    2014,
    "Science Fiction",
    "Marvel",
    "A group of unlikely allies come together in space."
  ],
  [
    "Avengers: Age of Ultron",
    2015,
    "Action",
    "Marvel",
    "The Avengers face a powerful artificial intelligence."
  ],
  [
    "Ant-Man",
    2015,
    "Action",
    "Marvel",
    "A thief gains a suit that lets him shrink."
  ],
  [
    "Captain America: Civil War",
    2016,
    "Action",
    "Marvel",
    "A dispute divides the Avengers."
  ],
  [
    "Doctor Strange",
    2016,
    "Fantasy",
    "Marvel",
    "A surgeon discovers the world of mystical arts."
  ],
  [
    "Guardians of the Galaxy Vol. 2",
    2017,
    "Science Fiction",
    "Marvel",
    "The Guardians explore the mystery of Peter Quill’s past."
  ],
  [
    "Spider-Man: Homecoming",
    2017,
    "Action",
    "Marvel",
    "Peter Parker balances school with being a superhero."
  ],
  [
    "Thor: Ragnarok",
    2017,
    "Fantasy",
    "Marvel",
    "Thor must find his way home to protect Asgard."
  ],
  [
    "Black Panther",
    2018,
    "Action",
    "Marvel",
    "T’Challa returns home to lead Wakanda."
  ],
  [
    "Avengers: Infinity War",
    2018,
    "Action",
    "Marvel",
    "Heroes unite against a threat to the universe."
  ],
  [
    "Ant-Man and the Wasp",
    2018,
    "Action",
    "Marvel",
    "Scott Lang joins the Wasp on a new mission."
  ],
  [
    "Captain Marvel",
    2019,
    "Science Fiction",
    "Marvel",
    "A pilot discovers her connection to an interstellar conflict."
  ],
  [
    "Avengers: Endgame",
    2019,
    "Action",
    "Marvel",
    "The Avengers reunite to confront an immense challenge."
  ],
  [
    "Spider-Man: Far From Home",
    2019,
    "Action",
    "Marvel",
    "Peter Parker’s European trip takes an unexpected turn."
  ],
  [
    "Black Widow",
    2021,
    "Action",
    "Marvel",
    "Natasha Romanoff faces figures from her past."
  ],
  [
    "Shang-Chi and the Legend of the Ten Rings",
    2021,
    "Action",
    "Marvel",
    "A young man confronts his family’s extraordinary legacy."
  ],
  [
    "Eternals",
    2021,
    "Science Fiction",
    "Marvel",
    "Ancient heroes reunite to protect humanity."
  ],
  [
    "Spider-Man: No Way Home",
    2021,
    "Action",
    "Marvel",
    "Peter Parker seeks help when his identity becomes public."
  ],
  [
    "Doctor Strange in the Multiverse of Madness",
    2022,
    "Fantasy",
    "Marvel",
    "Doctor Strange travels across strange realities."
  ],
  [
    "Thor: Love and Thunder",
    2022,
    "Fantasy",
    "Marvel",
    "Thor joins old friends against a formidable threat."
  ],
  [
    "Black Panther: Wakanda Forever",
    2022,
    "Action",
    "Marvel",
    "Wakanda faces a new challenge while honoring its king."
  ],
  [
    "Guardians of the Galaxy Vol. 3",
    2023,
    "Science Fiction",
    "Marvel",
    "The Guardians embark on a deeply personal mission."
  ],
  [
    "The Marvels",
    2023,
    "Science Fiction",
    "Marvel",
    "Three heroes find their powers mysteriously connected."
  ],
  [
    "Deadpool & Wolverine",
    2024,
    "Action",
    "Marvel",
    "Two unlikely partners embark on a multiverse adventure."
  ],
  [
    "Spider-Man 2",
    2004,
    "Action",
    "Marvel",
    "Peter Parker struggles to balance his responsibilities."
  ],
  [
    "Spider-Man: Across the Spider-Verse",
    2023,
    "Animation",
    "Marvel",
    "Miles Morales encounters a vast community of Spider-People."
  ],
  [
    "Batman Begins",
    2005,
    "Action",
    "DC",
    "Bruce Wayne returns to Gotham to confront its corruption."
  ],
  [
    "The Dark Knight Rises",
    2012,
    "Action",
    "DC",
    "Batman returns when Gotham faces a new threat."
  ],
  [
    "The Batman",
    2022,
    "Mystery",
    "DC",
    "Batman investigates a series of crimes in Gotham."
  ],
  [
    "Batman",
    1989,
    "Action",
    "DC",
    "Gotham’s masked protector faces a flamboyant criminal."
  ],
  [
    "Superman",
    1978,
    "Adventure",
    "DC",
    "A hero from Krypton finds his place on Earth."
  ],
  [
    "Man of Steel",
    2013,
    "Action",
    "DC",
    "Clark Kent discovers his origins and his powers."
  ],
  [
    "Batman v Superman: Dawn of Justice",
    2016,
    "Action",
    "DC",
    "Two heroes find themselves on opposing sides."
  ],
  [
    "Wonder Woman",
    2017,
    "Action",
    "DC",
    "An Amazon warrior enters a world at war."
  ],
  [
    "Justice League",
    2017,
    "Action",
    "DC",
    "Heroes unite to defend Earth from an invasion."
  ],
  [
    "Aquaman",
    2018,
    "Adventure",
    "DC",
    "Arthur Curry journeys into the underwater kingdom of Atlantis."
  ],
  [
    "Shazam!",
    2019,
    "Comedy",
    "DC",
    "A teenager gains the ability to become an adult superhero."
  ],
  [
    "The Suicide Squad",
    2021,
    "Action",
    "DC",
    "A team of unlikely operatives takes on a dangerous mission."
  ],
  [
    "The Flash",
    2023,
    "Action",
    "DC",
    "Barry Allen experiments with the possibilities of time travel."
  ],
  [
    "Blue Beetle",
    2023,
    "Action",
    "DC",
    "A young man bonds with a powerful alien scarab."
  ],
  [
    "Wonder Woman 1984",
    2020,
    "Action",
    "DC",
    "Diana faces new challenges in the 1980s."
  ],
  [
    "The LEGO Batman Movie",
    2017,
    "Animation",
    "DC",
    "Batman learns about teamwork in a colorful Gotham adventure."
  ],
  [
    "Inception",
    2010,
    "Science Fiction",
    "",
    "A specialist enters dreams to carry out a risky assignment."
  ],
  [
    "Interstellar",
    2014,
    "Science Fiction",
    "",
    "Explorers travel beyond Earth in search of a future for humanity."
  ],
  [
    "The Matrix",
    1999,
    "Science Fiction",
    "",
    "A programmer discovers that his world may not be what it seems."
  ],
  [
    "Arrival",
    2016,
    "Science Fiction",
    "",
    "A linguist attempts to communicate with mysterious visitors."
  ],
  [
    "The Martian",
    2015,
    "Science Fiction",
    "",
    "An astronaut stranded on Mars tries to survive."
  ],
  [
    "Back to the Future",
    1985,
    "Science Fiction",
    "",
    "A teenager travels back in time in a modified car."
  ],
  [
    "E.T. the Extra-Terrestrial",
    1982,
    "Science Fiction",
    "",
    "A boy befriends a visitor from another planet."
  ],
  [
    "Star Wars",
    1977,
    "Science Fiction",
    "",
    "A young farmhand joins a rebellion in a distant galaxy."
  ],
  [
    "The Empire Strikes Back",
    1980,
    "Science Fiction",
    "",
    "The rebels face new dangers across the galaxy."
  ],
  [
    "Avatar",
    2009,
    "Science Fiction",
    "",
    "A visitor to Pandora becomes caught between two worlds."
  ],
  [
    "Dune",
    2021,
    "Science Fiction",
    "",
    "A young heir travels to a dangerous desert planet."
  ],
  [
    "Dune: Part Two",
    2024,
    "Science Fiction",
    "",
    "Paul Atreides joins the Fremen on Arrakis."
  ],
  [
    "The Lord of the Rings: The Fellowship of the Ring",
    2001,
    "Fantasy",
    "",
    "A fellowship begins a perilous journey across Middle-earth."
  ],
  [
    "The Lord of the Rings: The Two Towers",
    2002,
    "Fantasy",
    "",
    "The fellowship continues its journey through a divided land."
  ],
  [
    "The Lord of the Rings: The Return of the King",
    2003,
    "Fantasy",
    "",
    "The peoples of Middle-earth face a decisive struggle."
  ],
  [
    "Harry Potter and the Sorcerer's Stone",
    2001,
    "Fantasy",
    "",
    "A young boy discovers a magical school and a new home."
  ],
  [
    "Harry Potter and the Chamber of Secrets",
    2002,
    "Fantasy",
    "",
    "Harry returns to Hogwarts as a mystery unfolds."
  ],
  [
    "Pirates of the Caribbean: The Curse of the Black Pearl",
    2003,
    "Adventure",
    "",
    "A blacksmith joins a pirate to rescue a governor’s daughter."
  ],
  [
    "The Mummy",
    1999,
    "Adventure",
    "",
    "Adventurers discover an ancient Egyptian tomb."
  ],
  [
    "Jumanji: Welcome to the Jungle",
    2017,
    "Adventure",
    "",
    "Four teenagers are drawn into a dangerous video game."
  ],
  [
    "The Goonies",
    1985,
    "Adventure",
    "",
    "A group of friends follows a treasure map."
  ],
  [
    "The Hunger Games",
    2012,
    "Adventure",
    "",
    "A teenager volunteers for a televised survival contest."
  ],
  [
    "Gladiator",
    2000,
    "Historical / War",
    "",
    "A Roman general is forced into the arena."
  ],
  [
    "1917",
    2019,
    "Historical / War",
    "",
    "Two soldiers carry a vital message across a battlefield."
  ],
  [
    "Oppenheimer",
    2023,
    "Historical / War",
    "",
    "A physicist leads a secret wartime research project."
  ],
  [
    "Schindler's List",
    1993,
    "Historical / War",
    "",
    "A businessman tries to protect Jewish workers during the Holocaust."
  ],
  [
    "The Shawshank Redemption",
    1994,
    "Classics",
    "",
    "Two prisoners form a lasting friendship."
  ],
  [
    "Casablanca",
    1942,
    "Classics",
    "",
    "An American expatriate encounters a former love in wartime Morocco."
  ],
  [
    "The Godfather",
    1972,
    "Classics",
    "",
    "A powerful crime family navigates loyalty and succession."
  ],
  [
    "Forrest Gump",
    1994,
    "Classics",
    "",
    "A kindhearted man experiences decades of American history."
  ],
  [
    "The Truman Show",
    1998,
    "Comedy",
    "",
    "A man begins to question his carefully ordered world."
  ],
  [
    "The Grand Budapest Hotel",
    2014,
    "Comedy",
    "",
    "A hotel concierge and his protégé become entangled in an adventure."
  ],
  [
    "School of Rock",
    2003,
    "Comedy",
    "",
    "A substitute teacher inspires his class through rock music."
  ],
  [
    "Superbad",
    2007,
    "Comedy",
    "",
    "Two friends navigate a chaotic final stretch of high school."
  ],
  [
    "Mean Girls",
    2004,
    "Comedy",
    "",
    "A new student encounters the social rules of high school."
  ],
  [
    "Barbie",
    2023,
    "Comedy",
    "",
    "Barbie leaves her colorful home for an unexpected journey."
  ],
  [
    "Palm Springs",
    2020,
    "Romance",
    "",
    "Two wedding guests find themselves stuck in an unusual situation."
  ],
  [
    "About Time",
    2013,
    "Romance",
    "",
    "A young man discovers an extraordinary family ability."
  ],
  [
    "Pride & Prejudice",
    2005,
    "Romance",
    "",
    "Elizabeth Bennet meets the enigmatic Mr. Darcy."
  ],
  [
    "La La Land",
    2016,
    "Romance",
    "",
    "An aspiring actor and a jazz musician pursue their dreams in Los Angeles."
  ],
  [
    "Before Sunrise",
    1995,
    "Romance",
    "",
    "Two travelers spend an evening wandering Vienna together."
  ],
  [
    "Titanic",
    1997,
    "Romance",
    "",
    "Two passengers meet aboard a legendary ocean liner."
  ],
  [
    "The Conjuring",
    2013,
    "Horror",
    "",
    "Paranormal investigators visit a troubled family home."
  ],
  [
    "Halloween",
    1978,
    "Horror",
    "",
    "A masked figure stalks a quiet suburban town."
  ],
  [
    "Scream",
    1996,
    "Horror",
    "",
    "A masked caller terrorizes a group of teenagers."
  ],
  [
    "The Shining",
    1980,
    "Horror",
    "",
    "A family spends the winter caring for an isolated hotel."
  ],
  [
    "Nope",
    2022,
    "Horror",
    "",
    "Siblings investigate a mysterious presence above their ranch."
  ],
  [
    "Parasite",
    2019,
    "Thriller",
    "",
    "Two families become unexpectedly intertwined."
  ],
  [
    "Gone Girl",
    2014,
    "Thriller",
    "",
    "A woman’s disappearance draws intense attention to her marriage."
  ],
  [
    "Prisoners",
    2013,
    "Thriller",
    "",
    "A father and a detective search for missing children."
  ],
  [
    "Se7en",
    1995,
    "Mystery",
    "",
    "Two detectives investigate a series of disturbing crimes."
  ],
  [
    "Glass Onion: A Knives Out Mystery",
    2022,
    "Mystery",
    "",
    "A detective attends a gathering on a private island."
  ],
  [
    "Murder on the Orient Express",
    2017,
    "Mystery",
    "",
    "A detective investigates a crime aboard a luxury train."
  ],
  [
    "Toy Story",
    1995,
    "Animation",
    "",
    "A group of toys comes to life when people are away."
  ],
  [
    "Up",
    2009,
    "Animation",
    "",
    "An elderly man sets off on an extraordinary airborne journey."
  ],
  [
    "Inside Out",
    2015,
    "Animation",
    "",
    "A young girl’s emotions navigate a major life change."
  ],
  [
    "Finding Nemo",
    2003,
    "Animation",
    "",
    "A clownfish crosses the ocean to find his son."
  ],
  [
    "Ratatouille",
    2007,
    "Animation",
    "",
    "A rat with a gift for cooking dreams of becoming a chef."
  ],
  [
    "Shrek",
    2001,
    "Animation",
    "",
    "An ogre sets out on a fairy-tale rescue mission."
  ],
  [
    "The Nightmare Before Christmas",
    1993,
    "Christmas",
    "",
    "The Pumpkin King discovers a different kind of holiday."
  ],
  [
    "Love Actually",
    2003,
    "Christmas",
    "",
    "Several intertwined relationships unfold during the holiday season."
  ],
  [
    "Die Hard",
    1988,
    "Action",
    "",
    "A police officer faces a hostage crisis at a holiday party."
  ],
  [
    "It's a Wonderful Life",
    1946,
    "Christmas",
    "",
    "A man is shown the impact he has had on his community."
  ],
  [
    "John Wick",
    2014,
    "Action",
    "",
    "A retired assassin is drawn back into a dangerous world."
  ],
  [
    "Mission: Impossible – Fallout",
    2018,
    "Action",
    "",
    "Ethan Hunt and his team race to prevent a catastrophe."
  ],
  [
    "Mad Max: Fury Road",
    2015,
    "Action",
    "",
    "Fugitives cross a desert pursued by a ruthless warlord."
  ],
  [
    "The Incredibles",
    2004,
    "Animation",
    "",
    "A family of superheroes returns to action."
  ]
];
  const addedMovies = [
  [
    "Some Like It Hot",
    1959,
    "Comedy",
    "Two musicians disguise themselves to escape gangsters."
  ],
  [
    "The Big Lebowski",
    1998,
    "Comedy",
    "A case of mistaken identity entangles a laid-back bowler."
  ],
  [
    "Bridesmaids",
    2011,
    "Comedy",
    "A maid of honor navigates a chaotic wedding party."
  ],
  [
    "Booksmart",
    2019,
    "Comedy",
    "Two graduating students try to make up for missed fun."
  ],
  [
    "The Devil Wears Prada",
    2006,
    "Comedy",
    "A young assistant works for a demanding fashion editor."
  ],
  [
    "Ferris Bueller’s Day Off",
    1986,
    "Comedy",
    "A teenager takes an elaborate day off school."
  ],
  [
    "Clueless",
    1995,
    "Romantic comedy",
    "A Beverly Hills student tries her hand at matchmaking."
  ],
  [
    "Notting Hill",
    1999,
    "Romantic comedy",
    "A bookseller meets a famous film star."
  ],
  [
    "You’ve Got Mail",
    1998,
    "Romantic comedy",
    "Business rivals unknowingly become online correspondents."
  ],
  [
    "Sleepless in Seattle",
    1993,
    "Romantic comedy",
    "A radio broadcast connects a widower with a listener."
  ],
  [
    "Pretty Woman",
    1990,
    "Romantic comedy",
    "A businessman hires a companion and finds an unexpected connection."
  ],
  [
    "Four Weddings and a Funeral",
    1994,
    "Romantic comedy",
    "A man repeatedly meets a woman at social occasions."
  ],
  [
    "Amélie",
    2001,
    "Romance",
    "A Parisian waitress secretly helps the people around her."
  ],
  [
    "Before Sunset",
    2004,
    "Romance",
    "Two former travelers reunite in Paris."
  ],
  [
    "Sense and Sensibility",
    1995,
    "Romance",
    "Two sisters face love and financial uncertainty."
  ],
  [
    "Little Women",
    2019,
    "Historical",
    "Four sisters pursue their ambitions in nineteenth-century America."
  ],
  [
    "Brooklyn",
    2015,
    "Romance",
    "An Irish immigrant builds a life in New York."
  ],
  [
    "The Sound of Music",
    1965,
    "Classics",
    "A governess brings music to an Austrian family."
  ],
  [
    "Singin’ in the Rain",
    1952,
    "Classics",
    "Hollywood performers navigate the arrival of talking pictures."
  ],
  [
    "Rear Window",
    1954,
    "Mystery",
    "A photographer suspects a neighbor of murder."
  ],
  [
    "Vertigo",
    1958,
    "Mystery",
    "A retired detective follows a mysterious woman."
  ],
  [
    "Psycho",
    1960,
    "Horror",
    "A traveler stops at an isolated motel."
  ],
  [
    "Alien",
    1979,
    "Horror",
    "A spaceship crew encounters a deadly creature."
  ],
  [
    "The Exorcist",
    1973,
    "Horror",
    "A mother seeks help for her afflicted daughter."
  ],
  [
    "Hereditary",
    2018,
    "Horror",
    "A grieving family uncovers disturbing secrets."
  ],
  [
    "The Babadook",
    2014,
    "Horror",
    "A mother and son are haunted by a sinister storybook figure."
  ],
  [
    "Us",
    2019,
    "Horror",
    "A family encounters frightening doubles of themselves."
  ],
  [
    "The Silence of the Lambs",
    1991,
    "Thriller",
    "An FBI trainee consults an imprisoned killer on a case."
  ],
  [
    "The Departed",
    2006,
    "Thriller",
    "An undercover officer and a criminal mole infiltrate opposing sides."
  ],
  [
    "Zodiac",
    2007,
    "Mystery",
    "Investigators pursue a serial killer in California."
  ],
  [
    "The Prestige",
    2006,
    "Mystery",
    "Two rival magicians compete through increasingly dangerous illusions."
  ],
  [
    "The Fugitive",
    1993,
    "Thriller",
    "A wrongly convicted doctor searches for the real killer."
  ],
  [
    "Heat",
    1995,
    "Action",
    "A detective pursues a skilled team of bank robbers."
  ],
  [
    "Speed",
    1994,
    "Action",
    "A police officer tries to save passengers on a bomb-rigged bus."
  ],
  [
    "Casino Royale",
    2006,
    "Action",
    "James Bond takes on a financier in a high-stakes poker game."
  ],
  [
    "Crouching Tiger, Hidden Dragon",
    2000,
    "Action",
    "A stolen sword draws warriors into a sweeping conflict."
  ],
  [
    "The Bourne Identity",
    2002,
    "Action",
    "An amnesiac searches for his identity while evading pursuers."
  ],
  [
    "The Adventures of Robin Hood",
    1938,
    "Adventure",
    "Robin Hood leads a rebellion against an oppressive prince."
  ],
  [
    "The Secret Life of Walter Mitty",
    2013,
    "Adventure",
    "A daydreamer sets out on a real journey."
  ],
  [
    "Life of Pi",
    2012,
    "Adventure",
    "A shipwreck survivor shares a lifeboat with a tiger."
  ],
  [
    "Cast Away",
    2000,
    "Adventure",
    "A plane crash survivor struggles to live on an island."
  ],
  [
    "The Princess Diaries",
    2001,
    "Comedy",
    "A teenager learns that she is heir to a throne."
  ],
  [
    "The Iron Giant",
    1999,
    "Animation",
    "A boy befriends a giant robot from space."
  ],
  [
    "Spirited Away",
    2001,
    "Animation",
    "A girl enters a spirit world while trying to rescue her parents."
  ],
  [
    "My Neighbor Totoro",
    1988,
    "Animation",
    "Two sisters encounter forest spirits near their new home."
  ],
  [
    "How to Train Your Dragon",
    2010,
    "Animation",
    "A young Viking befriends an injured dragon."
  ],
  [
    "Kiki’s Delivery Service",
    1989,
    "Animation",
    "A young witch starts a delivery service in a seaside town."
  ],
  [
    "The Lion King",
    1994,
    "Animation",
    "A lion cub must confront his past and return home."
  ],
  [
    "Beauty and the Beast",
    1991,
    "Animation",
    "A young woman befriends an enchanted prince."
  ],
  [
    "Frozen",
    2013,
    "Animation",
    "A princess searches for her sister after a magical winter begins."
  ],
  [
    "The Polar Express",
    2004,
    "Christmas",
    "A boy boards a magical train to the North Pole."
  ],
  [
    "The Muppet Christmas Carol",
    1992,
    "Christmas",
    "The Muppets retell the story of Ebenezer Scrooge."
  ],
  [
    "Klaus",
    2019,
    "Christmas",
    "A postal worker befriends a reclusive toymaker."
  ],
  [
    "Miracle on 34th Street",
    1947,
    "Christmas",
    "A department-store Santa claims to be the real thing."
  ],
  [
    "The Great Escape",
    1963,
    "War",
    "Allied prisoners plan an escape from a German camp."
  ],
  [
    "The Bridge on the River Kwai",
    1957,
    "War",
    "Prisoners of war are forced to build a railway bridge."
  ],
  [
    "Hacksaw Ridge",
    2016,
    "War",
    "A medic serves in World War II without carrying a weapon."
  ],
  [
    "Hidden Figures",
    2016,
    "Historical",
    "Black women mathematicians contribute to NASA’s space program."
  ],
  [
    "Apollo 13",
    1995,
    "Historical",
    "NASA works to bring a damaged spacecraft safely home."
  ],
  [
    "The King’s Speech",
    2010,
    "Historical",
    "A British king works with a speech therapist."
  ],
  [
    "Blade Runner",
    1982,
    "Science fiction",
    "A detective tracks fugitive artificial humans in Los Angeles."
  ],
  [
    "Ex Machina",
    2014,
    "Science fiction",
    "A programmer evaluates an advanced artificial intelligence."
  ],
  [
    "Contact",
    1997,
    "Science fiction",
    "A scientist investigates a signal from space."
  ],
  [
    "Her",
    2013,
    "Science fiction",
    "A lonely writer forms a bond with an operating system."
  ],
  [
    "The Shape of Water",
    2017,
    "Fantasy",
    "A cleaner forms a bond with an unusual captive creature."
  ],
  [
    "Pan’s Labyrinth",
    2006,
    "Fantasy",
    "A young girl encounters a fantastical labyrinth in postwar Spain."
  ],
  [
    "Coraline",
    2009,
    "Fantasy",
    "A girl discovers an unsettling parallel version of her home."
  ],
  [
    "The Wizard of Oz",
    1939,
    "Fantasy",
    "A girl travels through a magical land seeking a way home."
  ]
];
  const moreGeneralMovies = [
  [
    "Back to the Future Part II",
    1989,
    "Science Fiction",
    "Marty and Doc travel into the future."
  ],
  [
    "Back to the Future Part III",
    1990,
    "Science Fiction",
    "Marty journeys to the Old West to help Doc."
  ],
  [
    "Close Encounters of the Third Kind",
    1977,
    "Science Fiction",
    "Mysterious encounters draw people toward an extraordinary meeting."
  ],
  [
    "Blade Runner 2049",
    2017,
    "Science Fiction",
    "A discovery leads an officer on a journey into the past."
  ],
  [
    "Mrs. Doubtfire",
    1993,
    "Comedy",
    "A father disguises himself to spend time with his children."
  ],
  [
    "Sister Act",
    1992,
    "Comedy",
    "A singer hides in a convent and transforms its choir."
  ],
  [
    "The Parent Trap",
    1998,
    "Family",
    "Twin sisters hatch a plan to reunite their parents."
  ],
  [
    "Freaky Friday",
    2003,
    "Family",
    "A mother and daughter unexpectedly swap bodies."
  ],
  [
    "Matilda",
    1996,
    "Family",
    "A gifted girl finds courage and a kind teacher."
  ],
  [
    "Paddington",
    2014,
    "Family",
    "A young bear finds a new family in London."
  ],
  [
    "Paddington 2",
    2017,
    "Family",
    "Paddington sets out to clear his name."
  ],
  [
    "Roman Holiday",
    1953,
    "Romance",
    "A princess explores Rome with an American reporter."
  ],
  [
    "Breakfast at Tiffany’s",
    1961,
    "Romance",
    "A writer becomes fascinated by his neighbor in New York."
  ],
  [
    "White Christmas",
    1954,
    "Christmas",
    "Two entertainers help a former general at a Vermont inn."
  ],
  [
    "While You Were Sleeping",
    1995,
    "Romantic Comedy",
    "A transit worker is drawn into a family misunderstanding."
  ],
  [
    "My Big Fat Greek Wedding",
    2002,
    "Romantic Comedy",
    "A woman introduces her fiancé to her lively family."
  ],
  [
    "The Princess Diaries 2: Royal Engagement",
    2004,
    "Family",
    "A princess faces royal duties and unexpected romance."
  ],
  [
    "Enchanted",
    2007,
    "Fantasy",
    "A fairy-tale heroine finds herself in modern New York."
  ],
  [
    "Stardust",
    2007,
    "Fantasy",
    "A young man ventures into a magical realm."
  ],
  [
    "Big Fish",
    2003,
    "Fantasy",
    "A son explores the fantastic stories of his father’s life."
  ],
  [
    "The NeverEnding Story",
    1984,
    "Fantasy",
    "A boy discovers a magical world through a book."
  ],
  [
    "Jumanji",
    1995,
    "Adventure",
    "A mysterious board game brings danger to life."
  ],
  [
    "National Treasure",
    2004,
    "Adventure",
    "A treasure hunter follows clues hidden in American history."
  ],
  [
    "The Mask of Zorro",
    1998,
    "Action",
    "A veteran swordsman trains a new masked hero."
  ],
  [
    "Mission: Impossible",
    1996,
    "Action",
    "An agent investigates a disastrous mission."
  ],
  [
    "The Italian Job",
    2003,
    "Action",
    "A team plans an elaborate gold heist."
  ],
  [
    "Ocean’s Eleven",
    2001,
    "Comedy",
    "A crew plots a casino heist in Las Vegas."
  ],
  [
    "Clue",
    1985,
    "Mystery",
    "Dinner guests investigate a series of mysterious deaths."
  ],
  [
    "The Others",
    2001,
    "Horror",
    "A mother and her children face unsettling events at home."
  ],
  [
    "Hocus Pocus",
    1993,
    "Fantasy",
    "Three witches return to Salem on Halloween."
  ],
  [
    "Lawrence of Arabia",
    1962,
    "Historical / War",
    "A British officer becomes involved in the Arab Revolt."
  ],
  [
    "The Apartment",
    1960,
    "Romantic Comedy",
    "A recognizable movie to discover together."
  ],
  [
    "The Philadelphia Story",
    1940,
    "Romantic Comedy",
    "A recognizable movie to discover together."
  ],
  [
    "His Girl Friday",
    1940,
    "Comedy",
    "A recognizable movie to discover together."
  ],
  [
    "The Graduate",
    1967,
    "Comedy",
    "A recognizable movie to discover together."
  ],
  [
    "Moonstruck",
    1987,
    "Romantic Comedy",
    "A recognizable movie to discover together."
  ],
  [
    "Bridget Jones’s Diary",
    2001,
    "Romantic Comedy",
    "A recognizable movie to discover together."
  ],
  [
    "13 Going on 30",
    2004,
    "Romantic Comedy",
    "A recognizable movie to discover together."
  ],
  [
    "27 Dresses",
    2008,
    "Romantic Comedy",
    "A recognizable movie to discover together."
  ],
  [
    "How to Lose a Guy in 10 Days",
    2003,
    "Romantic Comedy",
    "A recognizable movie to discover together."
  ],
  [
    "Legally Blonde",
    2001,
    "Comedy",
    "A recognizable movie to discover together."
  ],
  [
    "The Breakfast Club",
    1985,
    "Comedy",
    "A recognizable movie to discover together."
  ],
  [
    "The Karate Kid",
    1984,
    "Family",
    "A recognizable movie to discover together."
  ],
  [
    "The Sandlot",
    1993,
    "Family",
    "A recognizable movie to discover together."
  ],
  [
    "Cool Runnings",
    1993,
    "Family",
    "A recognizable movie to discover together."
  ],
  [
    "A League of Their Own",
    1992,
    "Comedy",
    "A recognizable movie to discover together."
  ],
  [
    "Remember the Titans",
    2000,
    "Family",
    "A recognizable movie to discover together."
  ],
  [
    "The Adventures of Tintin",
    2011,
    "Animation",
    "A recognizable movie to discover together."
  ],
  [
    "The Jungle Book",
    1967,
    "Animation",
    "A recognizable movie to discover together."
  ],
  [
    "Mulan",
    1998,
    "Animation",
    "A recognizable movie to discover together."
  ],
  [
    "Pocahontas",
    1995,
    "Animation",
    "A recognizable movie to discover together."
  ],
  [
    "The Hunchback of Notre Dame",
    1996,
    "Animation",
    "A recognizable movie to discover together."
  ],
  [
    "Treasure Planet",
    2002,
    "Animation",
    "A recognizable movie to discover together."
  ],
  [
    "Atlantis: The Lost Empire",
    2001,
    "Animation",
    "A recognizable movie to discover together."
  ],
  [
    "The Emperor’s New Groove",
    2000,
    "Animation",
    "A recognizable movie to discover together."
  ],
  [
    "The Aristocats",
    1970,
    "Animation",
    "A recognizable movie to discover together."
  ],
  [
    "The Rescuers",
    1977,
    "Animation",
    "A recognizable movie to discover together."
  ],
  [
    "Lady and the Tramp",
    1955,
    "Animation",
    "A recognizable movie to discover together."
  ],
  [
    "Bambi",
    1942,
    "Animation",
    "A recognizable movie to discover together."
  ],
  [
    "Fantasia",
    1940,
    "Animation",
    "A recognizable movie to discover together."
  ],
  [
    "Paths of Glory",
    1957,
    "Historical / War",
    "A recognizable movie to discover together."
  ],
  [
    "All Quiet on the Western Front",
    2022,
    "Historical / War",
    "A recognizable movie to discover together."
  ],
  [
    "The Imitation Game",
    2014,
    "Historical / War",
    "A recognizable movie to discover together."
  ],
  [
    "The Pianist",
    2002,
    "Historical / War",
    "A recognizable movie to discover together."
  ],
  [
    "The African Queen",
    1951,
    "Adventure",
    "A recognizable movie to discover together."
  ],
  [
    "The Treasure of the Sierra Madre",
    1948,
    "Adventure",
    "A recognizable movie to discover together."
  ],
  [
    "The Birds",
    1963,
    "Horror",
    "A recognizable movie to discover together."
  ],
  [
    "North by Northwest",
    1959,
    "Thriller",
    "A recognizable movie to discover together."
  ],
  [
    "The Maltese Falcon",
    1941,
    "Mystery",
    "A recognizable movie to discover together."
  ],
  [
    "The Big Sleep",
    1946,
    "Mystery",
    "A recognizable movie to discover together."
  ],
  [
    "The Thing",
    1982,
    "Horror",
    "A recognizable movie to discover together."
  ],
  [
    "Aliens",
    1986,
    "Science Fiction",
    "A recognizable movie to discover together."
  ],
  [
    "The Day the Earth Stood Still",
    1951,
    "Science Fiction",
    "A recognizable movie to discover together."
  ],
  [
    "2001: A Space Odyssey",
    1968,
    "Science Fiction",
    "A recognizable movie to discover together."
  ],
  [
    "The Fifth Element",
    1997,
    "Science Fiction",
    "A recognizable movie to discover together."
  ],
  [
    "Galaxy Quest",
    1999,
    "Science Fiction",
    "A recognizable movie to discover together."
  ],
  [
    "The Santa Clause",
    1994,
    "Christmas",
    "A recognizable movie to discover together."
  ],
  [
    "A Christmas Story",
    1983,
    "Christmas",
    "A recognizable movie to discover together."
  ],
  [
    "Arthur Christmas",
    2011,
    "Christmas",
    "A recognizable movie to discover together."
  ]
];
  const movies = originalMovies.map(m => ({...m, universe: /Spider-Man/.test(m.title) ? "Marvel" : m.title === "The Dark Knight" ? "DC" : ""})).concat(extraMovies.map(([title,year,genre,universe,synopsis]) => ({title,year,genre,universe: title === "The Incredibles" ? "Other" : universe,synopsis})), [...addedMovies, ...moreGeneralMovies].map(([title,year,genre,synopsis]) => ({title,year,genre,universe: "",synopsis}))).map(m => ({...m, id: `${m.title.toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"")}-${m.year}`}));
  window.movieNightMovies = movies;
})();
