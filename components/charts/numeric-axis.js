import { html, svg } from 'https://unpkg.com/uhtml?module';
import { AxisElement } from './axis.js';

export class NumericAxisElement extends AxisElement {
  ds = null;

  invert = false;
  artificialMin = null;
  artificialMax = null;
  keepZeroVisible = false;

  targetGridlines = 5;
  minGridlines = 2;

  autoCalcGridlines = true;
  gridMin = 0;
  gridMax = 1;

  destStart = 0;
  destSize = 100;

  gridlines = [];
  plots = [];

  constructor(dataset = null, destStart = 0, destEnd = 100, invert = false) {
    super();
    this.invert = !!invert;
    this.setDataset(dataset);
    this.setRange(destStart, destEnd);
  }

  init() {
    super.init();
    if (this.hasAttribute('invert')) this.invert = true;
    this.artificialMin = Number(this.getAttribute('artificialMin')) || this.artificialMin;
    this.artificialMax = Number(this.getAttribute('artificialMax')) || this.artificialMax;
    this.targetGridlines = Number(this.getAttribute('targetGridlines')) || this.targetGridlines;
    this.minGridlines = Number(this.getAttribute('minGridlines')) || this.minGridlines;
  }

  setDataset(dataset) {
    this.ds = dataset;
    this.plots = [];
    return this;
  }

  setRange(destStart, destEnd) {
    const near = destStart ^ 0;
    const far = destEnd ^ 0;
    this.destStart = near;
    this.destSize = far - near;
    return this;
  }

  setKeepZeroVisible(keepZeroVisible) {
    this.keepZeroVisible = keepZeroVisible;
    return this;
  }

  addPlot(seriesName) {
    this.plots.push(seriesName);
    return this;
  }

  getValue(index, seriesName) {
    return this.ds.getValue(index, seriesName);
  }

  transform(value) {
    if (this.invert) {
      return (this.gridMin - value) * this.destSize / (this.gridMax - this.gridMin) + this.destStart + this.destSize;
    } else {
      return (value - this.gridMin) * this.destSize / (this.gridMax - this.gridMin) + this.destStart;
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
    return Math.min.apply(Math, this.plots.map(seriesName => this.ds.getMin(seriesName)));
  }
  calculateMaxValue() {
    return Math.max.apply(Math, this.plots.map(seriesName => this.ds.getMax(seriesName)));
  }

  reset() {
    var minValue = this.calculateMinValue(),
      maxValue = this.calculateMaxValue();

    if (typeof this.artificialMin === 'number') minValue = this.artificialMin;
    if (typeof this.artificialMax === 'number') maxValue = this.artificialMax;

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
    var minValue = this.minValue,
      maxValue = this.maxValue;

    // if(maxValue == minValue) {
    // 	//Fudge it a little bit
    // 	minValue = 0;
    // 	maxValue = 10;
    // }

    if (!(maxValue - minValue)) { // jshint ignore:line
      var adjust = Math.abs((maxValue && maxValue / 10) || 0.1);
      maxValue += adjust;
      minValue -= adjust;
    }

    var interval = (maxValue - minValue) / (this.targetGridlines + 1);
    var magnitude = Math.log(interval) / Math.log(10);

    interval = Math.pow(10, Math.floor(magnitude));

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

    this.gridlines = [];
    for (var line = this.gridMin + bestInterval; line < this.gridMax; line += bestInterval)
      this.gridlines.push(line);
  }
}

export class XNumericAxisElement extends NumericAxisElement {
  render() {
    return svg`
      <g class="cons-x-axis cons-x-axis--numeric">
        <line x1=${this.tr(this.minValue)} y1="0" x2=${this.tr(this.maxValue)} y2="0" />
        ${this.gridlines.map(gl => svg`
          <line x1=${this.tr(gl)} y1="0" x2=${this.tr(gl)} y2="6" />
          <text x=${this.tr(gl)} y="100%" dominant-baseline="hanging" text-anchor="middle">${this.getLabel(gl)}</text>
        `)}
      </g>
    `;
  }
}
customElements.define('cons-x-numeric-axis', XNumericAxisElement);

export class YNumericAxisElement extends NumericAxisElement {
  render() {
    return svg`
      <g class="cons-y-axis cons-y-axis--numeric">
        ${this.gridlines.map(gl => svg`
          <text x="0" y=${this.tr(gl)} dominant-baseline="middle" text-anchor="end">${this.getLabel(gl)}</text>
        `)}
      </g>
    `;
  }
}
customElements.define('cons-y-numeric-axis', YNumericAxisElement);
