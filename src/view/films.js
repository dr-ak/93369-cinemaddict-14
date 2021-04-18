import AbstractView from './abstract.js';

export const createFilms = () => {
  return '<section class="films"></section>';
};

export default class Films extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createFilms();
  }
}
