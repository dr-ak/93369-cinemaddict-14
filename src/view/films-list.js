import {createElement} from '../utils.js';

export const createFilmsList = (title = '', id = '') => {
  let visuallyHiddenClass = 'visually-hidden';
  let sectionClass = '';
  if (title) {
    visuallyHiddenClass = '';
    sectionClass = id ? 'films-list--extra' : '';
  } else {
    title = 'All movies. Upcoming';
  }
  return `<section class="films-list ${sectionClass}" id="${id}">
    <h2 class="films-list__title ${visuallyHiddenClass}">${title}</h2>
  </section>`;
};

export default class FilmsList {
  constructor(title, id) {
    this._title = title;
    this._id = id;
    this._element = null;
  }

  getTemplate() {
    return createFilmsList(this._title, this._id);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
