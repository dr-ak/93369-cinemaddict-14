import {humanizeFilmDate, humanizeCommentDate} from '../utils/film.js';
import Smart from './smart.js';
import he from 'he';

const createPopup = (data, comments) => {
  const {title, totalRating, poster, date, runtime, genres, description, watchList, alreadyWatched, favorite, alternativeTitle, ageRating, director, writers, actors, releaseCountry} = data;

  const createGenresTemplate = (genres) => {
    let template = '';
    for(const genre of genres) {
      template += `<span class="film-details__genre">${genre}</span>`;
    }
    return template;
  };

  const ageLimit = ageRating
    ? ageRating + '+'
    : '';
  const filmDate = humanizeFilmDate(date);
  const listWriters = writers.join(', ');
  const listActors = actors.join(', ');
  const s = genres.length > 1 ? 's' : '';
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
                <td class="film-details__term">Genre${s}</td>
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
      ${comments}
    </form>
  </section>`;
};

const createComments = (data, commentsData) => {
  const {isChoosedEmoji, choosedEmoji, commentText} = data;

  const emojis = {
    'smile': '../../images/emoji/smile.png',
    'sleeping': '../../images/emoji/sleeping.png',
    'puke': '../../images/emoji/puke.png',
    'angry': '../../images/emoji/angry.png',
  };
  const choosedEmojiPath = emojis[choosedEmoji];

  const createCommentsTemplate = (comments) => {
    let template = '';
    for(const data of comments) {
      const {id, author, comment, date, emotion} = data;
      const emoji = emojis[emotion];
      const commentDate = humanizeCommentDate(date);
      template += `<li class="film-details__comment">
          <span class="film-details__comment-emoji">
            <img src="${emoji}" width="55" height="55" alt="emoji-${emotion}">
          </span>
          <div>
            <p class="film-details__comment-text">${he.encode(comment)}</p>
            <p class="film-details__comment-info">
              <span class="film-details__comment-author">${author}</span>
              <span class="film-details__comment-day">${commentDate}</span>
              <button class="film-details__comment-delete" id="${id}">Delete</button>
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

  const commentsCount = commentsData.length;
  const commentsTemplate = createCommentsTemplate(commentsData);
  const disabledTextarea = isChoosedEmoji ? '' : 'disabled';
  const emojiElement = createChoosedEmoji();

  return `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsCount}</span></h3>

      <ul class="film-details__comments-list">
        ${commentsTemplate}
      </ul>

      <div class="film-details__new-comment">
        <div class="film-details__add-emoji-label">${emojiElement}</div>

        <label class="film-details__comment-label">
          <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${disabledTextarea}>${he.encode(commentText)}</textarea>
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
  </div>`;
};

const createNoUploadComments = () => {
  return `<div class="film-details__bottom-container">
    <section class="film-details__comments-wrap">
      <h3 class="film-details__comments-title" style="color: red">Failed to load comments!</h3>
    </section>
  </div>`;
};

export default class Popup extends Smart {
  constructor(filmCard, container, commentsData) {
    super();
    this._data = Popup.parseFilmCardToData(filmCard);
    this._parentElem = container;
    this._commentsData = commentsData;
    this._isUploadComments = this._commentsData.length === this._data.comments.length;
    this._onEscKeyDown = null;
    this._cardCloseBtnClickHandler = this._cardCloseBtnClickHandler.bind(this);
    this._addToWatchListClickHandler = this._addToWatchListClickHandler.bind(this);
    this._markAsWatchedClickHandler = this._markAsWatchedClickHandler.bind(this);
    this._favoriteClickHandler = this._favoriteClickHandler.bind(this);
    this._emojiListHandler = this._emojiListHandler.bind(this);
    this._commentTextInputHandler = this._commentTextInputHandler.bind(this);
    this._deleteCommentClickHandler = this._deleteCommentClickHandler.bind(this);
    this._saveCommentHendler = this._saveCommentHendler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    const comments = this._isUploadComments
      ? createComments(this._data, this._commentsData)
      : createNoUploadComments();

    return createPopup(this._data, comments);
  }

