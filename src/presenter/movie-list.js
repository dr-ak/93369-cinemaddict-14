import Movie from './movie.js';
import Films from '../view/films.js';
import FilmsList from '../view/films-list.js';
import FilmsListContainer from '../view/films-list-container.js';
import ShowMoreButton from '../view/show-more-button.js';
import Sort from '../view/sort.js';

import {updateItem} from '../utils/common.js';
import {render, remove} from '../utils/render.js';
import {sortByDate} from '../utils/film.js';
import {SortType} from '../const.js';

const FILM_COUNT_PER_STEP = 5;
const FILM_EXTRA_COUNT = 2;
const TOP_RATED_LIST_TITLE = 'Top rated';
const TOP_RATED_LIST_ID = 'top-rated';
const MOST_COMMENTED_LIST_TITLE = 'Most commented';
const MOST_COMMENTED_LIST_ID = 'most-commented';
const EMPTY_LIST_TITLE = 'There are no movies in our database';

export default class MovieList {
  constructor(filmsContainer, popupContainer) {
    this._filmsContainer = filmsContainer;
    this._popupContainer = popupContainer;
    this._renderFilmsCount = FILM_COUNT_PER_STEP;
    this._moviesPresenter = {};
    this._topRatedMoviesPresenter = {};
    this._mostCommentedMoviesPresenter = {};
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = new Sort();
    this._filmsCompanent = new Films();
    this._filmsListCompanent = new FilmsList();
    this._filmsListContainerCompanent = new FilmsListContainer();
    this._noFilmsListComponent = new FilmsList(EMPTY_LIST_TITLE);
    this._topRatedFilmsListComponent = new FilmsList(TOP_RATED_LIST_TITLE, TOP_RATED_LIST_ID);
    this._topRatedFilmsListContainerComponent = new FilmsListContainer();
    this._mostCommentedFilmsListComponent = new FilmsList(MOST_COMMENTED_LIST_TITLE, MOST_COMMENTED_LIST_ID);
    this._mostCommentedFilmsListContainerComponent = new FilmsListContainer();
    this._showMoreButtonComponent = new ShowMoreButton();

    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleFilmChange = this._handleFilmChange.bind(this);
    this._handleShowExtraData = this._handleShowExtraData.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(filmCards) {
    this._filmCards = filmCards.slice();
    this._sourcedFilmCards = filmCards.slice();
    this._topRatedFilmCards = filmCards
      .slice()
      .sort((first, second) => second.totalRating - first.totalRating)
      .slice(0, FILM_EXTRA_COUNT)
      .filter((film) => film.totalRating);
    this._mostCommentedFilmCards = filmCards
      .slice()
      .sort((first, second) => second.comments.length - first.comments.length)
      .slice(0, FILM_EXTRA_COUNT)
      .filter((film) => film.comments.length);

    this._renderFilmsBoard();
  }

  _sortFilms(sortType) {
    switch (sortType) {
      case SortType.BY_DATE:
        this._filmCards.sort(sortByDate);
        break;
      case SortType.BY_RARING:
        this._filmCards.sort((first, second) => second.totalRating - first.totalRating);
        break;
      default:
        this._filmCards = this._sourcedFilmCards.slice();
    }
    this._currentSortType = sortType;
  }

  _clearFilmsList() {
    Object
      .values(this._moviesPresenter)
      .forEach((presenter) => presenter.destroy());
    this._moviesPresenter = {};
    this._renderFilmsCount = FILM_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);

    Object
      .values(this._topRatedMoviesPresenter)
      .forEach((presenter) => presenter.destroy());

    Object
      .values(this._mostCommentedMoviesPresenter)
      .forEach((presenter) => presenter.destroy());
  }

