import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

export const extractYearFromDate = (date) => {
  return dayjs(date).format('YYYY');
};

export const formatRuntime = (runtime) => {
  const hour = Math.floor(runtime / 60) ? Math.floor(runtime / 60) + 'h' : '';
  const minute = runtime % 60 ? ' ' + runtime % 60 + 'm' : '';
  return hour + minute;
};

export const humanizeFilmDate = (date) => {
  return dayjs(date).format('DD MMMM YYYY');
};

export const humanizeCommentDate = (date) => {
  dayjs.extend(duration);
  dayjs.extend(relativeTime);
  return dayjs.duration(-dayjs().diff(date, 'm'), 'm').humanize(true);
};

export const sortByDate = (first, second) => dayjs(second.date).diff(dayjs(first.date));
