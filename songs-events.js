// Official venue and ticket-provider listings checked on November 28, 2026.
// Add future listings here after confirming date, venue and official URL.
globalThis.MusicConcerts = [
  ['koz-sarasota', 'Dave Koz', 'Dave Koz & Friends Christmas Tour 2026', '2026-12-03', 'Van Wezel Performing Arts Hall', 'Sarasota', 'Jazz', 'https://www.vanwezel.org/events/detail/dave-koz-friends-christmas-tour-2026'],
  ['jook-tampa', 'Trina, Ball Greezy & more', 'Jook Fest 2027', '2027-02-27', 'Yuengling Center', 'Tampa', 'Hip-hop / Rap', 'https://www.yuenglingcenter.com/event/jook-fest-2027/'],
  ['stranger-orlando', 'Little Stranger', 'Little Stranger', '2027-03-06', 'House of Blues Orlando', 'Orlando', 'Hip-hop / Rap', 'https://www.ticketmaster.com/little-stranger-orlando-florida-03-06-2027/event/22006549F3E2BDFD'],
  ['don-tampa', 'Don Omar', 'The Last King World Tour', '2027-03-10', 'Benchmark International Arena', 'Tampa', 'Latin', 'https://www.livenation.com/event/vvG1VZ_uC-BUha/don-omar-the-last-king-world-tour'],
  ['brakence-stpete', 'brakence', 'brakence', '2027-03-13', 'Jannus Live', 'St. Petersburg', 'Alternative', 'https://www.axs.com/events/1666593/brakence-tickets'],
  ['don-orlando', 'Don Omar', 'The Last King World Tour', '2027-03-14', 'Kia Center', 'Orlando', 'Latin', 'https://www.kiacenter.com/events/detail/don-omar-2026'],
  ['warren-orlando', 'Alex Warren', 'Finding (More) Family On The Road Tour', '2027-04-10', 'Kia Center', 'Orlando', 'Pop', 'https://www.kiacenter.com/events/detail/alex-warren-2027'],
  ['aiko-orlando', 'Jhené Aiko', 'Ark to Agartha – A Westside Whimsy Experience', '2027-04-12', 'Kia Center', 'Orlando', 'R&B', 'https://www.livenation.com/event/1kFOvPjaGAu4wX9/jhene-aiko-presents-ark-to-agartha-a-westside-whimsy-experience']
].map(([id, artist, name, date, venue, city, genre, url]) =>
  ({ id, artist, name, date, venue, city, genre, url, verified: '2026-11-28' })
);
