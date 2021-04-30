import dayjs from 'dayjs';
import {getRandomInteger, getRandom, getRandomElement, getRandomElements} from '../utils/common.js';
import {nanoid} from 'nanoid';

const commentIds = [0, 1, 2, 3, 4];
const titles = [
  'Made for each other',
  'Popeye meets sinbad',
  'Sagebrush trail',
  'Santa claus conquers the martians',
  'The dance of life',
  'The great flamarion',
  'The man with the golden arm',
];
const posters = [
  './images/posters/made-for-each-other.png',
  './images/posters/popeye-meets-sinbad.png',
  './images/posters/sagebrush-trail.jpg',
  './images/posters/santa-claus-conquers-the-martians.jpg',
  './images/posters/the-dance-of-life.jpg',
  './images/posters/the-great-flamarion.jpg',
  './images/posters/the-man-with-the-golden-arm.jpg',
];
const people = [
  'Tom Ford',
  'Tommy Avallone',
  'Frank Cappello',
  'Lorie Conway',
  'Pierre Edwards',
  'Lesli Linka Glatter',
  'Takeshi Kitano',
  'Morgan Freeman',
];
const genres = [
  'Comedy',
  'Drama',
  'Fantasy',
  'Action',
  'Cartoon',
  'Western',
  'Musical',
];
const texts = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];
const countries = [
  'USA',
  'Russia',
  'Italy',
  'United Kingdom',
  'Sweden',
  'Japan',
  'Poland',
  'India',
  'Spain',
];

export const generateFilm = () => {
  return {
    id: nanoid(),
    title: getRandomElement(titles),
    totalRating: getRandom(0, 10, 1),
    poster: getRandomElement(posters),
    date: dayjs().add(-3 - getRandomInteger(0, 80), 'year').add(-getRandomInteger(0, 30), 'day').format('YYYY-MM-DD'),
    runtime: '1h 36m',
    genres: getRandomElements(genres, 3, 1),
    description: getRandomElements(texts, 5, 1).join(' '),
    comments: getRandomElements(commentIds, 5),
    watchList: getRandomInteger(0, 1),
    alreadyWatched: getRandomInteger(0, 1),
    favorite: getRandomInteger(0, 1),
    alternativeTitle: getRandomElement(titles),
    ageRating: getRandomElement([0, 18]),
    director: getRandomElement(people),
    writers: getRandomElements(people, 3, 1),
    actors: getRandomElements(people, 5, 1),
    releaseCountry: getRandomElement(countries),
  };
};
