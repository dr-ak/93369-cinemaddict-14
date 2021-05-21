import Movie from './movie.js';
import Films from '../view/films.js';
import FilmsList from '../view/films-list.js';
import FilmsListContainer from '../view/films-list-container.js';
import ShowMoreButton from '../view/show-more-button.js';
import Sort from '../view/sort.js';

import {filter} from '../utils/filter.js';
import {render, remove} from '../utils/render.js';
import {sortByDate} from '../utils/film.js';
import {SortType, UpdateType, UserAction} from '../const.js';

const FILM_COUNT_PER_STEP = 5;
const FILM_EXTRA_COUNT = 2;
const TOP_RATED_LIST_TITLE = 'Top rated';
const TOP_RATED_LIST_ID = 'top-rated';
const MOST_COMMENTED_LIST_TITLE = 'Most commented';
const MOST_COMMENTED_LIST_ID = 'most-commented';
const EMPTY_LIST_TITLE = 'There are no movies in our database';

export default class MovieList {
  constructor(filmsContainer, popupContainer, moviesModel, filterModel, api) {
    this._filmsContainer = filmsContainer;
    this._popupContainer = popupContainer;
    this._moviesModel = moviesModel;
    this._filterModel = filterModel;
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
    this._popupActiveState = null;


    this._filmsCompanent = new Films();
    this._filmsListCompanent = new FilmsList();
    this._filmsListContainerCompanent = new FilmsListContainer();
    this._noFilmsListComponent = new FilmsList(EMPTY_LIST_TITLE);
    this._topRatedFilmsListComponent = new FilmsList(TOP_RATED_LIST_TITLE, TOP_RATED_LIST_ID);
    this._topRatedFilmsListContainerComponent = new FilmsListContainer();
    this._mostCommentedFilmsListComponent = new FilmsList(MOST_COMMENTED_LIST_TITLE, MOST_COMMENTED_LIST_ID);
    this._mostCommentedFilmsListContainerComponent = new FilmsListContainer();


    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowExtraData = this._handleShowExtraData.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
    this._handleCommentAction = this._handleCommentAction.bind(this);
  }

  init() {
    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderFilmsBoard();
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

  _clearFilmsBoard({resetRenderedFilmsCount = false, resetSortType = false} = {}) {
    const filmCardsCount = this._getMovies().length;
    this._popupActiveState = null;
    Object.values(this._presenters).forEach((presenters) => {
      Object
        .values(presenters)
        .forEach((presenter) => {
          if (!this._popupActiveState) {
            this._popupActiveState = presenter.destroy();
          }
          presenter.destroy();
        });
      presenters = {};
    });

    remove(this._sortComponent);
    remove(this._filmsCompanent);
    remove(this._filmsListCompanent);
    remove(this._filmsListContainerCompanent);
    remove(this._noFilmsListComponent);

    if(resetRenderedFilmsCount) {
      this._renderedFilmsCount = FILM_COUNT_PER_STEP;
    } else {
      this._renderedFilmsCount = Math.min(filmCardsCount, this._renderedFilmsCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _refreshFilmsBoard({resetRenderedFilmsCount = false, resetSortType = false} = {}) {
    const scroll = window.pageYOffset;
    this._clearFilmsBoard({resetRenderedFilmsCount: resetRenderedFilmsCount, resetSortType: resetSortType});
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
    if (filmCards) {
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
    if (filmCards) {
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
      this._popupContainer,
      this._handleFilmChange,
      this._handleShowExtraData,
      this._handleCommentAction,
    );
    moviePresenter.init(filmCard, this._popupActiveState);
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

  _renderFilmsBoard() {
    if (!this._getMovies().length) {
      this._renderNoFilms();
      return;
    }
    this._renderSort();
    this._renderFilms();
  }

  _handleShowExtraData () {
    Object.values(this._presenters).forEach((presenters) => {
      Object
        .values(presenters)
        .forEach((presenter) => presenter.resetPopup());
    });
  }

  _handleFilmChange(updateType, updatedFilm) {
    this._moviesModel.updateFilmCard(updateType, updatedFilm);
  }

  _handleCommentAction(userAction, data) {
    this._api.setFilmCards(this._moviesModel.getMovies());
    switch (userAction) {
      case UserAction.GET_COMMENTS:
        return this._api.getComments(data.id);
      case UserAction.DELETE_COMMENT:
        this._api.deleteComment(data.commentId);
        this._moviesModel.setMovies(this._api.getFilmCards());
        this._refreshFilmsBoard();
        return true;
      case UserAction.ADD_COMMENT:
        this._api.addComment(data.comment, data.filmId);
        this._moviesModel.setMovies(this._api.getFilmCards());
        this._refreshFilmsBoard();
        return true;
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
}
