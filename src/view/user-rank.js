import AbstractView from './abstract.js';

export const createUserRank = (userRank) => {
  return `<section class="header__profile profile">
    <p class="profile__rating">${userRank}</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
  </section>`;
};

export default class UserRank extends AbstractView {
  constructor(userRank) {
    super();
    this._userRank = userRank;
  }

  getTemplate() {
    return createUserRank(this._userRank);
  }
}
