import AbstractView from './abstract.js';

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

export default class FilmsList extends AbstractView {
  constructor(title, id) {
    super();
    this._title = title;
    this._id = id;
  }

  getTemplate() {
    return createFilmsList(this._title, this._id);
  }
}
