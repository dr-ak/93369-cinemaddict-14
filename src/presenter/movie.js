import FilmCard from '../view/film-card.js';
import Popup from '../view/popup.js';
import {UpdateType, UserAction} from '../const.js';
import {render, replace, remove} from '../utils/render.js';

export default class Movie {
  constructor(filmsListContainer, popupContainer, changeData, showExtraData, commentAction) {
    this._filmsListContainer = filmsListContainer;
    this._popupContainer = popupContainer;
    this._changeData = changeData;
    this._showExtraData = showExtraData;
    this._commentAction = commentAction;

    this._filmCard = null;
    this._filmCardComponent = null;
    this._popupComponent = null;

    this._handleCardClick = this._handleCardClick.bind(this);
    this._handleAddToWatchListClick = this._handleAddToWatchListClick.bind(this);
    this._handleMarkAsWatchedClick = this._handleMarkAsWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleSaveComment = this._handleSaveComment.bind(this);
    this._handleCardCloseBtnClick = this._handleCardCloseBtnClick.bind(this);
  }

  init(filmCard, popupState = null) {
    this._filmCard = filmCard;
    const prevFilmCardComponent = this._filmCardComponent;

    this._filmCardComponent = new FilmCard(filmCard);
    this._filmCardComponent.setCardClickHandler(this._handleCardClick);
    this._filmCardComponent.setAddToWatchListHandler(this._handleAddToWatchListClick);
    this._filmCardComponent.setMarkAsWatchedHandler(this._handleMarkAsWatchedClick);
    this._filmCardComponent.setFavoriteClickHandler(this._handleFavoriteClick);

    if (!prevFilmCardComponent) {
      render(this._filmsListContainer, this._filmCardComponent);
    } else {
      replace(this._filmCardComponent, prevFilmCardComponent);
      remove(prevFilmCardComponent);
    }

    if (this._popupComponent) {
      popupState = this._popupComponent.getState();
      this.resetPopup();
    }

    if (popupState && popupState.filmId === this._filmCard.id) {
      this._showPopup();
      this._popupComponent.setState(popupState);
    }
  }

  resetPopup() {
    if (this._popupComponent) {
      const popupState = this._popupComponent.getState();
      this._popupComponent.close();
      remove(this._popupComponent);
      this._popupComponent = null;
      return popupState;
    }
    return null;
  }

  destroy() {
    remove(this._filmCardComponent);
    return this.resetPopup();
  }

  _showPopup() {
    this._commentAction(UserAction.GET_COMMENTS, this._filmCard)
      .then((commentsData) => this._createPopup(commentsData))
      .catch(() => this._createPopup([]));
  }

  _createPopup(commentsData) {
    this._showExtraData();
    this._popupComponent = new Popup(this._filmCard, this._popupContainer, commentsData);
    this._popupComponent.setAddToWatchListHandler(this._handleAddToWatchListClick);
    this._popupComponent.setMarkAsWatchedHandler(this._handleMarkAsWatchedClick);
    this._popupComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._popupComponent.setEscKeyDownHandler(this._escKeyDownHandler);
    this._popupComponent.setCardCloseBtnClickHandler(this._handleCardCloseBtnClick);
    this._popupComponent.setDeleteCommentClickHandler(this._handleDeleteCommentClick);
    this._popupComponent.setSaveCommentHendler(this._handleSaveComment);

    render(this._popupContainer, this._popupComponent);
    this._popupComponent.show();
  }

  _handleCardClick() {
    this._showPopup();
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

  _handleDeleteCommentClick(data) {
    this._commentAction(UserAction.DELETE_COMMENT, data);
  }

  _handleSaveComment(data) {
    this._commentAction(UserAction.ADD_COMMENT, data);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this.resetPopup();
    }
  }

  _handleCardCloseBtnClick() {
    this.resetPopup();
  }

}
