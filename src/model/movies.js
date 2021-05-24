import Observer from '../utils/observer.js';

export default class Movies extends Observer {
  constructor() {
    super();
    this._filmCards = [];
  }

  setMovies(updateType, filmCards) {
    this._filmCards = filmCards.slice();
    this._notify(updateType);
  }

  getMovies() {
    if (this._filmCards.length) {
      return this._filmCards.slice();
    }
    return [];
  }

  updateFilmCard(updateType, update) {
    const index = this._filmCards.findIndex((filmCard) => filmCard.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting film card');
    }

    this._filmCards = [
      ...this._filmCards.slice(0, index),
      update,
      ...this._filmCards.slice(index + 1),
    ];

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

  static adaptDateToClient(date) {
    return date !== null ? new Date(date) : date;
  }

  static adaptToClient(filmCard) {
    return {
      id: filmCard.id,
      title: filmCard.film_info.title,
      totalRating: filmCard.film_info.total_rating,
      poster: filmCard.film_info.poster,
      date: Movies.adaptDateToClient(filmCard.film_info.release.date),
      runtime: filmCard.film_info.runtime,
      genres: filmCard.film_info.genre,
      description: filmCard.film_info.description,
      comments: filmCard.comments,
      watchList: filmCard.user_details.watchlist,
      alreadyWatched: filmCard.user_details.already_watched,
      favorite: filmCard.user_details.favorite,
      watchingDate: Movies.adaptDateToClient(filmCard.user_details.watching_date),
      alternativeTitle: filmCard.film_info.alternative_title,
      ageRating: filmCard.film_info.age_rating,
      director: filmCard.film_info.director,
      writers: filmCard.film_info.writers,
      actors: filmCard.film_info.actors,
      releaseCountry: filmCard.film_info.release.release_country,
    };
  }

  static adaptDateToServer(date) {
    return date instanceof Date ? date.toISOString() : null;
  }

  static adaptToServer(filmCard) {
    return {
      'id': filmCard.id,
      'comments': filmCard.comments,
      'film_info': {
        'title': filmCard.title,
        'alternative_title': filmCard.alternativeTitle,
        'total_rating': filmCard.totalRating,
        'poster': filmCard.poster,
        'age_rating': filmCard.ageRating,
        'director': filmCard.director,
        'writers': filmCard.writers,
        'actors': filmCard.actors,
        'release': {
          'date': Movies.adaptDateToServer(filmCard.date),
          'release_country': filmCard.releaseCountry,
        },
        'runtime': filmCard.runtime,
        'genre': filmCard.genre,
        'description': filmCard.description,
      },
      'user_details': {
        'watchlist': filmCard.watchList,
        'already_watched': filmCard.alreadyWatched,
        'watching_date': Movies.adaptDateToServer(filmCard.watchingDate),
        'favorite': filmCard.favorite,
      },
    };
  }
}
