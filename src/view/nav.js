import AbstractView from './abstract.js';

export const createNav = (stat) => {
  const {watchList, history, favorites} = stat;
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchList}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${history}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favorites}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>`;
};

export default class Nav extends AbstractView {
  constructor(stat) {
    super();
    this._stat = stat;
  }

  getTemplate() {
    return createNav(this._stat);
  }
}
