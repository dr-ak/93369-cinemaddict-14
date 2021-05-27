import Movie from './movie.js';
import UserRank from '../view/user-rank.js';
import Films from '../view/films.js';
import Popup from '../view/popup.js';
import FilmsList from '../view/films-list.js';
import FilmsListContainer from '../view/films-list-container.js';
import ShowMoreButton from '../view/show-more-button.js';
import Loading from '../view/loading.js';
import Sort from '../view/sort.js';

import {filter} from '../utils/filter.js';
import {render, remove} from '../utils/render.js';
import {sortByDate} from '../utils/film.js';
import {getUserRank} from '../utils/user.js';
import {SortType, UpdateType, UserAction, Key} from '../const.js';

const FILM_COUNT_PER_STEP = 5;
const FILM_EXTRA_COUNT = 2;
const TOP_RATED_LIST_TITLE = 'Top rated';
const TOP_RATED_LIST_ID = 'top-rated';
const MOST_COMMENTED_LIST_TITLE = 'Most commented';
const MOST_COMMENTED_LIST_ID = 'most-commented';
const EMPTY_LIST_TITLE = 'There are no movies in our database';

export default class MovieList {
  constructor(userContainer, filmsContainer, popupContainer, moviesModel, filterModel, api) {
    this._userContainer = userContainer;
    this._filmsContainer = filmsContainer;
    this._popupContainer = popupContainer;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
    this._isLoading = true;
    this._api = api;

    this._renderedFilmsCount = FILM_COUNT_PER_STEP;
    this._presenters = {
      moviesPresenter: {},
      topRatedMoviesPresenter: {},
      mostCommentedMoviesPresenter: {},
    };

    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = null;
    this._showMoreButtonComponent = null;
    this._popupComponent = null;
    this._popupActiveState = null;
    this._userRankCompanent = null;

    this._filmsCompanent = new Films();
    this._filmsListCompanent = new FilmsList();
    this._filmsListContainerCompanent = new FilmsListContainer();
    this._noFilmsListComponent = new FilmsList(EMPTY_LIST_TITLE);
    this._topRatedFilmsListComponent = new FilmsList(TOP_RATED_LIST_TITLE, TOP_RATED_LIST_ID);
    this._topRatedFilmsListContainerComponent = new FilmsListContainer();
    this._mostCommentedFilmsListComponent = new FilmsList(MOST_COMMENTED_LIST_TITLE, MOST_COMMENTED_LIST_ID);
    this._mostCommentedFilmsListContainerComponent = new FilmsListContainer();
    this._loadingComponent = new Loading();


    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._handleShowPopup = this._handleShowPopup.bind(this);
    this._handleAddToWatchListClick = this._handleAddToWatchListClick.bind(this);
    this._handleMarkAsWatchedClick = this._handleMarkAsWatchedClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleDeleteCommentClick = this._handleDeleteCommentClick.bind(this);
    this._handleSaveComment = this._handleSaveComment.bind(this);
    this._handleCardCloseBtnClick = this._handleCardCloseBtnClick.bind(this);
  }

  init() {
    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderFilmsBoard();
  }

  show() {
    this._sortComponent.show();
    this._filmsCompanent.show();
  }

  hide() {
    this._sortComponent.hide();
    this._filmsCompanent.hide();
  }

  _resetPopup() {
    if (this._popupComponent) {
      const popupState = this._popupComponent.getState();
      this._popupComponent.close();
      remove(this._popupComponent);
      this._popupComponent = null;
      return popupState;
    }
    return null;
  }

