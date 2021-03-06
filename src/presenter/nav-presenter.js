import Nav from '../view/nav.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import {filter} from '../utils/filter.js';
import {FilterType} from '../const.js';

export default class NavPresenter {
  constructor(navContainer, filterModel, moviesModel) {
    this._navContainer = navContainer;
    this._filterModel = filterModel;
    this._moviesModel = moviesModel;

    this._navComponent = null;
    this._handleFilterTypeChange = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);

    this._moviesModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevNavComponent = this._navComponent;

    this._navComponent = new Nav(filters, this._filterModel.getFilter());
    this._navComponent.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevNavComponent === null) {
      render(this._navContainer, this._navComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._navComponent, prevNavComponent);
    remove(prevNavComponent);
  }

  setFilterTypeChangeHandler(handler) {
    this._handleFilterTypeChange = handler;
  }

  _getFilters() {
    const filmCards = this._moviesModel.getMovies();

    return {
      watchList: filter[FilterType.WATCHLIST](filmCards).length,
      history: filter[FilterType.HISTORY](filmCards).length,
      favorites: filter[FilterType.FAVORITES](filmCards).length,
    };
  }

  _handleModelEvent() {
    this.init();
  }
}
