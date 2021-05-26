import MoviesModel from '../model/movies.js';
import {isOnline} from '../utils/common.js';

const createStoreStructure = (items) => {
  return items.reduce((acc, current) => {
    return Object.assign({}, acc, {
      [current.id]: current,
    });
  }, {});
};

export default class Provider {
  constructor(api, store) {
    this._api = api;
    this._store = store;
  }

  getFilmCards() {
    if (isOnline()) {
      return this._api.getFilmCards()
        .then((filmCards) => {
          const items = createStoreStructure(filmCards.map(MoviesModel.adaptToServer));
          this._store.setItems(items);
          return filmCards;
        });
    }

    const storeFilmCards = Object.values(this._store.getItems());

    return Promise.resolve(storeFilmCards.map(MoviesModel.adaptToClient));
  }

  updateFilmCard(filmCard) {
    if (isOnline()) {
      return this._api.updateFilmCard(filmCard)
        .then((updatedFilmCard) => {
          this._store.setItem(updatedFilmCard.id, MoviesModel.adaptToServer(updatedFilmCard));
          return updatedFilmCard;
        });
    }

    this._store.setItem(filmCard.id, MoviesModel.adaptToServer(Object.assign({}, filmCard)));

    return Promise.resolve(filmCard);
  }

  getComments(filmCardId) {
    if (isOnline()) {
      return this._api.getComments(filmCardId);
    }

    return Promise.reject(new Error('Receive comments failed'));
  }

  addComment(comment, filmId) {
    if (isOnline()) {
      return this._api.addComment(comment, filmId);
    }

    return Promise.reject(new Error('Add comment failed'));
  }

  deleteComment(commentId) {
    if (isOnline()) {
      return this._api.deleteComment(commentId);
    }

    return Promise.reject(new Error('Delete comment failed'));
  }

  sync() {
    if (isOnline()) {
      const storeFilmCards = Object.values(this._store.getItems());
      return this._api.sync(storeFilmCards)
        .then((response) => {
          const items = createStoreStructure([...response.updated]);

          this._store.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
