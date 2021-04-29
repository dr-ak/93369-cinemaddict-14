import FilmCard from '../view/film-card.js';
import Popup from '../view/popup.js';
import {render, replace, remove} from '../utils/render.js';

const PopupStates = {
  OPENED: 'OPENED',
  CLOSED: 'CLOSED',
};

export default class Movie {
  constructor(filmsListContainer, popupContainer, changeData, showExtraData) {
    this._filmsListContainer = filmsListContainer;
    this._popupContainer = popupContainer;
    this._changeData = changeData;
    this._showExtraData = showExtraData;

    this._filmCard = null;
    this._filmCardComponent = null;
    this._popupComponent = null;
    this._popupState = PopupStates.CLOSED;

    this._handleCardClick = this._handleCardClick.bind(this);
    this._handleAddToWatchListClick = this._handleAddToWatchListClick.bind(this);
    this._handleMarkAsWatchedClick = this._handleMarkAsWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleCardCloseBtnClick = this._handleCardCloseBtnClick.bind(this);
  }

  init(filmCard, popupComponent = null) {
    this._filmCard = filmCard;
    const prevFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCard(filmCard);
    this._filmCardComponent.setCardClickHandler(this._handleCardClick);
    this._filmCardComponent.setAddToWatchListHandler(this._handleAddToWatchListClick);
    this._filmCardComponent.setMarkAsWatchedHandler(this._handleMarkAsWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (popupComponent) {
      this._popupComponent = popupComponent;
    } else {
      this._popupComponent = new Popup(filmCard, this._popupContainer);
      this._popupComponent.setAddToWatchListHandler(this._handleAddToWatchListClick);
      this._popupComponent.setMarkAsWatchedHandler(this._handleMarkAsWatchedClick);
      this._popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
      this._popupComponent.setEscKeyDownHandler(this._escKeyDownHandler);
      this._popupComponent.setCardCloseBtnClickHandler(this._handleCardCloseBtnClick);
    }
    if (!prevFilmCardComponent) {
      render(this._filmsListContainer, this._filmCardComponent);
    } else {
      replace(this._filmCardComponent, prevFilmCardComponent);
      remove(prevFilmCardComponent);
    }
  }

  getCurrentPopup() {
    if (this._popupState === PopupStates.OPENED) {
      return this._popupComponent;
    }
    return null;
  }

  resetPopup() {
    if (this._popupState === PopupStates.OPENED) {
      this._popupComponent.close();
      this._popupState = PopupStates.CLOSED;
    }
  }

  _handleCardClick() {
    this._showExtraData();
    this._popupComponent.show();
    this._popupState = PopupStates.OPENED;
  }

  _handleAddToWatchListClick() {
    this._changeData(
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
      Object.assign(
        {},
        this._filmCard,
        {
          alreadyWatched: !this._filmCard.alreadyWatched,
        },
      ),
    );
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._filmCard,
        {
          favorite: !this._filmCard.favorite,
        },
      ),
    );
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._popupComponent.close();
      this._popupState = PopupStates.CLOSED;
    }
  }

  _handleCardCloseBtnClick() {
    this._popupComponent.close();
    this._popupState = PopupStates.CLOSED;
  }

}
