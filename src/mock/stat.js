export const generateStat = (films) => {
  let watchListCounter = 0;
  let historyCounter = 0;
  let favoritesCounter = 0;
  for (const film of films) {
    if (film.watchList) {
      watchListCounter++;
    }
    if (film.alreadyWatched) {
      historyCounter++;
    }
    if (film.favorite) {
      favoritesCounter++;
    }
  }
  return {
    watchList: watchListCounter,
    history: historyCounter,
    favorites: favoritesCounter,
  };
};
