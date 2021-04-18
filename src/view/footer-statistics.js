import AbstractView from './abstract.js';

export const createFooterStatistics = (count) => {
  return `<p>${count} movies inside</p>`;
};

export default class FooterStatistics extends AbstractView {
  constructor(count) {
    super();
    this._count = count;
  }

  getTemplate() {
    return createFooterStatistics(this._count);
  }
}