  _createPopup(filmCardId, commentsData) {
    const filmCard = this._moviesModel.getMovies().find((filmCard) => filmCard.id === filmCardId);
    this._popupComponent = new Popup(filmCard, this._popupContainer, commentsData);
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


  _getMovies() {
    const filterType = this._filterModel.getFilter();
    const filmCards = this._moviesModel.getMovies();
    const filteredFilmCards = filter[filterType](filmCards);

    switch (this._currentSortType) {
      case SortType.BY_DATE:
        return filteredFilmCards.sort(sortByDate);
      case SortType.BY_RATING:
        return filteredFilmCards.sort((first, second) => second.totalRating - first.totalRating);
    }

    return filteredFilmCards;
  }

  _getMostCommentedList() {
    return this._moviesModel.getMovies()
      .sort((first, second) => second.comments.length - first.comments.length)
      .slice(0, FILM_EXTRA_COUNT)
      .filter((film) => film.comments.length);
  }

  _getTopRatedList() {
    return this._moviesModel.getMovies()
      .sort((first, second) => second.totalRating - first.totalRating)
      .slice(0, FILM_EXTRA_COUNT)
      .filter((film) => film.totalRating);
  }

  _clearFilmsBoard({resetRenderedFilmsCount = false, resetSortType = false, commentsData = null} = {}) {
    const filmCardsCount = this._getMovies().length;
    this._popupActiveState = this._resetPopup();
    Object.values(this._presenters).forEach((presenters) => {
      Object
        .values(presenters)
        .forEach((presenter) => presenter.destroy());
      presenters = {};
    });

    if (this._popupActiveState && commentsData) {
      this._popupActiveState.commentsData = commentsData;
    }

    remove(this._userRankCompanent);
    remove(this._sortComponent);
    remove(this._filmsCompanent);
    remove(this._filmsListCompanent);
    remove(this._filmsListContainerCompanent);
    remove(this._noFilmsListComponent);

    if(resetRenderedFilmsCount) {
      this._renderedFilmsCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderedFilmsCount = Math.min(filmCardsCount, Math.max(this._renderedFilmsCount, FILM_COUNT_PER_STEP));
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _refreshFilmsBoard({resetRenderedFilmsCount = false, resetSortType = false, commentsData = null} = {}) {
    const scroll = window.pageYOffset;
    this._clearFilmsBoard({resetRenderedFilmsCount: resetRenderedFilmsCount, resetSortType: resetSortType, commentsData: commentsData});
    this._renderFilmsBoard();
    window.scrollTo(0, scroll);
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButton();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
    render(this._filmsListCompanent, this._showMoreButtonComponent);
  }

  _renderNoFilms() {
    render(this._filmsContainer, this._filmsCompanent);
    render(this._filmsCompanent, this._noFilmsListComponent);
    this._renderTopRatedList();
    this._renderMostCommentedList();
  }

  _renderFilms() {
    render(this._filmsContainer, this._filmsCompanent);
    render(this._filmsCompanent, this._filmsListCompanent);
    render(this._filmsListCompanent, this._filmsListContainerCompanent);
    this._renderFilmsList(0, Math.min(this._getMovies().length, this._renderedFilmsCount));
    if (this._getMovies().length > this._renderedFilmsCount) {
      this._renderShowMoreButton();
    }

    this._renderTopRatedList();
    this._renderMostCommentedList();
  }

  _renderTopRatedList() {
    const filmCards = this._getTopRatedList();
    if (filmCards.length) {
      render(this._filmsCompanent, this._topRatedFilmsListComponent);
      render(this._topRatedFilmsListComponent, this._topRatedFilmsListContainerComponent);
      filmCards.forEach((filmCard) => this._renderFilmCard(
        filmCard,
        this._topRatedFilmsListContainerComponent,
        this._presenters.topRatedMoviesPresenter,
      ));
    }
  }

  _renderMostCommentedList() {
    const filmCards = this._getMostCommentedList();
    if (filmCards.length) {
      render(this._filmsCompanent, this._mostCommentedFilmsListComponent);
      render(this._mostCommentedFilmsListComponent, this._mostCommentedFilmsListContainerComponent);
      filmCards.forEach((filmCard) => this._renderFilmCard(
        filmCard,
        this._mostCommentedFilmsListContainerComponent,
        this._presenters.mostCommentedMoviesPresenter,
      ));
    }
  }

  _renderFilmsList(from, to) {
    this._getMovies()
      .slice(from, to)
      .forEach((filmCard) => this._renderFilmCard(filmCard));
  }

  _renderFilmCard(filmCard, container = this._filmsListContainerCompanent, presenter = this._presenters.moviesPresenter) {
    const moviePresenter = new Movie(
      container,
      this._handleShowPopup,
      this._handleFilmChange,
    );
    moviePresenter.init(filmCard);
    presenter[filmCard.id] = moviePresenter;
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new Sort(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._filmsContainer, this._sortComponent);
  }

  _renderLoading() {
    render(this._filmsContainer, this._loadingComponent);
  }

  _renderPopup() {
    if (this._popupActiveState) {
      this._createPopup(this._popupActiveState.filmId, this._popupActiveState.commentsData);
      this._popupComponent.setState(this._popupActiveState);
    }
  }

  _renderUserRank() {
    this._userRankCompanent = new UserRank(getUserRank(this._moviesModel.getMovies()));
    render(this._userContainer, this._userRankCompanent);
  }

  _renderFilmsBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    this._renderUserRank();

    if (this._popupActiveState) {
      this._renderPopup();
    }

    if (!this._getMovies().length) {
      this._renderNoFilms();
      return;
    }

    this._renderSort();
    this._renderFilms();
  }

  _handleFilmChange(updateType, updatedFilm) {
    this._api.updateFilmCard(updatedFilm)
      .then((filmCard) => {
        this._moviesModel.updateFilmCard(updateType, filmCard);
      });
  }

  _commentAction(userAction, data) {
    switch (userAction) {
      case UserAction.GET_COMMENTS:
        return this._api.getComments(data.id);
      case UserAction.DELETE_COMMENT:
        return this._api.deleteComment(data.commentId)
          .then(() => {
            return Promise.all([this._api.getComments(data.filmId), this._api.getFilmCards()])
              .then(([comments, filmCards]) => {
                this._moviesModel.setMovies(UpdateType.DEFAULT, filmCards);
                this._refreshFilmsBoard({commentsData: comments});
                return true;
              })
              .catch(() => false);
          })
          .catch(() => false);
      case UserAction.ADD_COMMENT:
        return this._api.addComment(data.comment, data.filmId)
          .then((data) => {
            return Promise.all([data.comments, this._api.getFilmCards()])
              .then(([comments, filmCards]) => {
                this._moviesModel.setMovies(UpdateType.DEFAULT, filmCards);
                this._refreshFilmsBoard({commentsData: comments});
                return true;
              })
              .catch(() => false);
          })
          .catch(() => false);
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._presenters.moviesPresenter[data.id].init(data);
        break;
      case UpdateType.MINOR:
        this._refreshFilmsBoard();
        break;
      case UpdateType.MAJOR:
        this._refreshFilmsBoard({resetRenderedFilmsCount: true, resetSortType: true});
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderFilmsBoard();
        break;
      default:
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearFilmsBoard();
    this._renderFilmsBoard();
  }

  _handleShowMoreButtonClick() {
    this._renderFilmsList(this._renderedFilmsCount, this._renderedFilmsCount += FILM_COUNT_PER_STEP);

    if (this._renderedFilmsCount >= this._getMovies().length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _handleAddToWatchListClick() {
    const filmCard = this._popupComponent.getFilmCard();
    this._handleFilmChange(
      UpdateType.MINOR,
      Object.assign(
        {},
        filmCard,
        {
          watchList: !filmCard.watchList,
        },
      ),
    );
  }

  _handleMarkAsWatchedClick() {
    const filmCard = this._popupComponent.getFilmCard();
    this._handleFilmChange(
      UpdateType.MINOR,
      Object.assign(
        {},
        filmCard,
        {
          watchingDate: filmCard.watchingDate ? null : new Date(),
          alreadyWatched: !filmCard.alreadyWatched,
        },
      ),
    );
  }

  _handleFavoriteClick() {
    const filmCard = this._popupComponent.getFilmCard();
    this._handleFilmChange(
      UpdateType.MINOR,
      Object.assign(
        {},
        filmCard,
        {
          favorite: !filmCard.favorite,
        },
      ),
    );
  }

  _handleShowPopup(filmCard) {
    this._resetPopup();

    this._commentAction(UserAction.GET_COMMENTS, filmCard)
      .then((commentsData) => this._createPopup(filmCard.id, commentsData))
      .catch(() => this._createPopup(filmCard.id, []));
  }

  _handleDeleteCommentClick(data) {
    this._commentAction(UserAction.DELETE_COMMENT, data)
      .then((success) => {
        if (!success) {
          this._popupComponent.shakeComments(() => {
            this._popupComponent.resetDeletingComments();
            this._popupComponent.updateData({
              isDisabled: false,
            });
          });
        }
      });
  }

  _handleSaveComment(data) {
    this._commentAction(UserAction.ADD_COMMENT, data)
      .then((success) => {
        if (!success) {
          this._popupComponent.shake(() =>
            this._popupComponent.updateData({isDisabled: false}));
        }
      });
  }

  _handleCardCloseBtnClick() {
    this._resetPopup();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === Key.ESCAPE || evt.key === Key.ESC) {
      evt.preventDefault();
      this._resetPopup();
    }
  }
}
