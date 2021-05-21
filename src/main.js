import UserRank from './view/user-rank.js';
import MoviesModel from './model/movies.js';
import FilterModel from './model/filter.js';
import MovieList from './presenter/movie-list.js';
import FooterStatistics from './view/footer-statistics.js';
import NavPresenter from './presenter/nav-presenter.js';

import api from './mock/film.js';

import {render} from './utils/render.js';

const userRank = 'Movie Buff';

const filterModel = new FilterModel();

const moviesModel = new MoviesModel();
moviesModel.setMovies(api.getFilmCards());

const body = document.querySelector('body');
const header = body.querySelector('.header');
const main = body.querySelector('.main');
const footerStatistics = body.querySelector('.footer__statistics');

render(header, new UserRank(userRank));

const navPresenter = new NavPresenter(main, filterModel, moviesModel);
const movieListPresenter = new MovieList(main, body, moviesModel, filterModel, api);

navPresenter.init();
movieListPresenter.init();

render(footerStatistics, new FooterStatistics(api.filmCards.length));
