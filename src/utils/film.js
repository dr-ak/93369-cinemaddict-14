import dayjs from 'dayjs';

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

export const sortByDate = (first, second) => dayjs(second.date).diff(dayjs(first.date));
