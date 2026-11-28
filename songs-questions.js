// Music Battle question bank. Each catalog row is a verified Apple Music release.
// Fields: catalog ID, artist, album, release year, genre, difficulty, source,
// featured quiz song, its position on disc one, and three other audio tracks.
(() => {
  const catalog = [
    [1025255443, "Mac Miller", "GO:OD AM", "2015", "Hip-Hop", "medium", "https://music.apple.com/us/album/go-od-am/1025255443", "Weekend (feat. Miguel)", 7, "Doors", "Brand Name", "The Festival (feat. Little Dragon)"],
    [1408996052, "Mac Miller", "Swimming", "2018", "Hip-Hop/Rap", "easy", "https://music.apple.com/us/album/swimming/1408996052", "Self Care", 5, "Come Back to Earth", "Hurt Feelings", "So It Goes"],
    [1137965822, "Mac Miller", "The Divine Feminine", "2016", "Hip-Hop", "medium", "https://music.apple.com/us/album/the-divine-feminine/1137965822", "Dang! (feat. Anderson .Paak)", 2, "Congratulations (feat. Bilal)", "Stay", "God Is Fair, Sexy Nasty (feat. Kendrick Lamar)"],
    [1494022962, "Mac Miller", "Circles", "2020", "Hip-Hop/Rap", "easy", "https://music.apple.com/us/album/circles/1494022962", "Good News", 4, "Complicated", "Blue World", "Once a Day"],
    [1780891320, "Mac Miller", "Balloonerism", "2025", "Hip-Hop/Rap", "hard", "https://music.apple.com/us/album/balloonerism/1780891320", "DJ's Chord Organ (feat. SZA)", 2, "Tambourine Dream", "Do You Have A Destination?", "Tomorrow Will Never Know"],
    [1847744932, "Mac Miller", "K.I.D.S.", "2010", "Hip-Hop/Rap", "medium", "https://music.apple.com/us/album/k-i-d-s/1847744932", "The Spins", 6, "Kickin' Incredibly Dope Shit (Intro)", "Outside", "Face In The Crowd"],
    [1845373321, "Mac Miller", "Macadelic", "2012", "Hip-Hop/Rap", "hard", "https://music.apple.com/us/album/macadelic/1845373321", "Loud", 3, "Love Me As I Have Loved You", "Desperado", "F**k 'Em All"],
    [1846448101, "Mac Miller", "Blue Slide Park", "2011", "Hip-Hop/Rap", "hard", "https://music.apple.com/us/album/blue-slide-park/1846448101", "Party On Fifth Ave.", 3, "English Lane", "PA Nights", "One Last Thing"],
    [1844942166, "Mac Miller", "Watching Movies with the Sound Off", "2013", "Hip-Hop/Rap", "hard", "https://music.apple.com/us/album/watching-movies-with-the-sound-off/1844942166", "S.D.S.", 4, "The Star Room", "Avian", "Youforia"],
    [1574358949, "$uicideboy$", "Long Term Effects of SUFFERING", "2021", "Hip-Hop", "hard", "https://music.apple.com/us/album/long-term-effects-of-suffering/1574358949", "Materialism as a Means to an End", 11, "Degeneration in the Key of A Minor", "If Self-Destruction Was an Olympic Event, I’d Be Tonya Harding", "The Number You Have Dialed Is Not in Service"],
    [1632152994, "$uicideboy$", "Sing Me a Lullaby, My Sweet Temptation", "2022", "Hip-Hop", "medium", "https://music.apple.com/us/album/sing-me-a-lullaby-my-sweet-temptation/1632152994", "Matte Black", 2, "Genesis", "F*****g Your Culture", "THE_EVIL_THAT_MEN_DO"],
    [1549337069, "$uicideboy$", "I Want to Die in New Orleans", "2018", "Hip-Hop", "easy", "https://music.apple.com/us/album/i-want-to-die-in-new-orleans/1549337069", "Carrollton", 12, "King Tulip", "Bring out Your Dead", "I No Longer Fear the Razor Guarding My Heel (IV)"],
    [1737042669, "$uicideboy$", "New World Depression", "2024", "Hip-Hop", "medium", "https://music.apple.com/us/album/new-world-depression/1737042669", "The Thin Grey Line", 3, "Lone Wolf Hysteria", "Mental Clarity Is a Luxury I Can't Afford", "Kill Yourself V"],
    [1551171660, "$uicideboy$", "Stop Staring at the Shadows", "2020", "Hip-Hop", "easy", "https://music.apple.com/us/album/stop-staring-at-the-shadows/1551171660", "...And to Those I Love, Thanks for Sticking Around", 12, "All Dogs Go to Heaven", "I Wanna Be Romanticized", "F**k Your Culture"],
    [1818471603, "$uicideboy$", "THY KINGDOM COME", "2025", "Hip-Hop/Rap", "hard", "https://music.apple.com/us/album/thy-kingdom-come/1818471603", "COUNT YOUR BLESSINGS", 1, "Napoleon", "Oh, What a Wretched Man I Am!", "Monochromatic"],
    [1549299811, "$uicideboy$", "My Liver Will Handle What My Heart Can't", "2015", "Hip-Hop", "hard", "https://music.apple.com/us/album/my-liver-will-handle-what-my-heart-cant/1549299811", "Vincent Van Gogh Ain't Got Shit on Me", 1, "Reign in Blood", "Shattered Amethyst", "Iron Veil"],
    [1549303182, "$uicideboy$", "High Tide in the Snake's Nest", "2015", "Hip-Hop", "hard", "https://music.apple.com/us/album/high-tide-in-the-snakes-nest/1549303182", "Diemonds", 1, "Ugly", "$Outh $Ide $Uicide (feat. Pouya)", "Exodus"],
    [1549299116, "$uicideboy$", "Eternal Grey", "2016", "Hip-Hop", "hard", "https://music.apple.com/us/album/eternal-grey/1549299116", "BREAKDALAW2k16 (feat. Pouya)", 1, "Say Cheese and Die", "Eclipse", "Leave Your Things Behind II"],
    [1359292515, "XXXTENTACION", "?", "2018", "Pop", "easy", "https://music.apple.com/us/album/1359292515", "SAD!", 4, "Introduction (instructions)", "ALONE, PART 3", "before I close my eyes"],
    [1274653476, "XXXTENTACION", "17", "2017", "Hip-Hop/Rap", "easy", "https://music.apple.com/us/album/17/1274653476", "Jocelyn Flores", 2, "The Explanation", "Depression & Obsession", "Ayala (Outro)"],
    [1441480826, "XXXTENTACION", "SKINS", "2018", "Pop", "medium", "https://music.apple.com/us/album/skins/1441480826", "One Minute (feat. Kanye West & Travis Barker)", 7, "Introduction", "Guardian angel", "what are you so afraid of"],
    [1488557241, "XXXTENTACION", "Bad Vibes Forever", "2019", "Pop", "hard", "https://music.apple.com/us/album/bad-vibes-forever/1488557241", "Hot Gyal (feat. Mavado & Tory Lanez)", 12, "Ecstasy (feat. Noah Cyrus)", "Ex Bitch", "IT'S ALL FADING TO BLACK (feat. blink-182)"],
    [1321744873, "XXXTENTACION", "Revenge", "2017", "Hip-Hop/Rap", "easy", "https://music.apple.com/us/album/revenge/1321744873", "Look At Me!", 1, "I Don't Wanna Do This Anymore", "Looking for a Star", "RIP Roach (feat. $ki Mask The Slump God)"],
    [1807389775, "Gigi Perez", "At The Beach, In Every Life", "2025", "Alternative", "easy", "https://music.apple.com/us/album/at-the-beach-in-every-life/1807389775", "Sailor Song", 1, "Sleeping", "Sugar Water", "Twister"],
    [1683428921, "Gigi Perez", "How To Catch A Falling Knife", "2023", "Alternative", "hard", "https://music.apple.com/us/album/how-to-catch-a-falling-knife/1683428921", "Glue", 5, "Kill For You", "When She Smiles", "Sally"],
    [1781270319, "Kendrick Lamar", "GNX", "2024", "Hip-Hop/Rap", "hard", "https://music.apple.com/us/album/gnx/1781270319", "tv off (feat. Lefty Gunplay)", 7, "wacced out murals", "squabble up", "gloria"],
    [1440881047, "Kendrick Lamar", "DAMN.", "2017", "Hip-Hop/Rap", "easy", "https://music.apple.com/us/album/damn/1440881047", "HUMBLE.", 8, "BLOOD.", "DNA.", "DUCKWORTH."],
    [1440828886, "Kendrick Lamar", "To Pimp a Butterfly", "2015", "Hip-Hop/Rap", "easy", "https://music.apple.com/us/album/to-pimp-a-butterfly/1440828886", "Alright", 7, "Wesley's Theory (feat. George Clinton & Thundercat)", "For Free? (Interlude)", "Mortal Man"],
    [1475039105, "Kendrick Lamar", "Section.80", "2011", "Hip-Hop/Rap", "hard", "https://music.apple.com/us/album/section-80/1475039105", "A.D.H.D", 3, "F**k Your Ethnicity", "Hol' Up", "HiiiPower"],
    [255836651, "OutKast", "Stankonia", "2000", "Hip-Hop/Rap", "easy", "https://music.apple.com/us/album/stankonia/255836651", "Ms. Jackson", 5, "Gasoline Dreams (with Khujo Goodie)", "I'm Cool (Interlude)", "Stankonia (Stanklove) [feat. Big Rube & Sleepy Brown]"],
    [266365274, "OutKast", "Aquemini", "1998", "Hip-Hop/Rap", "hard", "https://music.apple.com/us/album/aquemini/266365274", "Rosa Parks", 3, "Hold On Be Strong", "Return of the \"G\"", "Chonkyfire"],
    [263570527, "OutKast", "ATLiens", "1996", "Hip-Hop/Rap", "hard", "https://music.apple.com/us/album/atliens/263570527", "Elevators (Me & You)", 6, "You May Die (Intro)", "Two Dope Boyz (In a Cadillac)", "Elevators (ONP 86 Mix)"],
    [1276760743, "Lauryn Hill", "The Miseducation of Lauryn Hill", "1998", "Pop", "easy", "https://music.apple.com/us/album/the-miseducation-of-lauryn-hill/1276760743", "Doo Wop (That Thing)", 5, "Lost Ones", "Ex-Factor", "Tell Him"],
    [269572838, "Michael Jackson", "Thriller", "1982", "Pop", "easy", "https://music.apple.com/us/album/thriller/269572838", "Billie Jean", 6, "Wanna Be Startin' Somethin'", "Baby Be Mine", "The Lady in My Life"],
    [186166282, "Michael Jackson", "Off the Wall", "1979", "Pop", "medium", "https://music.apple.com/us/album/off-the-wall/186166282", "Don't Stop 'Til You Get Enough", 1, "Rock with You (Single Version)", "Workin' Day and Night", "Burn This Disco Out"],
    [559334659, "Michael Jackson", "Bad", "1987", "Pop", "easy", "https://music.apple.com/us/album/bad/559334659", "Smooth Criminal (2012 Remaster)", 10, "The Way You Make Me Feel (2012 Remaster)", "Speed Demon (2012 Remaster)", "Leave Me Alone (2012 Remaster)"],
    [1440806790, "Stevie Wonder", "Innervisions", "1973", "Motown", "medium", "https://music.apple.com/us/album/innervisions/1440806790", "Higher Ground", 5, "Too High", "Living For the City", "He's Misstra Know-It-All"],
    [1440808973, "Stevie Wonder", "Talking Book", "1972", "R&B/Soul", "easy", "https://music.apple.com/us/album/talking-book/1440808973", "Superstition", 6, "You Are the Sunshine of My Life", "Maybe Your Baby", "I Believe (When I Fall In Love It Will Be Forever)"],
    [1440820988, "Stevie Wonder", "Hotter Than July", "1980", "R&B/Soul", "hard", "https://music.apple.com/us/album/hotter-than-july/1440820988", "Master Blaster (Jammin')", 6, "Did I Hear You Say You Love Me", "All I Do", "Happy Birthday"],
    [780330041, "Beyoncé", "BEYONCÉ", "2013", "Pop", "medium", "https://music.apple.com/us/album/beyonc%C3%A9/780330041", "Drunk in Love (feat. JAŸ-Z)", 3, "Pretty Hurts", "Haunted", "Blue (feat. Blue Ivy)"],
    [1630005298, "Beyoncé", "RENAISSANCE", "2022", "Pop", "easy", "https://music.apple.com/us/album/renaissance/1630005298", "BREAK MY SOUL", 6, "I'M THAT GIRL", "COZY", "SUMMER RENAISSANCE"],
    [201274359, "Beyoncé", "Dangerously in Love", "2003", "Pop", "easy", "https://music.apple.com/us/album/dangerously-in-love/201274359", "Crazy in Love (feat. JAŸ-Z)", 1, "Naughty Girl", "Baby Boy (feat. Sean Paul)", "Daddy"],
    [1738363766, "Beyoncé", "COWBOY CARTER", "2024", "Country", "medium", "https://music.apple.com/us/album/cowboy-carter/1738363766", "TEXAS HOLD 'EM", 7, "AMERIICAN REQUIEM", "BLACKBIIRD", "AMEN"],
    [1657869377, "SZA", "SOS", "2022", "R&B/Soul", "easy", "https://music.apple.com/us/album/sos/1657869377", "Kill Bill", 2, "Seek & Destroy", "Love Language", "Forgiveless (feat. Ol' Dirty Bastard)"],
    [1239976329, "SZA", "Ctrl", "2017", "R&B/Soul", "medium", "https://music.apple.com/us/album/ctrl/1239976329", "Love Galore (feat. Travis Scott)", 2, "Supermodel", "Doves In The Wind (feat. Kendrick Lamar)", "20 Something"],
    [1468058165, "Taylor Swift", "Lover", "2019", "Pop", "easy", "https://music.apple.com/us/album/lover/1468058165", "Cruel Summer", 2, "I Forgot That You Existed", "The Man", "Daylight"],
    [1524801260, "Taylor Swift", "folklore", "2020", "Alternative", "easy", "https://music.apple.com/us/album/folklore/1524801260", "cardigan", 2, "the 1", "the last great american dynasty", "hoax"],
    [1440933849, "Taylor Swift", "reputation", "2017", "Pop", "medium", "https://music.apple.com/us/album/reputation/1440933849", "Delicate", 5, "...Ready For It?", "End Game (feat. Ed Sheeran & Future)", "New Year’s Day"],
    [1450695723, "Billie Eilish", "WHEN WE ALL FALL ASLEEP, WHERE DO WE GO?", "2019", "Alternative", "easy", "https://music.apple.com/us/album/when-we-all-fall-asleep-where-do-we-go/1450695723", "bad guy", 2, "!!!!!!!", "xanny", "goodbye"],
    [1739659134, "Billie Eilish", "HIT ME HARD AND SOFT", "2024", "Alternative", "easy", "https://music.apple.com/us/album/hit-me-hard-and-soft/1739659134", "BIRDS OF A FEATHER", 4, "SKINNY", "LUNCH", "BLUE"],
    [1544491232, "Adele", "21", "2011", "Pop", "easy", "https://music.apple.com/us/album/21/1544491232", "Rolling in the Deep", 1, "Rumour Has It", "Turning Tables", "I Found a Boy"],
    [1544494115, "Adele", "25", "2015", "Pop", "easy", "https://music.apple.com/us/album/25/1544494115", "Hello", 1, "Send My Love (To Your New Lover)", "I Miss You", "Sweetest Devotion"],
    [1538003494, "Dua Lipa", "Future Nostalgia", "2020", "Pop", "easy", "https://music.apple.com/us/album/future-nostalgia/1538003494", "Levitating", 5, "Don't Start Now", "Cool", "Fever"],
    [1734980417, "Dua Lipa", "Radical Optimism", "2024", "Pop", "medium", "https://music.apple.com/us/album/radical-optimism/1734980417", "Houdini", 2, "End Of An Era", "Training Season", "Happy For You"],
    [1441164359, "The Beatles", "Rubber Soul", "1965", "Rock", "medium", "https://music.apple.com/us/album/rubber-soul/1441164359", "In My Life", 11, "Drive My Car", "Norwegian Wood (This Bird Has Flown)", "Run For Your Life"],
    [1441164426, "The Beatles", "Abbey Road", "1969", "Rock", "easy", "https://music.apple.com/us/album/abbey-road-remastered/1441164426", "Come Together", 1, "Something", "Maxwell's Silver Hammer", "Her Majesty"],
    [1441164604, "The Beatles", "Sgt. Pepper's Lonely Hearts Club Band", "1967", "Rock", "easy", "https://music.apple.com/us/album/sgt-peppers-lonely-hearts-club-band/1441164604", "With a Little Help From My Friends", 2, "Lucy In the Sky with Diamonds", "Getting Better", "A Day In the Life"],
    [1441164670, "The Beatles", "Revolver", "1966", "Rock", "medium", "https://music.apple.com/us/album/revolver/1441164670", "Eleanor Rigby", 2, "Taxman", "I'm Only Sleeping", "Tomorrow Never Knows"],
    [6781023399, "Queen", "A Night At The Opera", "1975", "Rock", "easy", "https://music.apple.com/us/album/a-night-at-the-opera/6781023399", "Bohemian Rhapsody", 11, "Death On Two Legs (Dedicated To...)", "Lazing On A Sunday Afternoon", "God Save the Queen"],
    [6781074926, "Queen", "The Game", "1980", "Rock", "medium", "https://music.apple.com/us/album/the-game/6781074926", "Another One Bites The Dust", 3, "Dragon Attack", "Need Your Loving Tonight", "Save Me"],
    [6781074739, "Queen", "News Of The World", "1977", "Rock", "easy", "https://music.apple.com/us/album/news-of-the-world/6781074739", "We Will Rock You", 1, "We Are The Champions", "Sheer Heart Attack", "My Melancholy Blues"],
    [528436018, "Linkin Park", "Hybrid Theory", "2000", "Hard Rock", "easy", "https://music.apple.com/us/album/hybrid-theory/528436018", "In the End", 8, "Papercut", "One Step Closer", "Pushing Me Away"],
    [528435845, "Linkin Park", "Meteora", "2003", "Hard Rock", "easy", "https://music.apple.com/us/album/meteora/528435845", "Numb", 13, "Foreword", "Don't Stay", "Session"],
    [604804755, "Paramore", "Riot!", "2007", "Alternative", "easy", "https://music.apple.com/us/album/riot/604804755", "Misery Business", 4, "For a Pessimist, I'm Pretty Optimistic", "That's What You Get", "Born For This"],
    [1227049864, "Paramore", "After Laughter", "2017", "Alternative", "medium", "https://music.apple.com/us/album/after-laughter/1227049864", "Hard Times", 1, "Rose-Colored Boy", "Told You So", "Tell Me How"],
    [1440783617, "Nirvana", "Nevermind", "1991", "Rock", "easy", "https://music.apple.com/us/album/nevermind/1440783617", "Smells Like Teen Spirit", 1, "In Bloom", "Come As You Are", "Endless, Nameless"],
    [1561643530, "Prince", "Welcome 2 America", "2021", "R&B/Soul", "hard", "https://music.apple.com/us/album/welcome-2-america/1561643530", "Born 2 Die", 3, "Running Game (Son Of A Slave Master)", "1000 Light Years From Here", "One Day We Will All B Free"],
    [203708420, "Bruce Springsteen", "Born In the U.S.A.", "1984", "Rock", "medium", "https://music.apple.com/us/album/born-in-the-u-s-a/203708420", "Dancing In the Dark", 11, "Cover Me", "Darlington County", "My Hometown"],
    [1622045624, "Bad Bunny", "Un Verano Sin Ti", "2022", "Latin", "easy", "https://music.apple.com/us/album/un-verano-sin-ti/1622045624", "Tití Me Preguntó", 4, "Moscow Mule", "Después de la Playa", "Callaita"],
    [1500776322, "Bad Bunny", "YHLQMDLG", "2020", "Urbano latino", "medium", "https://music.apple.com/us/album/yhlqmdlg/1500776322", "Yo Perreo Sola", 5, "Si Veo a Tu Mamá", "La Difícil", "Hablamos Mañana"],
    [1447554595, "Bad Bunny", "X 100PRE", "2018", "Urbano latino", "medium", "https://music.apple.com/us/album/x-100pre/1447554595", "MÍA (feat. Drake)", 15, "NI BIEN NI MAL", "200 MPH (feat. Diplo)", "Estamos Bien"],
    [192682818, "Shakira", "Dónde Están Los Ladrones", "1998", "Pop Latino", "medium", "https://music.apple.com/us/album/d%C3%B3nde-est%C3%A1n-los-ladrones/192682818", "Ciega, Sordomuda", 1, "Si Te Vas", "Moscas en la Casa", "Ojos Así"],
    [193662156, "Shakira", "Pies Descalzos", "1995", "Latin", "hard", "https://music.apple.com/us/album/pies-descalzos/193662156", "Estoy Aquí", 1, "Antología", "Un Poco de Amor", "Se Quiere, Se Mata"],
    [1234665555, "Shakira", "El Dorado", "2017", "Pop Latino", "medium", "https://music.apple.com/us/album/el-dorado/1234665555", "Chantaje (feat. Maluma)", 3, "Me Enamoré", "Nada", "Toneladas"],
    [1436309944, "ROSALÍA", "EL MAL QUERER", "2018", "Pop", "medium", "https://music.apple.com/us/album/el-mal-querer/1436309944", "MALAMENTE (Cap.1: Augurio)", 1, "QUE NO SALGA LA LUNA (Cap.2: Boda)", "PIENSO EN TU MIRÁ (Cap.3: Celos)", "A NINGÚN HOMBRE (Cap.11: Poder)"],
    [1607918350, "ROSALÍA", "MOTOMAMI", "2022", "Pop Latino", "easy", "https://music.apple.com/us/album/motomami/1607918350", "SAOKO", 1, "CANDY", "LA FAMA", "SAKURA"],
    [168404612, "Celia Cruz", "Regalo del Alma", "2003", "Música tropical", "hard", "https://music.apple.com/us/album/regalo-del-alma/168404612", "Rie y Llora", 3, "Ella Tiene Fuego", "José Caridad", "Yo Vívíré (I Will Survíve)"],
    [158401967, "Celia Cruz", "Siempre Viviré", "2000", "Música tropical", "hard", "https://music.apple.com/us/album/siempre-vivir%C3%A9/158401967", "Dos Días en la Vida", 3, "Celia's Oye Como Va (Oye Como Va)", "La Sopa", "Tu Voz (Ranchera Bolero Version)"],
  ];

  // The answer bank is entirely local. The URLs are supporting references, never fetched during play.
  function question(id, category, difficulty, prompt, answer, incorrect, explanation, source) {
    return { id, category, difficulty, question: prompt, answer, incorrect, explanation, source };
  }

  function genreFamily(genre) {
    if (/hip-hop/i.test(genre)) return 'hip-hop';
    if (/latin|música tropical/i.test(genre)) return 'latin';
    if (/rock|alternative/i.test(genre)) return 'rock';
    if (/r&b|motown/i.test(genre)) return 'soul';
    return genre;
  }

  function shortSongTitle(title) {
    return title.replace(/ \((?:feat\. .+|\d{4} remaster)\)$/i, '');
  }

  function relatedChoices(release, field, exclusion) {
    const { id, artist, year, genre } = release;
    const nearby = releases.filter(candidate => candidate.id !== id);
    const ranked = nearby.map(candidate => {
      const sameArtist = artist === candidate.artist;
      const sameGenre = genreFamily(genre) === genreFamily(candidate.genre);
      const era = Math.abs(Number(year) - Number(candidate.year));
      const tieBreaker = ((candidate.id + id) % 97) / 100;
      const rank = (sameArtist ? -8 : 0) + (sameGenre ? -4 : 0) + Math.min(era, 32) / 4;
      const answer = field === 'song' ? shortSongTitle(candidate.song) : candidate[field];
      return { answer, rank: rank + tieBreaker };
    }).sort((a, b) => a.rank - b.rank);
    return [...new Set(ranked.map(item => item.answer))].filter(value => !exclusion.includes(value)).slice(0, 3);
  }

  function wrongYears(release) {
    const options = releases.filter(candidate => candidate.artist === release.artist)
      .map(candidate => Number(candidate.year));
    const year = Number(release.year);
    const alternatives = release.difficulty === 'easy' ? [-4, 3, 6, -6, -8] : [-1, 1, 2, -2, -3];
    const fallback = alternatives.map(offset => year + offset);
    return [...new Set([...options, ...fallback])]
      .filter(candidate => candidate !== year && candidate <= 2025)
      .sort((a, b) => Math.abs(a - year) - Math.abs(b - year))
      .slice(0, 3).map(String);
  }

  const releases = catalog.map(([id, artist, album, year, genre, difficulty, source, song, position, trackA, trackB, trackC]) =>
    ({ id, artist, album, year, genre, difficulty, source, song, position, trackA, trackB, trackC }));

  const catalogQuestions = releases.flatMap(release => {
    const { id, artist, album, year, difficulty, source, song, position, trackA, trackB, trackC } = release;
    const featured = song.match(/ \(feat\. (.+)\)$/i);
    const songClue = position === 1
      ? 'Which song opens the first disc of ' + artist + '’s ' + album + '?'
      : featured
        ? 'Which song is track ' + position + ' on ' + artist + '’s ' + album + ', featuring ' + featured[1] + '?'
        : 'Which song is track ' + position + ' on the first disc of ' + artist + '’s ' + album + '?';
    const namesArtist = album.toLowerCase().includes(artist.toLowerCase());
    const albumClue = 'Which release' + (namesArtist ? '' : ' by ' + artist) +
      ' contains both “' + trackA + '” and “' + trackB + '”?';
    const artistClue = namesArtist
      ? 'Which artist’s ' + year + ' album lists both “' + trackA + '” and “' + trackC + '”?'
      : id % 2 === 0
        ? 'Who released ' + album + ', the record that includes “' + trackC + '”?'
        : 'Which artist is credited on the ' + year + ' release ' + album + '?';
    const yearClue = id % 2 === 0
      ? 'In what year did “' + trackC + '” appear on ' + artist + '’s ' + album + '?'
      : 'What is the original release year listed for ' + artist + '’s ' + album + '?';
    return [
      question('song-' + id, 'song', difficulty, songClue, shortSongTitle(song),
        relatedChoices(release, 'song', [shortSongTitle(song)]),
        '“' + song + '” is track ' + position + ' on ' + album + '.', source),
      question('artist-' + id, 'artist', difficulty, artistClue, artist,
        relatedChoices(release, 'artist', [artist]),
        album + ' was released by ' + artist + '.', source),
      question('album-' + id, 'album', difficulty, albumClue, album,
        relatedChoices(release, 'album', [album]),
        'Both songs appear on ' + album + ' by ' + artist + '.', source),
      question('year-' + id, 'year', difficulty, yearClue, year,
        wrongYears(release), 'Apple Music dates ' + album + ' to ' + year + '.', source)
    ];
  });

  const archive = {
    rap: 'https://www.grammy.com/awards/categories/best-rap-album/2024/',
    rock: 'https://www.grammy.com/awards/categories/best-rock-album/2024/',
    rnb: 'https://www.grammy.com/music-genre/rb/',
    latin: 'https://www.latingrammy.com/en/awards/categories/album-of-the-year/',
    perez: 'https://music.apple.com/us/album/at-the-beach-in-every-life/1807389775',
    mac: 'https://music.apple.com/us/album/balloonerism/1780891320',
    boys: 'https://music.apple.com/us/album/i-want-to-die-in-new-orleans/1549337069',
    x: 'https://music.apple.com/us/album/skins/1441480826'
  };

  // Standalone clues use different facts from the catalog prompts above.
  const authored = [
    ['pulitzer', 'trivia', 'easy', 'Which prize did Kendrick Lamar win for DAMN. in 2018?', 'Pulitzer Prize for Music',
      ['Mercury Prize', 'Polar Music Prize', 'Grammy for Album of the Year'], 'The Pulitzer board awarded its Music Prize to DAMN. in 2018.', 'https://www.pulitzer.org/winners/kendrick-lamar'],
    ['oscar-rap', 'trivia', 'easy', '“Lose Yourself” won an Oscar as an original song from which film?', '8 Mile',
      ['Get Rich or Die Tryin’', 'Hustle & Flow', 'Straight Outta Compton'], 'The Oscar entry credits “Lose Yourself” to 8 Mile.', 'https://www.oscars.org/oscars/ceremonies/2003'],
    ['oscar-animation', 'trivia', 'easy', '“Let It Go” won the original-song Oscar for which animated movie?', 'Frozen',
      ['Tangled', 'Moana', 'Brave'], 'Kristen Anderson-Lopez and Robert Lopez wrote the Oscar-winning song from Frozen.', 'https://www.oscars.org/oscars/ceremonies/2014'],
    ['oscar-titanic', 'trivia', 'easy', 'Which song from Titanic won the original-song Oscar?', 'My Heart Will Go On',
      ['Because You Loved Me', 'I Have Nothing', 'When You Believe'], 'James Horner and Will Jennings won the award for “My Heart Will Go On.”', 'https://www.oscars.org/oscars/ceremonies/1998'],
    ['music-tempo', 'trivia', 'easy', 'What does BPM stand for on a metronome?', 'Beats per minute',
      ['Bars per measure', 'Breaks per minute', 'Beats per measure'], 'BPM describes the number of beats in one minute.', 'https://learningmusic.ableton.com/make-beats/beat-and-tempo.html'],
    ['queen-vocals', 'trivia', 'easy', 'Who was Queen’s lead vocalist during the recording of A Night at the Opera?', 'Freddie Mercury',
      ['Roger Daltrey', 'Robert Plant', 'David Bowie'], 'Freddie Mercury fronted Queen during that era.', 'https://rockhall.com/inductees/queen/'],
    ['hall-grohl', 'trivia', 'easy', 'Dave Grohl formed which band after his time drumming with Nirvana?', 'Foo Fighters',
      ['Soundgarden', 'Pearl Jam', 'Queens of the Stone Age'], 'Grohl founded Foo Fighters and switched to lead vocals and guitar.', 'https://rockhall.com/inductees/foo-fighters/'],
    ['latin-rosalia', 'trivia', 'easy', 'Which Rosalía release won Album of the Year at the 2022 Latin Grammys?', 'MOTOMAMI',
      ['EL MAL QUERER', 'Los Ángeles', 'LUX'], 'The Latin Recording Academy awarded the 2022 prize to MOTOMAMI.', archive.latin],
    ['latin-karol', 'trivia', 'easy', 'Who won the 2023 Latin Grammy for Album of the Year?', 'Karol G',
      ['Natalia Lafourcade', 'Shakira', 'Rosalía'], 'Karol G won with Mañana Será Bonito.', archive.latin],
    ['hill-milestone', 'trivia', 'easy', 'What distinction did Lauryn Hill earn when The Miseducation of Lauryn Hill won Album of the Year?', 'First hip-hop artist to win the category',
      ['First artist to win for a live album', 'First artist to win two Latin Grammys', 'First artist to share the award with a group'], 'The Recording Academy identifies it as the category’s first hip-hop win.', 'https://www.grammy.com/news/lauryn-hill-album-year-win-miseducation-grammy-rewind-video-speech/'],
    ['rhythm', 'trivia', 'easy', 'In beat-making, what is another name for a measure?', 'Bar',
      ['Scale', 'Chord', 'Verse'], 'A bar groups a fixed number of beats under the current meter.', 'https://learningmusic.ableton.com/make-beats/bars.html'],
    ['suicide-city', 'trivia', 'medium', 'Which New Orleans neighborhood supplies the name of a track on I Want to Die in New Orleans?', 'Carrollton',
      ['Algiers Point', 'Bywater', 'Lakeview'], '“Carrollton” takes its name from a neighborhood in uptown New Orleans.', archive.boys],
    ['x-label', 'trivia', 'medium', 'Which distributor is credited on the original Apple Music listing for XXXTENTACION’s SKINS?', 'EMPIRE',
      ['Top Dawg Entertainment', 'Dreamville', 'G59 Records'], 'The sound-recording credit pairs Bad Vibes Forever with EMPIRE.', archive.x],
    ['mac-alias', 'trivia', 'medium', 'Which of Mac Miller’s production aliases is credited on “DJ’s Chord Organ”?', 'Larry Fisherman',
      ['Delusional Thomas', 'Larry Lovestein', 'DJ Clockwork'], 'The Balloonerism credits list Larry Fisherman on the track.', archive.mac],
    ['mac-balloon', 'trivia', 'medium', 'Which vocalist features on Balloonerism’s “DJ’s Chord Organ”?', 'SZA',
      ['Ariana Grande', 'Kali Uchis', 'Syd'], 'The Apple Music release notes identify SZA as the track’s guest vocalist.', archive.mac],
    ['rap-tyler', 'trivia', 'medium', 'Which Tyler, the Creator album won Best Rap Album at the 2022 Grammys?', 'Call Me If You Get Lost',
      ['IGOR', 'Flower Boy', 'CHROMAKOPIA'], 'Call Me If You Get Lost took the 2022 award.', archive.rap],
    ['rock-paramore', 'trivia', 'medium', 'Which Paramore album won Best Rock Album in 2024?', 'This Is Why',
      ['After Laughter', 'Riot!', 'Brand New Eyes'], 'The Recording Academy awarded Best Rock Album to This Is Why in 2024.', archive.rock],
    ['rap-doechii', 'trivia', 'medium', 'Which Doechii release won the 2025 Grammy for Best Rap Album?', 'Alligator Bites Never Heal',
      ['she / her / black bitch', 'Oh the Places You’ll Go', 'Coven Music Session, Vol. 1'], 'The Recording Academy lists Alligator Bites Never Heal as the 2025 winner.', archive.rap],
    ['rnb-paak', 'trivia', 'medium', 'Which Anderson .Paak album won the 2020 Grammy for Best R&B Album?', 'Ventura',
      ['Malibu', 'Oxnard', 'Venice'], 'Ventura won the Grammy for Best R&B Album in 2020.', archive.rnb],
    ['latin-bunny', 'trivia', 'medium', 'Which Bad Bunny release won Album of the Year at the 2025 Latin Grammys?', 'DeBÍ TiRAR MáS FOToS',
      ['X 100PRE', 'Un Verano Sin Ti', 'YHLQMDLG'], 'The Latin Recording Academy named DeBÍ TiRAR MáS FOToS the 2025 winner.', archive.latin],
    ['backbeat', 'trivia', 'medium', 'In a common four-beat pop or rock backbeat, which beats usually get the snare accents?', '2 and 4',
      ['1 and 3', '1 and 2', '3 and 4'], 'A familiar backbeat places the snare on beats two and four.', 'https://learningmusic.ableton.com/make-beats/backbeats.html'],
    ['rap-nas', 'trivia', 'medium', 'Which Nas album won Best Rap Album at the 2021 Grammys?', 'King’s Disease',
      ['Illmatic', 'Life Is Good', 'Magic'], 'King’s Disease won at the 63rd Annual Grammy Awards.', archive.rap],
    ['suicide-parade', 'trivia', 'hard', 'Which $uicideboy$ track is named after a New Orleans Mardi Gras parade?', 'Krewe du Vieux',
      ['King Tulip', 'Nicotine Patches', 'Phantom Menace'], 'Apple Music’s notes identify the Mardi Gras parade that inspired “Krewe du Vieux.”', archive.boys],
    ['suicide-sample', 'trivia', 'hard', 'Which Memphis rapper is sampled on $uicideboy$’s “Coma”?', 'Playa Fly',
      ['Project Pat', 'Gangsta Boo', 'DJ Paul'], '“Coma” uses a sample of Playa Fly’s “Kreepin Out Da Kut.”', archive.boys],
    ['skins-drums', 'trivia', 'hard', 'Which drummer plays on XXXTENTACION’s “One Minute”?', 'Travis Barker',
      ['Dave Grohl', 'Brad Wilk', 'Chad Smith'], 'The SKINS liner notes on Apple Music describe Barker’s drums on “One Minute.”', archive.x],
    ['balloon-organ', 'trivia', 'hard', 'According to Apple Music’s Balloonerism notes, whose chord organ is heard on “DJ’s Chord Organ”?', 'Daniel Johnston',
      ['Jeff Mangum', 'Elliott Smith', 'Mark Linkous'], 'The album notes trace the instrument to songwriter Daniel Johnston.', archive.mac],
    ['rnb-messiah', 'trivia', 'hard', 'What was D’Angelo and the Vanguard’s 2016 Grammy winner for Best R&B Album?', 'Black Messiah',
      ['Voodoo', 'Brown Sugar', 'Live at the Jazz Cafe, London'], 'Black Messiah won Best R&B Album at the 2016 Grammys.', archive.rnb],
    ['rnb-radio', 'trivia', 'hard', 'Which Robert Glasper Experiment release won Best R&B Album in 2013?', 'Black Radio',
      ['Black Radio 2', 'Double Booked', 'Covered'], 'Black Radio won the Recording Academy award in 2013.', archive.rnb],
    ['rnb-thunder', 'trivia', 'hard', 'Which Thundercat album won the Grammy for Best Progressive R&B Album in 2021?', 'It Is What It Is',
      ['Drunk', 'Apocalypse', 'The Golden Age of Apocalypse'], 'Thundercat and Flying Lotus are credited as its producers in the Grammy archive.', archive.rnb],
    ['oscars-horner', 'trivia', 'hard', 'Who wrote the music for the Oscar-winning song “My Heart Will Go On”?', 'James Horner',
      ['Alan Menken', 'John Williams', 'Hans Zimmer'], 'The Academy credits James Horner for the music and Will Jennings for the lyrics.', 'https://www.oscars.org/oscars/ceremonies/1998'],
    ['rnb-voyage', 'trivia', 'hard', 'Which India.Arie record won Best R&B Album in 2003?', 'Voyage to India',
      ['Acoustic Soul', 'Testimony: Vol. 1, Life & Relationship', 'SongVersation'], 'The Recording Academy lists Voyage to India as the 2003 winner.', archive.rnb],
    ['latin-salswing', 'trivia', 'hard', 'Who led the orchestra that shared the 2021 Album of the Year Latin Grammy with Rubén Blades?', 'Roberto Delgado',
      ['Juan Luis Guerra', 'Willy Colón', 'Oscar D’León'], 'Salswing! was credited to Rubén Blades and Roberto Delgado & Orquesta.', archive.latin],
    ['rock-rubin', 'trivia', 'hard', 'Who produced The Strokes’ Grammy-winning rock album The New Abnormal?', 'Rick Rubin',
      ['Nigel Godrich', 'Butch Vig', 'Danger Mouse'], 'The Recording Academy lists Rick Rubin as the producer.', archive.rock],
    ['latin-radio', 'trivia', 'medium', 'Which Juan Luis Guerra release won the Latin Grammy for Album of the Year in 2024?', 'Radio Güira',
      ['Bachata Rosa', 'La Llave de Mi Corazón', 'Literal'], 'Radio Güira took the Latin Recording Academy’s 2024 album prize.', archive.latin],
    ['rock-cues', 'trivia', 'medium', 'Which band won the 2020 Grammy for Best Rock Album with Social Cues?', 'Cage the Elephant',
      ['The Black Keys', 'Arctic Monkeys', 'The Strokes'], 'Cage the Elephant took home Best Rock Album for Social Cues.', archive.rock],
    ['rap-eryn', 'artist', 'hard', 'Which vocalist joined Killer Mike, André 3000, and Future on “SCIENTISTS & ENGINEERS”?', 'Eryn Allen Kane',
      ['Jazmine Sullivan', 'Rapsody', 'H.E.R.'], 'The Grammy award listing credits all four performers.', 'https://www.grammy.com/awards/categories/best-rap-performance/2024/'],
    ['duo-nola', 'artist', 'medium', 'Which New Orleans rap duo is made up of cousins Ruby da Cherry and Scrim?', '$uicideboy$',
      ['OutKast', 'Clipse', 'Run the Jewels'], 'Apple Music’s notes identify the cousins behind $uicideboy$.', archive.boys],
    ['sailor-single-year', 'year', 'medium', 'Which year did Gigi Perez originally release “Sailor Song” as a single?', '2024',
      ['2022', '2023', '2025'], '“Sailor Song” arrived in 2024 and later appeared on her 2025 debut album.', archive.perez],
    ['sailor-gigi', 'song', 'easy', 'Which Gigi Perez track preceded her debut album and reached No. 1 on the UK singles chart?', 'Sailor Song',
      ['Sometimes (Backwood)', 'Chemistry', 'Fable'], 'Apple Music’s release notes identify “Sailor Song” as her breakthrough UK chart-topper.', archive.perez],
    ['perez-twister', 'song', 'hard', 'Which track on Gigi Perez’s debut album stands out for its programmed beat and Auto-Tuned vocal?', 'Twister',
      ['Sugar Water', 'Survivor’s Guilt', 'Crown'], 'Apple Music highlights the programmed beat and vocal treatment on “Twister.”', archive.perez],
    ['x-skins-whoa', 'song', 'hard', 'Which SKINS track uses a bright, mallet-like keyboard texture over XXXTENTACION’s softer vocal?', 'whoa (mind in awe)',
      ['BAD!', 'One Minute', 'STARING AT THE SKY'], 'The album notes point to the xylophone and marimba sounds on “whoa (mind in awe).”', archive.x],
    ['perez-fable', 'song', 'medium', 'Which Gigi Perez song on At The Beach, In Every Life shares its use of her sister’s voicemail with the album’s closing track?', 'Fable',
      ['Crown', 'Chemistry', 'Normalcy'], 'The album notes identify the two songs in which those voicemails appear.', archive.perez],
    ['emmas-memory', 'personal', 'easy', 'Which song played often when Emma and Dom were first getting to know each other?', 'Sailor Song',
      ['Good News', 'Please Be Rude', 'Self Care'], 'Emma tells that story in Songs That Remind Me of You.', 'our-songs.html#section-remind'],
    ['dom-vinyl-x', 'personal', 'hard', 'Which of Dom’s favorite artists has the vinyl caption “17 · ? · Revenge”?', 'XXXTENTACION',
      ['$uicideboy$', 'Mac Miller', 'Gigi Perez'], 'Dom’s vinyl shelf lists these titles beneath XXXTENTACION’s name.', 'our-songs.html#section-vinyls'],
    ['dom-vinyl-mac', 'personal', 'medium', 'Which favorite gets the “Swimming · Circles” caption on Dom’s record shelf?', 'Mac Miller',
      ['XXXTENTACION', '$uicideboy$', 'Gigi Perez'], 'The words under Mac Miller’s vinyl name those two records.', 'our-songs.html#section-vinyls'],
    ['dom-vinyl-nola', 'personal', 'medium', 'Which favorite’s vinyl caption connects them to New Orleans?', '$uicideboy$',
      ['Mac Miller', 'XXXTENTACION', 'Gigi Perez'], 'The $uicideboy$ record is captioned “G59 · New Orleans.”', 'our-songs.html#section-vinyls'],
    ['couple-playlist', 'personal', 'easy', 'What name appears in the badge above Dom and Emma’s shared playlist?', '1st🖤',
      ['Shared Favorites', 'Side A', 'On Repeat'], 'The playlist badge reads “Shared Beats · 1st🖤.”', 'our-songs.html#section-playlist'],
    ['records-at-home', 'personal', 'hard', 'Which two artists does Emma remember spinning at home together?', 'Mac Miller and $uicideboy$',
      ['Gigi Perez and Mac Miller', 'Mac Miller and XXXTENTACION', '$uicideboy$ and XXXTENTACION'], 'Emma keeps that memory in Songs That Remind Me of You.', 'our-songs.html#section-remind']
  ];

  globalThis.MusicQuestions = [
    ...catalogQuestions,
    ...authored.map(([id, category, difficulty, prompt, answer, incorrect, explanation, source]) =>
      question(id, category, difficulty, prompt, answer, incorrect, explanation, source))
  ];
})();
