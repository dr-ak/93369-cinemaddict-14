import UserRank from './view/user-rank.js';
import Stat from './view/stat.js';
import MoviesModel from './model/movies.js';
import FilterModel from './model/filter.js';
import MovieList from './presenter/movie-list.js';
import FooterStatistics from './view/footer-statistics.js';
import NavPresenter from './presenter/nav-presenter.js';
import {UpdateType, FilterType} from './const.js';

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
const stat = new Stat(userRank, moviesModel.getMovies());
stat.hide();

const handleFilterTypeChange = (filterType) => {
  if (filterModel.getFilter() === filterType) {
    return;
  }
  if (filterType === FilterType.STATS) {
    filterModel.setFilter(UpdateType.MAJOR, filterType);
    movieListPresenter.hide();
    stat.show();
  } else {
    filterModel.setFilter(UpdateType.MAJOR, filterType);
    movieListPresenter.show();
    stat.hide();
  }
};

navPresenter.setFilterTypeChangeHandler(handleFilterTypeChange);

navPresenter.init();
movieListPresenter.init();
render(main, stat);

render(footerStatistics, new FooterStatistics(api.filmCards.length));
