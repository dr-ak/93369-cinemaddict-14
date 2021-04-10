import {createUserRank} from './view/user-rank.js';
import {createNav} from './view/nav.js';
import {createSort} from './view/sort.js';
import {createFilms} from './view/films.js';
import {createFilmsList} from './view/films-list.js';
import {createFilmsListContainer} from './view/films-list-container.js';
import {createFilmCard} from './view/film-card.js';
import {createShowMoreButton} from './view/show-more-button.js';
import {createFooterStatistics} from './view/footer-statistics.js';
import {generateFilm} from './mock/film.js';
import {generateStat} from './mock/stat.js';
// import {createPopup} from './view/popup.js';

const FILM_COUNT = 22;
const FILM_COUNT_PER_STEP = 5;
const FILM_EXTRA_COUNT = 2;
const EMPTY_LIST_TITLE = 'There are no movies in our database';
const filmCards = new Array(FILM_COUNT).fill().map(generateFilm);
const stat = generateStat(filmCards);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const header = document.querySelector('.header');

const userRank = 'Movie Buff';
render(header, createUserRank(userRank), 'beforeend');

const main = document.querySelector('.main');
render(main, createFilms(), 'beforeend');
const films = main.querySelector('.films');

if (filmCards.length > 0) {
  render(main, createSort(), 'afterbegin');
  render(main, createNav(stat), 'afterbegin');
  render(films, createFilmsList(), 'beforeend');

  const filmsList = films.querySelector('.films-list');
  render(filmsList, createFilmsListContainer(), 'beforeend');
  const filmListContainer = filmsList.querySelector('.films-list__container');
  for (let i = 0; i < Math.min(filmCards.length, FILM_COUNT_PER_STEP); i++) {
    render(filmListContainer, createFilmCard(filmCards[i]), 'beforeend');
  }

  if (filmCards.length > FILM_COUNT_PER_STEP) {
    let renderedFilmCount = FILM_COUNT_PER_STEP;

    render(filmsList, createShowMoreButton(), 'beforeend');

    const showMoreButton = filmsList.querySelector('.films-list__show-more');

    showMoreButton.addEventListener('click', (evt) => {
      evt.preventDefault();
      filmCards
        .slice(renderedFilmCount, renderedFilmCount + FILM_COUNT_PER_STEP)
        .forEach((filmCard) => render(filmListContainer, createFilmCard(filmCard), 'beforeend'));

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
    render(films, createFilmsList('Top rated', 'top-rated'), 'beforeend');
    const topRatedfilmsList = films.querySelector('#top-rated');
    render(topRatedfilmsList, createFilmsListContainer(), 'beforeend');
    const topRatedfilmListContainer = topRatedfilmsList.querySelector('.films-list__container');
    topRatedfilmCards.forEach(
      (topRatedfilmCard) => render(topRatedfilmListContainer, createFilmCard(topRatedfilmCard), 'beforeend'));
  }

  const mostCommentedfilmCards = filmCards
    .slice()
    .sort((first, second) => second.comments.length - first.comments.length)
    .slice(0, FILM_EXTRA_COUNT)
    .filter((film) => film.comments.length);
  if (mostCommentedfilmCards.length) {
    render(films, createFilmsList('Most commented', 'most-commented'), 'beforeend');
    const mostCommentedfilmsList = films.querySelector('#most-commented');
    render(mostCommentedfilmsList, createFilmsListContainer(), 'beforeend');
    const mostCommentedfilmListContainer = mostCommentedfilmsList.querySelector('.films-list__container');
    mostCommentedfilmCards.forEach(
      (mostCommentedfilmCard) => render(mostCommentedfilmListContainer, createFilmCard(mostCommentedfilmCard), 'beforeend'));
  }
} else {
  render(main, createNav(stat), 'afterbegin');
  render(films, createFilmsList(EMPTY_LIST_TITLE), 'beforeend');
}

const footerStatistics = document.querySelector('.footer__statistics');
render(footerStatistics, createFooterStatistics(filmCards.length), 'beforeend');

// const body = document.querySelector('body');
// render(body, createPopup(filmCards[0]), 'beforeend');
