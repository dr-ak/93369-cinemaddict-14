import Observer from '../utils/observer.js';

export default class Movies extends Observer {
  constructor() {
    super();
    this._tasks = [];
  }

  setMovies(filmCards) {
    this._filmCards = filmCards.slice();
  }

  getMovies() {
    return this._filmCards.slice();
  }

  updateFilmCard(updateType, update) {
    const index = this._filmCards.findIndex((filmCard) => filmCard.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film card');
    }
    // console.log(update)
    // console.log(this._filmCards)

    this._filmCards = [
      ...this._filmCards.slice(0, index),
      update,
      ...this._filmCards.slice(index + 1),
    ];
    // console.log(this._filmCards)

    this._notify(updateType, update);
  }

  addFilmCard(updateType, update) {
    this._filmCards = [
      update,
      ...this._filmCards,
    ];

    this._notify(updateType, update);
  }

  deleteFilmCard(updateType, update) {
    const index = this._filmCards.findIndex((filmCard) => filmCard.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting film card');
    }

    this._filmCards = [
      ...this._filmCards.slice(0, index),
      ...this._filmCards.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
