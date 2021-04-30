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

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};