  getDataId() {
    return this._data.id;
  }

  show() {
    this._parentElem.classList.add('hide-overflow');
    document.addEventListener('keydown', this._callback.escDown);
  }

  close() {
    this._parentElem.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._callback.escDown);
  }

  setState(state) {
    this.updateData({
      isChoosedEmoji: state.isChoosedEmoji,
      choosedEmoji: state.choosedEmoji,
      commentText: state.commentText,
    });
    if (state.isChoosedEmoji) {
      this.getElement().querySelector('.film-details__comment-input').placeholder = '';
    }
    this.getElement().scrollTop = state.scroll;
  }

  getState() {
    return {
      filmId: this._data.id,
      scroll: this.getElement().scrollTop,
      isChoosedEmoji: this._data.isChoosedEmoji,
      choosedEmoji: this._data.choosedEmoji,
      commentText: this._data.commentText,
    };
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setEscKeyDownHandler(this._callback.escDown);
    this.setAddToWatchListHandler(this._callback.addToWatchList);
    this.setMarkAsWatchedHandler(this._callback.markAsWatched);
    this.setFavoriteClickHandler(this._callback.favorite);
    this.setCardCloseBtnClickHandler(this._callback.filmCardCloseBtn);
    this.setDeleteCommentClickHandler(this._callback.deleteComment);
    this.setSaveCommentHendler(this._callback.saveComment);
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

  setDeleteCommentClickHandler(callback) {
    this._callback.deleteComment = callback;
    if ( this._isUploadComments) {
      this.getElement().querySelector('.film-details__comments-list').addEventListener('click', this._deleteCommentClickHandler);
    }
  }

  setCardCloseBtnClickHandler(callback) {
    this._callback.filmCardCloseBtn = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._cardCloseBtnClickHandler);
  }

  setSaveCommentHendler(callback) {
    this._callback.saveComment = callback;
    this.getElement().addEventListener('keydown', this._saveCommentHendler);
  }

  _setInnerHandlers() {
    if ( this._isUploadComments) {
      this.getElement()
        .querySelector('.film-details__emoji-list')
        .addEventListener('click', this._emojiListHandler);
      this.getElement()
        .querySelector('.film-details__comment-input')
        .addEventListener('input', this._commentTextInputHandler);
    }
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

  _saveCommentHendler({repeat, metaKey, ctrlKey, key}) {
    if (repeat || this._data.commentText.trim() === '') {
      return;
    }
    if((metaKey || ctrlKey) && key === 'Enter') {

      const {choosedEmoji, commentText} = this._data;

      this.updateData({
        isChoosedEmoji: false,
        choosedEmoji: '',
        commentText: '',
      }, true);

      this._callback.saveComment({comment: {
        comment: commentText,
        emotion: choosedEmoji,
      }, filmId: this._data.id});
    }
  }

  _deleteCommentClickHandler(evt) {
    if (evt.target.tagName !== 'BUTTON') {
      return;
    }
    evt.preventDefault();
    this._callback.deleteComment({commentId: evt.target.id, filmId: this._data.id});
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
    inputText.selectionStart = inputText.value.length;
    inputText.value = this._data.commentText;
    inputText.placeholder = '';
  }

  _commentTextInputHandler(evt) {
    this.updateData({
      commentText: evt.target.value,
    }, true);
  }

  static parseFilmCardToData(filmCard) {
    return Object.assign(
      {},
      filmCard,
      {
        isChoosedEmoji: false,
        choosedEmoji: '',
        commentText: '',
      },
    );
  }

  static parseDataToFilmCard(data) {
    delete data.isChoosedEmoji;
    delete data.choosedEmoji;

    return data;
  }
}

