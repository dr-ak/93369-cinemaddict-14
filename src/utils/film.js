import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';

export const extractYearFromDate = (date) => {
  return dayjs(date).format('YYYY');
};

export const formatRuntime = (runtime, isObj = false) => {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  if (isObj) {
    return {h: hours, m: minutes};
  }
  return (hours ? hours + 'h' : '') + (minutes ? ' ' + minutes + 'm' : '');
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

export const isWatchDateInto = (date, timeRange) => {
  if (timeRange === 'all-time') {
    return true;
  }
  return dayjs().diff(date, timeRange) <= 0;
};

