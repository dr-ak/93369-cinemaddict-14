import FooterStatistics from './view/footer-statistics.js';
import Nav from './view/nav.js';
import UserRank from './view/user-rank.js';
import MovieList from './presenter/movie-list.js';

import {generateFilm} from './mock/film.js';
import {generateStat} from './mock/stat.js';
import {render} from './utils/render.js';

const FILM_COUNT = 22;
const filmCards = new Array(FILM_COUNT).fill().map(generateFilm);
const stat = generateStat(filmCards);
const userRank = 'Movie Buff';

const body = document.querySelector('body');
const header = body.querySelector('.header');
const main = body.querySelector('.main');
const footerStatistics = body.querySelector('.footer__statistics');

render(header, new UserRank(userRank));
render(main, new Nav(stat));

const movieListPresenter = new MovieList(main, body);
movieListPresenter.init(filmCards);

render(footerStatistics, new FooterStatistics(filmCards.length));
