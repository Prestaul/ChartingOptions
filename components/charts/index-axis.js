import { AxisElement } from './axis.js';
import { svg } from 'https://unpkg.com/uhtml?module';

export class IndexAxisElement extends AxisElement {
  hasPadding = true;

  gridlines = [];

  constructor(dataset, range, options) {
    super(dataset, range, options);
    if (options?.hasPadding != null) this.hasPadding = !!options.hasPadding;
  }

  init() {
    super.init();
    if (this.hasAttribute('hasPadding')) this.hasPadding = true;
  }

  get firstIndex() { return this.ds?.firstIndex; }
  get length() { return this.ds?.length; }

  setPadding(hasPadding) {
    this.hasPadding = !!hasPadding;
    return this;
  }

  getValue(index) {
    return index;
  }

  getLabel(index) {
    return this.ds.getValue(index, '~dt');
  }

  transform(index) {
    const { invert, hasPadding, firstIndex, length, range: { start, end, size } } = this;
    if (invert) {
      return (firstIndex - index - (hasPadding ? 0.5 : 0)) * size / (length - (hasPadding ? 0 : 1)) + end;
    } else {
      return (index - firstIndex + (hasPadding ? 0.5 : 0)) * size / (length - (hasPadding ? 0 : 1)) + start;
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
    return svg`
      <g class="cons-x-axis cons-x-axis--index">
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
