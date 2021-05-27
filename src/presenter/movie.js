import FilmCard from '../view/film-card.js';
import {UpdateType} from '../const.js';
import {render, replace, remove} from '../utils/render.js';

export default class Movie {
  constructor(filmsListContainer, showPopup, changeData) {
    this._filmsListContainer = filmsListContainer;
    this._showPopup = showPopup;
    this._changeData = changeData;

    this._filmCard = null;
    this._filmCardComponent = null;

    this._handleCardClick = this._handleCardClick.bind(this);
    this._handleAddToWatchListClick = this._handleAddToWatchListClick.bind(this);
    this._handleMarkAsWatchedClick = this._handleMarkAsWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
  }

  init(filmCard) {
    this._filmCard = filmCard;

    const prevFilmCardComponent = this._filmCardComponent;
    this._filmCardComponent = new FilmCard(filmCard);
    this._filmCardComponent.setCardClickHandler(this._handleCardClick);
    this._filmCardComponent.setAddToWatchListHandler(this._handleAddToWatchListClick);
    this._filmCardComponent.setMarkAsWatchedHandler(this._handleMarkAsWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (this._filmsListContainer) {
      if (!prevFilmCardComponent) {
        render(this._filmsListContainer, this._filmCardComponent);
      } else {
        replace(this._filmCardComponent, prevFilmCardComponent);
        remove(prevFilmCardComponent);
      }
    }
  }

  destroy() {
    remove(this._filmCardComponent);
  }

  _handleCardClick() {
    this._showPopup(this._filmCard);
  }

  _handleAddToWatchListClick() {
    this._changeData(
      UpdateType.MINOR,
      Object.assign(
        {},
        this._filmCard,
        {
          watchList: !this._filmCard.watchList,
        },
      ),
    );
  }

  _handleMarkAsWatchedClick() {
    this._changeData(
      UpdateType.MINOR,
      Object.assign(
        {},
        this._filmCard,
        {
          watchingDate: this._filmCard.watchingDate ? null : new Date(),
          alreadyWatched: !this._filmCard.alreadyWatched,
        },
      ),
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      UpdateType.MINOR,
      Object.assign(
        {},
        this._filmCard,
        {
          favorite: !this._filmCard.favorite,
        },
      ),
    );
  }
}
