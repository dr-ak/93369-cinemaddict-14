import Smart from './smart.js';
import {formatRuntime, isWatchDateInto} from '../utils/film.js';

import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {getUserRank} from '../utils/user.js';

const BAR_HEIGHT = 50;

const CHARTS_TYPE = 'horizontalBar';

const Collors = {
  BACKGROUND: '#ffe800',
  HOVER_BACKGROUND: '#ffe800',
  LABLES: '#ffffff',
  FONT: '#ffffff',
};

const Positons = {
  SETS_ANCHOR: 'start',
  LABLES_ANCHOR: 'start',
  LABLES_ALIGN: 'start',
};

const Sizes = {
  PADDING: 100,
  FONT_SIZE: 20,
  LABLES_OFFSET: 40,
  BAR_THICKNESS: 24,
};

const TimeRanges = {
  ALL_TIME: 'all-time',
  DAY: 'day',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
};

const createCharts = ({chartsPlace, genres, amountGenres}) => {
  chartsPlace.height = BAR_HEIGHT * genres.length;
  return  new Chart(chartsPlace, {
    plugins: [ChartDataLabels],
    type: CHARTS_TYPE,
    data: {
      labels: genres,
      datasets: [{
        data: amountGenres,
        backgroundColor: Collors.BACKGROUND,
        hoverBackgroundColor: Collors.HOVER_BACKGROUND,
        anchor: Positons.SETS_ANCHOR,
        barThickness: Sizes.BAR_THICKNESS,
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: Sizes.FONT_SIZE,
          },
          color: Collors.LABLES,
          anchor: Positons.LABLES_ANCHOR,
          align: Positons.LABLES_ALIGN,
          offset: Sizes.LABLES_OFFSET,
        },
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: Collors.FONT,
            padding: Sizes.PADDING,
            fontSize: Sizes.FONT_SIZE,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

export const createStat = ({userRank, watchedFilmsCount, totalHours, totalMinutes, topGenre, allTime, day, week, month, year}) => {
  return `<section class="statistic">
    <p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${userRank}</span>
    </p>

    <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
      <p class="statistic__filters-description">Show stats:</p>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" ${allTime}>
      <label for="statistic-all-time" class="statistic__filters-label">All time</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="day" ${day}>
      <label for="statistic-today" class="statistic__filters-label">Today</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week" ${week}>
      <label for="statistic-week" class="statistic__filters-label">Week</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month" ${month}>
      <label for="statistic-month" class="statistic__filters-label">Month</label>

      <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year" ${year}>
      <label for="statistic-year" class="statistic__filters-label">Year</label>
    </form>

    <ul class="statistic__text-list">
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">You watched</h4>
        <p class="statistic__item-text">${watchedFilmsCount} <span class="statistic__item-description">movies</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Total duration</h4>
        <p class="statistic__item-text">${totalHours} <span class="statistic__item-description">h</span>${totalMinutes} <span class="statistic__item-description">m</span></p>
      </li>
      <li class="statistic__text-item">
        <h4 class="statistic__item-title">Top genre</h4>
        <p class="statistic__item-text">${topGenre}</p>
      </li>
    </ul>

    <div class="statistic__chart-wrap">
      <canvas class="statistic__chart" width="1000"></canvas>
    </div>

  </section>`;
};

export default class Stat extends Smart {
  constructor() {
    super();
    this._userRank = '';
    this._watchedFilmCards = [];
    this._filmCards = [];
    this._data = {};

    this._rangeFilterChangeHandler = this._rangeFilterChangeHandler.bind(this);
  }


  init(filmCards) {
    this._userRank = getUserRank(filmCards);
    this._watchedFilmCards = filmCards.filter((filmCard) => filmCard.alreadyWatched);
    this._filmCards = this._watchedFilmCards.slice();
    this._data = Object.assign(this._getData(), this._getCheckedRange());
    this._setCharts(this._data);
    this._setRangeFilterChangeHandler();
    this.updateData(this._data);
    this._setCharts(this._data);
  }

  getTemplate() {
    return createStat(this._data);
  }

  restoreHandlers() {
    this._setRangeFilterChangeHandler();
  }

  _getData() {
    const userRank = this._userRank;
    const counterGenres = {};
    const sortedGenres = [];
    const genres = [];
    const amountGenres = [];
    const watchedFilmsCount = this._filmCards.length;
    let totalDuration = 0;

    this._filmCards.forEach((filmCard) => {
      filmCard.genres.forEach((genre) => {
        if (Object.keys(counterGenres).includes(genre)) {
          counterGenres[genre]++;
        } else {
          counterGenres[genre] = 1;
        }
      });
      totalDuration += filmCard.runtime;
    });

    totalDuration = formatRuntime(totalDuration, true);

    Object.keys(counterGenres).forEach((ganre) => {
      sortedGenres.push({name: ganre, number: counterGenres[ganre]});
    });

    sortedGenres.sort((first, second) => second.number - first.number);
    sortedGenres.forEach((genre) => {
      genres.push(genre.name);
      amountGenres.push(genre.number);
    });

    const topGenre = genres[0] ? genres[0] : '';
    const totalHours = totalDuration.h;
    const totalMinutes = totalDuration.m;

    return {userRank, watchedFilmsCount, totalHours, totalMinutes, topGenre, genres, amountGenres};
  }

  _getCheckedRange(range = TimeRanges.ALL_TIME) {
    return {
      allTime: range === TimeRanges.ALL_TIME ? 'checked' : '',
      day: range === TimeRanges.DAY ? 'checked' : '',
      week: range === TimeRanges.WEEK ? 'checked' : '',
      month: range === TimeRanges.MONTH ? 'checked' : '',
      year: range === TimeRanges.YEAR ? 'checked' : '',
    };
  }

  _setCharts(data){
    data.chartsPlace = this.getElement().querySelector('.statistic__chart');
    createCharts(data);
  }

  _setRangeFilterChangeHandler() {
    this.getElement().querySelector('.statistic__filters').addEventListener('change', this._rangeFilterChangeHandler);
  }

  _setFilmCards(range) {
    this._filmCards = this._watchedFilmCards.slice().filter((filmCard) =>
      isWatchDateInto(filmCard.watchingDate, range));
  }

  _rangeFilterChangeHandler(evt) {
    evt.preventDefault();
    this._setFilmCards(evt.target.value);
    this._data = Object.assign(this._getData(), this._getCheckedRange(evt.target.value));
    this.updateData(this._data);
    this._setCharts(this._data);
    evt.target.checked = true;
  }
}
