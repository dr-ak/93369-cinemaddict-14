import {createUserRank} from './view/user-rank.js';
import {createNav} from './view/nav.js';
import {createSort} from './view/sort.js';
import {createFilms} from './view/films.js';
import {createFilmsList} from './view/films-list.js';
import {createFilmCard} from './view/film-card.js';
import {createShowMoreButton} from './view/show-more-button.js';
import {createFooterStatistics} from './view/footer-statistics.js';
// import { createPopup } from './view/popup.js';

const FILM_COUNT = 5;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const header = document.querySelector('.header');
render(header, createUserRank(), 'beforeend');

const main = document.querySelector('.main');
render(main, createNav(), 'beforeend');
render(main, createSort(), 'beforeend');
render(main, createFilms(), 'beforeend');

const films = main.querySelector('.films');
render(films, createFilmsList(), 'beforeend');

const filmsList = films.querySelector('.films-list');
const filmListContainer = filmsList.querySelector('.films-list__container');
for (let i = 0; i < FILM_COUNT; i++) {
  render(filmListContainer, createFilmCard(), 'beforeend');
}
render(filmsList, createShowMoreButton(), 'beforeend');

const footerStatistics = document.querySelector('.footer__statistics');
render(footerStatistics, createFooterStatistics(), 'beforeend');

// const body = document.querySelector('body');
// render(body, createPopup, 'beforeend');


