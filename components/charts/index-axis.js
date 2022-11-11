import { AxisElement } from './axis.js';
import { svg } from 'https://unpkg.com/uhtml?module';

export class IndexAxisElement extends AxisElement {
  ds = null;

  invert = false;
  hasPadding = true;
  targetGridlines = 5;

  destStart = 0;
  destSize = 100;

  gridlines = [];

  constructor(dataset = null, destStart = 0, destEnd = 100, invert = false) {
    super();
    this.invert = !!invert;
    this.setDataset(dataset);
    this.setRange(destStart, destEnd);
  }

  get firstIndex() { return this.ds?.firstIndex; }
  get length() { return this.ds?.length; }

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

  setPadding(hasPadding) {
    this.hasPadding = !!hasPadding;
    return this;
  }

  getValue(index) {
    return index;
  }

  transform(index) {
    if (this.invert) {
      return (this.firstIndex - index - (this.hasPadding ? 0.5 : 0)) * this.destSize / (this.length - (this.hasPadding ? 0 : 1)) + this.destStart + this.destSize;
    } else {
      return (index - this.firstIndex + (this.hasPadding ? 0.5 : 0)) * this.destSize / (this.length - (this.hasPadding ? 0 : 1)) + this.destStart;
    }
  }
  t(index) { return this.transform(index); }
  ts(index) { return Math.round(this.transform(index) + 0.5) - 0.5; }
  tr(index) { return Math.round(this.transform(index)); }

  transformValue(index) {
    return this.transform(index);
  }
  tv(index) { return this.transform(index); }
  tvs(index) { return Math.round(this.transform(index) + 0.5) - 0.5; }
  tvr(index) { return Math.round(this.transform(index)); }

  reverse(position) {
    return this.firstIndex + Math.round((position - this.near) * (this.length - (this.hasPadding ? 0 : 1)) / this.destSize);
  }

  calculateMinValue() {
    return this.firstIndex;
  }
  calculateMaxValue() {
    return this.firstIndex + this.length - 1;
  }

  reset() {
    this.minValue = this.calculateMinValue();
    this.maxValue = this.calculateMaxValue();
    return this.resetGridlines();
  }

  resetGridlines() {
    var segmentCount = this.length - 1,
      interval = Math.floor(segmentCount / this.targetGridlines) || 1,
      lineCount = Math.round((segmentCount + 1) / interval),
      offset = Math.round((segmentCount - (lineCount - 1) * interval) / 2);

    this.gridlines = [];
    for (var i = 0; i < lineCount; i++) {
      this.gridlines.push(this.firstIndex + offset + i * interval);
    }

    return this;
  }
}

export class XIndexAxisElement extends IndexAxisElement {
  render() {
    const xStart = this.destStart;
    const xEnd = xStart + this.destSize;

    return svg`
      <g class="cons-x-axis cons-x-axis--index">
        <line x1=${xStart} y1="0" x2=${xEnd} y2="0" />
        ${this.gridlines.map(gl => svg`
          <line x1=${this.tr(gl)} y1="0" x2=${this.tr(gl)} y2="6" />
          <text x=${this.tr(gl)} y="12" dominant-baseline="hanging" text-anchor="middle">${this.getLabel(gl)}</text>
        `)}
      </g>
    `;
  }
}
customElements.define('cons-x-index-axis', XIndexAxisElement);

export class YIndexAxisElement extends IndexAxisElement {
  render() {
    return svg`
      <g class="cons-y-axis cons-y-axis--index">
        ${this.gridlines.map(gl => svg`
          <text x="0" y=${this.tr(gl)} dominant-baseline="middle" text-anchor="end">${this.getLabel(gl)}</text>
        `)}
      </g>
    `;
  }
}
customElements.define('cons-y-index-axis', YIndexAxisElement);
