import AbstractView from './abstract.js';

const createFilmsListContainer = () => {
  return '<div class="films-list__container"></div>';
};

export default class FilmsListContainer extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createFilmsListContainer();
  }
}
