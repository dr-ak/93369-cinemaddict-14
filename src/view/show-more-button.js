import AbstractView from './abstract.js';

export const createShowMoreButton = () => {
  return '<button class="films-list__show-more">Show more</button>';
};

export default class ShowMoreButton extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createShowMoreButton();
  }
}
