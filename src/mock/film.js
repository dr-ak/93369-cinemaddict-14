import dayjs from 'dayjs';
import {generateComment} from './comment.js';
import {getRandomInteger, getRandom, getRandomElement, getRandomElements} from '../utils/common.js';
import {nanoid} from 'nanoid';

const FILM_COUNT = 22;

let comments = [];

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

const generateComments = () => {
  return new Array(getRandomInteger(0, 5)).fill().map(generateComment);
};

const getIdsComments = () => {
  const buff = generateComments();
  comments = [...comments, ...buff];
  return buff.map((comment) => comment.id);
};

const generateFilm = () => {
  const watched = getRandomInteger(0, 1);
  const watchingDate = watched
    ? dayjs().add(-getRandomInteger(0, 1), 'year').add(-getRandomInteger(0, 30), 'day').format('YYYY-MM-DD')
    : 0;
  return {
    id: nanoid(),
    title: getRandomElement(titles),
    totalRating: getRandom(0, 10, 1),
    poster: getRandomElement(posters),
    date: dayjs().add(-3 - getRandomInteger(0, 80), 'year').add(-getRandomInteger(0, 30), 'day').format('YYYY-MM-DD'),
    runtime: getRandomInteger(30, 240),
    genres: getRandomElements(genres, 3, 1),
    description: getRandomElements(texts, 5, 1).join(' '),
    comments: getIdsComments(),
    watchList: getRandomInteger(0, 1),
    alreadyWatched: watched,
    favorite: getRandomInteger(0, 1),
    watchingDate: watchingDate,
    alternativeTitle: getRandomElement(titles),
    ageRating: getRandomElement([0, 18]),
    director: getRandomElement(people),
    writers: getRandomElements(people, 3, 1),
    actors: getRandomElements(people, 5, 1),
    releaseCountry: getRandomElement(countries),
  };
};

const api = {
  filmCards: new Array(FILM_COUNT).fill().map(generateFilm),
  comments: comments,

  setFilmCards: (filmCards) => {
    api.filmCards = filmCards;
  },

  getFilmCards: () => api.filmCards.slice(),

  getComments: (id) => api.comments.filter((comment) => {
    return api.filmCards.find((filmCard) => filmCard.id === id).comments.includes(comment.id);
  }),

  addComment: (comment, filmId) => {
    const commentId = nanoid();
    api.comments.push(Object.assign(
      {},
      comment,
      {
        id: commentId,
        author: getRandomElement(people),
        date: dayjs().format('YYYY-MM-DDTHH:mm'),
      },
    ));
    api.filmCards.find((film) => film.id === filmId).comments.push(commentId);

    return {movie: api.filmCards.find((film) => film.id === filmId), comments: api.getComments(filmId)};
  },

  deleteComment: (id) => {
    let commentIndex = api.comments.findIndex((comment) => comment.id === id);
    api.comments = [
      ...api.comments.slice(0, commentIndex),
      ...api.comments.slice(commentIndex + 1),
    ];

    const filmIndex = api.filmCards.findIndex((filmCard) => filmCard.comments.includes(id));
    commentIndex = api.filmCards[filmIndex].comments.findIndex((commentId) => commentId === id);
    api.filmCards[filmIndex].comments = [
      ...api.filmCards[filmIndex].comments.slice(0, commentIndex),
      ...api.filmCards[filmIndex].comments.slice(commentIndex + 1),
    ];
  },
};

export default api;
