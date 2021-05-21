import {FilterType} from '../const';

export const filter = {
  [FilterType.ALL]: (filmCards) => filmCards,
  [FilterType.WATCHLIST]: (filmCards) => filmCards.filter((filmCard) => filmCard.watchList),
  [FilterType.HISTORY]: (filmCards) => filmCards.filter((filmCard) => filmCard.alreadyWatched),
  [FilterType.FAVORITES]: (filmCards) => filmCards.filter((filmCard) => filmCard.favorite),
};
