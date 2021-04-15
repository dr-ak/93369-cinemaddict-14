import FilmCard from './view/film-card.js';
import FilmsListContainer from './view/films-list-container.js';
import FilmsList from './view/films-list.js';
import Films from './view/films.js';
import FooterStatistics from './view/footer-statistics.js';
import Nav from './view/nav.js';
import ShowMoreButton from './view/show-more-button.js';
import Sort from './view/sort.js';
import UserRank from './view/user-rank.js';
import Popup from './view/popup.js';

import {generateFilm} from './mock/film.js';
import {generateStat} from './mock/stat.js';
import {render, RenderPosition} from './utils.js';

const FILM_COUNT = 22;
const FILM_COUNT_PER_STEP = 5;
const FILM_EXTRA_COUNT = 2;
const EMPTY_LIST_TITLE = 'There are no movies in our database';
const filmCards = new Array(FILM_COUNT).fill().map(generateFilm);
const stat = generateStat(filmCards);
const userRank = 'Movie Buff';

const body = document.querySelector('body');
const header = body.querySelector('.header');
const main = body.querySelector('.main');
const footerStatistics = body.querySelector('.footer__statistics');

const renderFilmCard = (container, filmCard) => {
  const filmCardElement = new FilmCard(filmCard).getElement();
  const popupElement = new Popup(filmCard).getElement();

  const closePopup = () => {
    body.removeChild(popupElement);
    body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', onEscKeyDown);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      closePopup();
    }
  };

  const showPopup = () => {
    popupElement.querySelector('.film-details__close-btn').addEventListener('click', closePopup);
    body.classList.add('hide-overflow');
    body.appendChild(popupElement);
    document.addEventListener('keydown', onEscKeyDown);
  };

  filmCardElement.querySelector('.film-card__poster').addEventListener('click', showPopup);
  filmCardElement.querySelector('.film-card__title').addEventListener('click', showPopup);
  filmCardElement.querySelector('.film-card__comments').addEventListener('click', showPopup);

  render(container, filmCardElement, RenderPosition.BEFOREEND);
};

render(header, new UserRank(userRank).getElement(), RenderPosition.BEFOREEND);
render(main, new Films().getElement(), RenderPosition.BEFOREEND);

const films = main.querySelector('.films');

if (filmCards.length > 0) {
  render(main, new Sort().getElement(), RenderPosition.AFTERBEGIN);
  render(main, new Nav(stat).getElement(), RenderPosition.AFTERBEGIN);
  render(films, new FilmsList().getElement(), RenderPosition.BEFOREEND);

  const filmsList = films.querySelector('.films-list');

  render(filmsList, new FilmsListContainer().getElement(), RenderPosition.BEFOREEND);

  const filmsListContainer = filmsList.querySelector('.films-list__container');

  filmCards
    .slice(0, FILM_COUNT_PER_STEP)
    .forEach((filmCard) => renderFilmCard(filmsListContainer, filmCard));

  if (filmCards.length > FILM_COUNT_PER_STEP) {
    let renderedFilmCount = FILM_COUNT_PER_STEP;

    render(filmsList, new ShowMoreButton().getElement(), RenderPosition.BEFOREEND);

    const showMoreButton = filmsList.querySelector('.films-list__show-more');

    showMoreButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      filmCards
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((filmCard) => render(filmsListContainer, new FilmCard(filmCard).getElement(), RenderPosition.BEFOREEND));

      renderedFilmCount += FILM_COUNT_PER_STEP;

      if (renderedFilmCount >= filmCards.length) {
        showMoreButton.remove();
      }
    });
  }

  const topRatedfilmCards = filmCards
    .slice()
    .sort((first, second) => second.totalRating - first.totalRating)
    .slice(0, FILM_EXTRA_COUNT)
    .filter((film) => film.totalRating);
  if (topRatedfilmCards.length) {
    render(films, new FilmsList('Top rated', 'top-rated').getElement(), RenderPosition.BEFOREEND);
    const topRatedfilmsList = films.querySelector('#top-rated');
    render(topRatedfilmsList, new FilmsListContainer().getElement(), RenderPosition.BEFOREEND);
    const topRatedfilmListContainer = topRatedfilmsList.querySelector('.films-list__container');
    topRatedfilmCards.forEach(
      (topRatedfilmCard) => renderFilmCard(topRatedfilmListContainer, topRatedfilmCard));
  }

  const mostCommentedfilmCards = filmCards
    .slice()
    .sort((first, second) => second.comments.length - first.comments.length)
    .slice(0, FILM_EXTRA_COUNT)
    .filter((film) => film.comments.length);
  if (mostCommentedfilmCards.length) {
    render(films, new FilmsList('Most commented', 'most-commented').getElement(), RenderPosition.BEFOREEND);
    const mostCommentedfilmsList = films.querySelector('#most-commented');
    render(mostCommentedfilmsList, new FilmsListContainer().getElement(), RenderPosition.BEFOREEND);
    const mostCommentedfilmListContainer = mostCommentedfilmsList.querySelector('.films-list__container');
    mostCommentedfilmCards.forEach(
      (mostCommentedfilmCard) => renderFilmCard(mostCommentedfilmListContainer, mostCommentedfilmCard));
  }
} else {
  render(main, new Nav(stat).getElement(), RenderPosition.AFTERBEGIN);
  render(films, new FilmsList(EMPTY_LIST_TITLE).getElement(), RenderPosition.BEFOREEND);
}

render(footerStatistics, new FooterStatistics(filmCards.length).getElement(), RenderPosition.BEFOREEND);
