import AbstractView from './abstract.js';
import {FilterType} from '../const.js';

export const createNav = (stat, currentFilterType) => {
  const {watchList, history, favorites} = stat;
  const allActive = currentFilterType === FilterType.ALL ? 'main-navigation__item--active' : '';
  const watchlistActive = currentFilterType === FilterType.WATCHLIST ? 'main-navigation__item--active' : '';
  const historyActive = currentFilterType === FilterType.HISTORY ? 'main-navigation__item--active' : '';
  const favoritesActive = currentFilterType === FilterType.FAVORITES ? 'main-navigation__item--active' : '';
  const statsActive = currentFilterType === FilterType.STATS ? 'main-navigation__additional--active' : '';
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item ${allActive}" data-filter-type="${FilterType.ALL}">All movies</a>
      <a href="#watchlist" class="main-navigation__item ${watchlistActive}" data-filter-type="${FilterType.WATCHLIST}">Watchlist <span class="main-navigation__item-count">${watchList}</span></a>
      <a href="#history" class="main-navigation__item ${historyActive}" data-filter-type="${FilterType.HISTORY}">History <span class="main-navigation__item-count">${history}</span></a>
      <a href="#favorites" class="main-navigation__item ${favoritesActive}" data-filter-type="${FilterType.FAVORITES}">Favorites <span class="main-navigation__item-count">${favorites}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional ${statsActive}" data-filter-type="${FilterType.STATS}">Stats</a>
  </nav>`;
};

export default class Nav extends AbstractView {
  constructor(stat, currentFilterType) {
    super();
    this._stat = stat;
    this._currentFilterType = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createNav(this._stat, this._currentFilterType);
  }

  restoreHandlers() {
    this.setFilterTypeChangeHandler(this._callback.filterTypeChange);
  }

  _filterTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }
    evt.preventDefault();
    this._callback.filterTypeChange(evt.target.dataset.filterType);
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}
