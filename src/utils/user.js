import {UserRank} from '../const.js';

const WatchedMovies = {
  NOVICE: 1,
  FAN: 11,
  MOVIE_BUFF: 21,
};

export const getUserRank = (filmCards) => {
  const countWatchedFilmCards = filmCards.filter((filmCard) => filmCard.alreadyWatched).length;
  if (countWatchedFilmCards < WatchedMovies.NOVICE) {
    return '';
  } else if (countWatchedFilmCards < WatchedMovies.FAN) {
    return UserRank.NOVICE;
  } else if (countWatchedFilmCards < WatchedMovies.MOVIE_BUFF) {
    return UserRank.FAN;
  }
  return UserRank.MOVIE_BUFF;
};
