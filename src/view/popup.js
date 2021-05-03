import {humanizeFilmDate, humanizeCommentDate} from '../utils/film.js';
import {generateComment} from '../mock/comment.js';
import Smart from './smart.js';

const commentsList = new Array(5).fill().map(generateComment);

export const createPopup = (data) => {
  const {title, totalRating, poster, date, runtime, genres, description, comments, watchList, alreadyWatched, favorite, alternativeTitle, ageRating, director, writers, actors, releaseCountry, isChoosedEmoji, choosedEmoji} = data;
  const emojis = {
    'smile': '../../images/emoji/smile.png',
    'sleeping': '../../images/emoji/sleeping.png',
    'puke': '../../images/emoji/puke.png',
    'angry': '../../images/emoji/angry.png',
  };
  const choosedEmojiPath = emojis[choosedEmoji];

  const createGenresTemplate = (genres) => {
    let template = '';
    for(const genre of genres) {
      template += `<span class="film-details__genre">${genre}</span>`;
    }
    return template;
  };

  const createCommentsTemplate = (comments) => {
    let template = '';
    for(const commentId of comments) {
      const {author, comment, date, emotion} = commentsList[commentId];
      const emoji = emojis[emotion];
      const commentDate = humanizeCommentDate(date);
      template += `<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="${emoji}" width="55" height="55" alt="emoji-${emotion}">
          </span>
          <div>
            <p class="film-details__comment-text">${comment}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${author}</span>
              <span class="film-details__comment-day">${commentDate}</span>
              <button class="film-details__comment-delete">Delete</button>
            </p>
          </div>
        </li>`;
    }
    return template;
  };

  const createChoosedEmoji = () => {
    return isChoosedEmoji
      ? `<img src="${choosedEmojiPath}" width="55" height="55" alt="emoji-${choosedEmoji}">`
      : '';
  };

  const ageLimit = ageRating
    ? ageRating + '+'
    : '';
  const filmDate = humanizeFilmDate(date);
  const listWriters = writers.join(', ');
  const listActors = actors.join(', ');
  const genresTemplate = createGenresTemplate(genres);
  const addTowatchListChecked = watchList
    ? 'checked'
    : '';
  const markAsWatchedChecked = alreadyWatched
    ? 'checked'
    : '';
  const markAsFavoriteChecked = favorite
    ? 'checked'
    : '';
  const commentsCount = comments.length;
  const commentsTemplate = createCommentsTemplate(comments);
  const disabledTextarea = isChoosedEmoji ? '' : 'disabled';
  const emojiElement = createChoosedEmoji();

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${poster}" alt="">

            <p class="film-details__age">${ageLimit}</p>
          </div>

          <div class="film-details__info">
            <div class="film-details__info-head">
              <div class="film-details__title-wrap">
                <h3 class="film-details__title">${title}</h3>
                <p class="film-details__title-original">Original: ${alternativeTitle}</p>
              </div>

              <div class="film-details__rating">
                <p class="film-details__total-rating">${totalRating}</p>
              </div>
            </div>

            <table class="film-details__table">
              <tr class="film-details__row">
                <td class="film-details__term">Director</td>
                <td class="film-details__cell">${director}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Writers</td>
                <td class="film-details__cell">${listWriters}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Actors</td>
                <td class="film-details__cell">${listActors}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Release Date</td>
                <td class="film-details__cell">${filmDate}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Runtime</td>
                <td class="film-details__cell">${runtime}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Country</td>
                <td class="film-details__cell">${releaseCountry}</td>
              </tr>
              <tr class="film-details__row">
                <td class="film-details__term">Genres</td>
                <td class="film-details__cell">${genresTemplate}</td>
              </tr>
            </table>

            <p class="film-details__film-description">
              ${description}
            </p>
          </div>
        </div>

        <section class="film-details__controls">
          <input type="checkbox" class="film-details__control-input visually-hidden" id="watchlist" name="watchlist" ${addTowatchListChecked}>
          <label for="watchlist" class="film-details__control-label film-details__control-label--watchlist">Add to watchlist</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="watched" name="watched" ${markAsWatchedChecked}>
          <label for="watched" class="film-details__control-label film-details__control-label--watched">Already watched</label>

          <input type="checkbox" class="film-details__control-input visually-hidden" id="favorite" name="favorite" ${markAsFavoriteChecked}>
          <label for="favorite" class="film-details__control-label">Add to favorites</label>
        </section>
      </div>

      <div class="film-details__bottom-container">
        <section class="film-details__comments-wrap">
          <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

          <ul class="film-details__comments-list">
            ${commentsTemplate}
          </ul>

          <div class="film-details__new-comment">
            <div class="film-details__add-emoji-label">${emojiElement}</div>

            <label class="film-details__comment-label">
              <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${disabledTextarea}></textarea>
            </label>

            <div class="film-details__emoji-list">
              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
              <label class="film-details__emoji-label" for="emoji-smile">
                <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
              <label class="film-details__emoji-label" for="emoji-sleeping">
                <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
              <label class="film-details__emoji-label" for="emoji-puke">
                <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
              </label>

              <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
              <label class="film-details__emoji-label" for="emoji-angry">
                <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
              </label>
            </div>
          </div>
        </section>
      </div>
    </form>
  </section>`;
};

export default class Popup extends Smart {
  constructor(filmCard, container) {
    super();
    this._data = Popup.parseFilmCardToData(filmCard);
    this._parentElem = container;
    this._onEscKeyDown = null;
    this._cardCloseBtnClickHandler = this._cardCloseBtnClickHandler.bind(this);
    this._addToWatchListClickHandler = this._addToWatchListClickHandler.bind(this);
    this._markAsWatchedClickHandler = this._markAsWatchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._emojiListHandler = this._emojiListHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopup(this._data);
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  show() {
    this._parentElem.classList.add('hide-overflow');
    this._parentElem.appendChild(this.getElement());
    document.addEventListener('keydown', this._callback.escDown);
  }

  close() {
    this._parentElem.removeChild(this.getElement());
    this._parentElem.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._callback.escDown);
  }

  setEscKeyDownHandler(callback) {
    this._callback.escDown = callback;
  }

  setAddToWatchListHandler(callback) {
    this._callback.addToWatchList = callback;
    this.getElement().querySelector('#watchlist').addEventListener('click', this._addToWatchListClickHandler);
  }

  setMarkAsWatchedHandler(callback) {
    this._callback.markAsWatched = callback;
    this.getElement().querySelector('#watched').addEventListener('click', this._markAsWatchedClickHandler);
  }

  setFavoriteClickHandler(callback) {
    this._callback.favorite = callback;
    this.getElement().querySelector('#favorite').addEventListener('click', this._favoriteClickHandler);
  }

  setCardCloseBtnClickHandler(callback) {
    this._callback.filmCardCloseBtn = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._cardCloseBtnClickHandler);
  }

  _cardCloseBtnClickHandler() {
    this._callback.filmCardCloseBtn();
  }

  _addToWatchListClickHandler() {
    this._callback.addToWatchList();
  }

  _markAsWatchedClickHandler() {
    this._callback.markAsWatched();
  }

  _favoriteClickHandler() {
    this._callback.favorite();
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.film-details__emoji-list')
      .addEventListener('click', this._emojiListHandler);
  }

  _emojiListHandler(evt) {
    if (evt.target.tagName !== 'INPUT') {
      return;
    }
    evt.preventDefault();
    const scroll = this.getElement().scrollTop;
    this.updateData({
      isChoosedEmoji: true,
      choosedEmoji: evt.target.value,
    });
    this.getElement().scrollTop = scroll;
    const inputText = this.getElement().querySelector('.film-details__comment-input');
    inputText.focus();
    inputText.placeholder = '';
  }

  static parseFilmCardToData(filmCard) {
    return Object.assign(
      {},
      filmCard,
      {
        isChoosedEmoji: false,
        choosedEmoji: '',
      },
    );
  }

  static parseDataToFilmCard(data) {
    delete data.isChoosedEmoji;

    return data;
  }
}

