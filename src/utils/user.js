import {UserRank} from '../const.js';

export const getUserRank = (filmCards) => {
  const countWatchedFilmCards = filmCards.filter((filmCard) => filmCard.alreadyWatched).length;
  if (countWatchedFilmCards < UserRank.NOVICE.count) {
    return '';
  } else if (countWatchedFilmCards < UserRank.FAN.count) {
    return UserRank.NOVICE.name;
  } else if (countWatchedFilmCards < UserRank.MOVIE_BUFF.count) {
    return UserRank.FAN.name;
  }
  return UserRank.MOVIE_BUFF.name;
};
