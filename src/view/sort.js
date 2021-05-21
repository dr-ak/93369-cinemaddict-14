import AbstractView from './abstract.js';
import {SortType} from '../const.js';

export const createSort = (currentSortType) => {
  const defaultActive = currentSortType === SortType.DEFAULT ? 'sort__button--active' : '';
  const byDateActive = currentSortType === SortType.BY_DATE ? 'sort__button--active' : '';
  const byRatingActive = currentSortType === SortType.BY_RATING ? 'sort__button--active' : '';
  return `<ul class="sort">
    <li><a href="#" class="sort__button ${defaultActive}" data-sort-type="${SortType.DEFAULT}">Sort by default</a></li>
    <li><a href="#" class="sort__button ${byDateActive}" data-sort-type="${SortType.BY_DATE}">Sort by date</a></li>
    <li><a href="#" class="sort__button ${byRatingActive}" data-sort-type="${SortType.BY_RATING}">Sort by rating</a></li>
  </ul>`;
};

export default class Sort extends AbstractView {
  constructor(currentSortType) {
    super();

    this._currentSortType = currentSortType;

    this._sortTypeChangeHandler = this._sortTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createSort(this._currentSortType);
  }

  _sortTypeChangeHandler(evt) {
    if (evt.target.tagName !== 'A') {
      return;
    }

    evt.preventDefault();
    this._callback.sortTypeChange(evt.target.dataset.sortType);

    this.getElement().querySelector('.sort__button--active').classList.remove('sort__button--active');
    evt.target.classList.add('sort__button--active');
  }

  setSortTypeChangeHandler(callback) {
    this._callback.sortTypeChange = callback;
    this.getElement().addEventListener('click', this._sortTypeChangeHandler);
  }
}
