import {createElement} from '../utils.js';
import {extractYearFromDate} from '../utils.js';

export const createFilmCard = (filmCard) => {
  const {title, totalRating, poster, date, runtime, genres, description, comments, watchList, alreadyWatched, favorite} = filmCard;
  const yearFromDate = extractYearFromDate(date);
  const filmGenre = genres[0];
  const cutDescription = description.length > 140
    ? description.substr(0, 139) + '...'
    : description;
  const countComments = comments.length;
  const addTowatchListClassName = watchList
    ? 'film-card__controls-item--active'
    : '';
  const markAsWatchedClassName = alreadyWatched
    ? 'film-card__controls-item--active'
    : '';
  const markAsFavoriteClassName = favorite
    ? 'film-card__controls-item--active'
    : '';
  return `<article class="film-card">
    <h3 class="film-card__title">${title}</h3>
    <p class="film-card__rating">${totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${yearFromDate}</span>
      <span class="film-card__duration">${runtime}</span>
      <span class="film-card__genre">${filmGenre}</span>
    </p>
    <img src="${poster}" alt="" class="film-card__poster">
    <p class="film-card__description">
      ${cutDescription}
    </p>
    <a class="film-card__comments">${countComments} comments</a>
    <div class="film-card__controls">
      <button class="film-card__controls-item button film-card__controls-item--add-to-watchlist ${addTowatchListClassName}" type="button">Add to watchList</button>
      <button class="film-card__controls-item button film-card__controls-item--mark-as-watched ${markAsWatchedClassName}" type="button">Mark as watched</button>
      <button class="film-card__controls-item button film-card__controls-item--favorite ${markAsFavoriteClassName}" type="button">Mark as favorite</button>
    </div>
  </article>`;
};

export default class FilmCard {
  constructor(filmCard) {
    this._filmCard = filmCard;
    this._element = null;
  }

  getTemplate() {
    return createFilmCard(this._filmCard);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
