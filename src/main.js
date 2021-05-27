import Stat from './view/stat.js';
import MoviesModel from './model/movies.js';
import FilterModel from './model/filter.js';
import MovieList from './presenter/movie-list.js';
import FooterStatistics from './view/footer-statistics.js';
import NavPresenter from './presenter/nav-presenter.js';
import {UpdateType, FilterType} from './const.js';

import Api from './api/api.js';
import Store from './api/store.js';
import Provider from './api/provider.js';

import {render} from './utils/render.js';

const AUTHORIZATION = 'Basic aaaa00001111bbbb';
const END_POINT = 'https://14.ecmascript.pages.academy/cinemaddict';
const STORE_PREFIX = 'cinemaddict-localstorage';
const STORE_VER = 'v14';
const STORE_NAME = `${STORE_PREFIX}-${STORE_VER}`;

const api = new Api(END_POINT, AUTHORIZATION);
const store = new Store(STORE_NAME, window.localStorage);
const apiWithProvider = new Provider(api, store);

const filterModel = new FilterModel();

const moviesModel = new MoviesModel();

const body = document.querySelector('body');
const header = body.querySelector('.header');
const main = body.querySelector('.main');
const footerStatistics = body.querySelector('.footer__statistics');

const navPresenter = new NavPresenter(main, filterModel, moviesModel);
const movieListPresenter = new MovieList(header, main, body, moviesModel, filterModel, apiWithProvider);
const stat = new Stat();
stat.hide();

const handleFilterTypeChange = (filterType) => {
  if (filterModel.getFilter() === filterType) {
    return;
  }
  if (filterType === FilterType.STATS) {
    filterModel.setFilter(UpdateType.MAJOR, filterType);
    movieListPresenter.hide();
    stat.init(moviesModel.getMovies());
    stat.show();
  } else {
    filterModel.setFilter(UpdateType.MAJOR, filterType);
    movieListPresenter.show();
    stat.hide();
  }
};

navPresenter.init();
movieListPresenter.init();
navPresenter.setFilterTypeChangeHandler(handleFilterTypeChange);

apiWithProvider.getFilmCards()
  .then((response) => {
    moviesModel.setMovies(UpdateType.INIT, response);
    render(main, stat);
    render(footerStatistics, new FooterStatistics(response.length));
  })
  .catch(() => {
    moviesModel.setMovies(UpdateType.INIT, []);
    render(main, stat);
    render(footerStatistics, new FooterStatistics(0));
  });

window.addEventListener('load', () => {
  navigator.serviceWorker.register('/sw.js');
});

window.addEventListener('online', () => {
  document.title = document.title.replace(' [offline]', '');
  apiWithProvider.sync();
});

window.addEventListener('offline', () => {
  document.title += ' [offline]';
});
