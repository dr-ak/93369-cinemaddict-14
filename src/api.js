import MoviesModel from './model/movies.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
  POST: 'POST',
  DELETE: 'DELETE',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getFilmCards() {
    return this._load({url: 'movies'})
      .then(Api.toJSON)
      .then((filmCards) => filmCards.map(MoviesModel.adaptToClient));
  }

  updateFilmCard(filmCard) {
    return this._load({
      url: `movies/${filmCard.id}`,
      method: Method.PUT,
      body: JSON.stringify(MoviesModel.adaptToServer(filmCard)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(MoviesModel.adaptToClient);
  }

  getComments(filmId) {
    return this._load({
      url: `comments/${filmId}`,
      method: Method.GET,
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
  }

  addComment(comment, filmId) {
    return this._load({
      url: `comments/${filmId}`,
      method: Method.POST,
      body: JSON.stringify(comment),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
  }

  deleteComment(commentId) {
    return this._load({
      url: `comments/${commentId}`,
      method: Method.DELETE,
    });
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
