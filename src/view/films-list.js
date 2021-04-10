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
