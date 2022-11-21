import { Axis } from './axis.js';
import { isNumber, nullableNumber } from '../utils.js';

export class NumericAxis extends Axis {
  artificialMin = null;
  artificialMax = null;
  keepZeroVisible = false;

  minGridlines = 2;

  autoCalcGridlines = true;
  gridMin = 0;
  gridMax = 1;
  padStart = 0;
  padEnd = 0;

  gridlines = [];

  constructor(dataset, {
    autoCalcGridlines,
    artificialMin,
    artificialMax,
    minGridlines,
    padStart,
    padEnd,
    ...options
  } = {}) {
    super(dataset, options);

    this.autoCalcGridlines = autoCalcGridlines !== false;
    this.artificialMin = nullableNumber(artificialMin);
    this.artificialMax = nullableNumber(artificialMax);
    if (isNumber(minGridlines)) this.minGridlines = minGridlines;
    if (isNumber(padStart)) this.padStart = padStart;
    if (isNumber(padEnd)) this.padEnd = padEnd;

    this.reset();
  }

  setKeepZeroVisible(keepZeroVisible) {
    this.keepZeroVisible = keepZeroVisible;
    return this;
  }

  transform(value) {
    const { invert, gridMin, gridMax, range: { start, end, size } } = this;
    if (invert) {
      return (gridMin - value) * size / (gridMax - gridMin) + end;
    } else {
      return (value - gridMin) * size / (gridMax - gridMin) + start;
    }
  }
  t(value) { return this.transform(value); }
  ts(value) { return Math.round(this.transform(value) + 0.5) - 0.5; }
  tr(value) { return Math.round(this.transform(value)); }

  transformValue(index, seriesName) {
    return this.transform(this.getValue(index, seriesName));
  }
  tv(index, seriesName) { return this.transformValue(index, seriesName); }
  tvs(index, seriesName) { return Math.round(this.transformValue(index, seriesName) + 0.5) - 0.5; }
  tvr(index, seriesName) { return Math.round(this.transformValue(index, seriesName)); }

  calculateMinValue() {
    return Math.min(...this.plot.map(seriesName => this.dataset.getMin(seriesName)));
  }
  calculateMaxValue() {
    return Math.max(...this.plot.map(seriesName => this.dataset.getMax(seriesName)));
  }

  reset() {
    let minValue = isNumber(this.artificialMin) ? this.artificialMin : this.calculateMinValue();
    let maxValue = isNumber(this.artificialMax) ? this.artificialMax : this.calculateMaxValue();

    if (this.keepZeroVisible) {
      if (minValue > 0) {
        minValue = 0;
      } else if (maxValue < 0) {
        maxValue = 0;
      }
    }

    this.minValue = this.gridMin = minValue;
    this.maxValue = this.gridMax = maxValue;
    this.gridlines = [];

    if (this.autoCalcGridlines) {
      this.resetGridlines();
    }

    return this;
  }

  /**
   * Calculate values for gridlines
   */
  resetGridlines() {
    let minValue = this.minValue;
    let maxValue = this.maxValue;

    if (this.padStart || this.padEnd) {
      const s = (maxValue - minValue) / this.range.size;
      minValue -= (this.invert ? this.padEnd : this.padStart) * s;
      maxValue += (this.invert ? this.padStart : this.padEnd) * s;
    }

    // if(maxValue == minValue) {
    // 	//Fudge it a little bit
    // 	minValue = 0;
    // 	maxValue = 10;
    // }

    if (!(maxValue - minValue)) {
      var adjust = Math.abs((maxValue && maxValue / 10) || 0.1);
      maxValue += adjust;
      minValue -= adjust;
    }

    var interval = (maxValue - minValue) / (this.targetGridlines + 1);
    var magnitude = Math.log(interval) / Math.log(10);

    interval = 10 ** Math.floor(magnitude);

    var intervals = [
      interval,
      (interval == 0.01 ? 0.02 : 2.5 * interval), // 2 cent intervals instead of 2.5 cents
      5 * interval,
      10 * interval
    ];

    var lineCnt = 0, diff = 0, bestDiff = null, bestInterval = null;
    for (var i = 0; i < intervals.length; i++) {
      interval = intervals[i];

      lineCnt = Math.ceil(maxValue / interval) - Math.floor(minValue / interval) - 1;
      diff = Math.round(Math.abs(this.targetGridlines - lineCnt));

      if (lineCnt >= this.minGridlines && (bestDiff === null || diff <= bestDiff)) {
        bestDiff = diff;
        bestInterval = interval;
      }
    }

    if (!bestInterval) bestInterval = intervals[0];

    this.gridMin = Math.floor(minValue / bestInterval) * bestInterval;
    this.gridMax = Math.ceil(maxValue / bestInterval) * bestInterval;
    // console.log('intervals', intervals);
    // console.log({ minValue, maxValue, targetGridlines: this.targetGridlines });
    // console.log(this.gridMin, this.gridMax, bestInterval);

    this.gridlines = [];
    for (var line = this.gridMin + bestInterval; line < this.gridMax; line += bestInterval)
      this.gridlines.push(line);
  }
}