  _renderShowMoreButton() {
    render(this._filmsListCompanent, this._showMoreButtonComponent);
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderNoFilms() {
    render(this._filmsContainer, this._filmsCompanent);
    render(this._filmsCompanent, this._noFilmsListComponent);
  }

  _renderFilms() {
    render(this._filmsContainer, this._filmsCompanent);
    render(this._filmsCompanent, this._filmsListCompanent);
    render(this._filmsListCompanent, this._filmsListContainerCompanent);
    this._renderFilmsList(0, Math.min(this._filmCards.length, FILM_COUNT_PER_STEP));

    if (this._filmCards.length > FILM_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }

    this._renderTopRatedList();
    this._renderMostCommentedList();
  }

  _renderTopRatedList() {
    if (this._topRatedFilmCards.length) {
      render(this._filmsCompanent, this._topRatedFilmsListComponent);
      render(this._topRatedFilmsListComponent, this._topRatedFilmsListContainerComponent);
      this._topRatedFilmCards.forEach((filmCard) => this._renderFilmCard(
        filmCard,
        this._topRatedFilmsListContainerComponent,
        this._topRatedMoviesPresenter,
      ));
    }
  }

  _renderMostCommentedList() {
    if (this._mostCommentedFilmCards.length) {
      render(this._filmsCompanent, this._mostCommentedFilmsListComponent);
      render(this._mostCommentedFilmsListComponent, this._mostCommentedFilmsListContainerComponent);
      this._mostCommentedFilmCards.forEach((filmCard) => this._renderFilmCard(
        filmCard,
        this._mostCommentedFilmsListContainerComponent,
        this._mostCommentedMoviesPresenter,
      ));
    }
  }

  _renderFilmsList(from, to) {
    this._filmCards
      .slice(from, to)
      .forEach((filmCard) => this._renderFilmCard(filmCard));
  }

  _renderFilmCard(filmCard, container = this._filmsListContainerCompanent, presenter = this._moviesPresenter) {
    const moviePresenter = new Movie(
      container,
      this._popupContainer,
      this._handleFilmChange,
      this._handleShowExtraData,
    );
    moviePresenter.init(filmCard);
    presenter[filmCard.id] = moviePresenter;
  }

  _renderSort() {
    render(this._filmsContainer, this._sortComponent);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _renderFilmsBoard() {
    if (!this._filmCards.length) {
      this._renderNoFilms();
      return;
    }
    this._renderSort();
    this._renderFilms();
  }

  _handleShowExtraData () {
    Object
      .values(this._moviesPresenter)
      .forEach((presenter) => presenter.resetPopup());

    Object
      .values(this._topRatedMoviesPresenter)
      .forEach((presenter) => presenter.resetPopup());

    Object
      .values(this._mostCommentedMoviesPresenter)
      .forEach((presenter) => presenter.resetPopup());
  }

  _handleFilmChange(updatedFilm) {
    this._filmCards = updateItem(this._filmCards, updatedFilm);
    this._sourcedFilmCards = updateItem(this._sourcedFilmCards, updatedFilm);
    if (Object.keys(this._moviesPresenter).includes(updatedFilm.id)) {
      const popup = this._moviesPresenter[updatedFilm.id].getCurrentPopup();
      this._moviesPresenter[updatedFilm.id].init(updatedFilm, popup);
    }
    if (Object.keys(this._topRatedMoviesPresenter).includes(updatedFilm.id)) {
      const popup = this._topRatedMoviesPresenter[updatedFilm.id].getCurrentPopup();
      this._topRatedMoviesPresenter[updatedFilm.id].init(updatedFilm, popup);
    }
    if (Object.keys(this._mostCommentedMoviesPresenter).includes(updatedFilm.id)) {
      const popup = this._mostCommentedMoviesPresenter[updatedFilm.id].getCurrentPopup();
      this._mostCommentedMoviesPresenter[updatedFilm.id].init(updatedFilm, popup);
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }
    this._sortFilms(sortType);
    this._clearFilmsList();
    this._renderFilms();
  }

  _handleShowMoreButtonClick() {
    this._renderFilmsList(this._renderFilmsCount, this._renderFilmsCount += FILM_COUNT_PER_STEP);

    if (this._renderFilmsCount >= this._filmCards.length) {
      remove(this._showMoreButtonComponent);
    }
  }
}
