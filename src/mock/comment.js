import dayjs from 'dayjs';
import {getRandomInteger, getRandomElement} from '../utils.js';

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

const emotions = ['smile', 'sleeping', 'puke', 'angry'];

export const generateComment = () => {
  return {
    author: getRandomElement(people),
    comment: getRandomElement(texts),
    date: dayjs()
      .add(-getRandomInteger(0, 5), 'day')
      .add(-getRandomInteger(0, 23), 'hour')
      .add(-getRandomInteger(0, 59), 'minute')
      .format('YYYY-MM-DDTHH:mm'),
    emotion: getRandomElement(emotions),
  };
};
