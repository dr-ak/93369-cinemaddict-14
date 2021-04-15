import dayjs from 'dayjs';

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
export const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

export const getRandom = (min, max, decimalLength) => {
  if (min < 0 || max < 0 || max <= min) {
    return null;
  }
  return parseFloat((Math.random() * (max - min) + min).toFixed(decimalLength));
};

export const getRandomElement = (arr) => arr[getRandomInteger(0, arr.length - 1)];

export const getRandomElements = (arr, maxCount, minCount = 0) => new Array(getRandomInteger(minCount, maxCount)).fill(null).map(() => getRandomElement(arr));

export const extractYearFromDate = (date) => {
  return dayjs(date).format('YYYY');
};

export const humanizeFilmDate = (date) => {
  return dayjs(date).format('DD MMMM YYYY');
};

export const humanizeCommentDate = (date) => {
  const yearDiff = dayjs().diff(date, 'year');
  if (yearDiff > 1) {
    return yearDiff + ' year ago';
  } else if (yearDiff === 1) {
    return 'a year ago';
  }
  const monthDiff = dayjs().diff(date, 'month');
  if (monthDiff > 1) {
    return monthDiff + ' month ago';
  } else if (monthDiff === 1) {
    return 'a month ago';
  }
  const hourDiff = dayjs().diff(date, 'hour');
  if (hourDiff > 1) {
    return hourDiff + ' hour ago';
  } else if (hourDiff === 1) {
    return 'a hour ago';
  }
  const minuteDiff = dayjs().diff(date, 'hour');
  if (minuteDiff > 3) {
    return minuteDiff + ' hour ago';
  } else if (minuteDiff > 1) {
    return 'a few minutes ago';
  } else {
    return 'just now';
  }
};
