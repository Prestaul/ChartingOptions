import { DhtmlElement } from '/dhtml/define.js';
import { isNumber, nullableNumber, stringArray } from './utils.js';
import { Range } from './range.js';

export class AxisElement extends DhtmlElement {
  ds = null
  range = new Range();

  targetGridlines = 5;
  units = null;
  invert = false;

  plots = [];

  constructor(dataset, range, { invert = false, plots, units, targetGridlines } = {}) {
    super();
    if (dataset) this.ds = dataset;
    if (range) this.range.set(range);
    this.invert = !!invert;
    if (units) this.units = units;
    if (isNumber(targetGridlines)) this.targetGridlines = targetGridlines;
    if (Array.isArray(plots)) this.plots = plots;
  }

  init() {
    if (this.hasAttribute('invert')) this.invert = true;
    this.units = this.getAttribute('units');
    this.targetGridlines = nullableNumber(this.getAttribute('targetGridlines')) ?? this.targetGridlines;

    const start = nullableNumber(this.getAttribute('rangeStart'));
    const end = nullableNumber(this.getAttribute('rangeEnd'));
    const size = nullableNumber(this.getAttribute('rangeSize'));
    if (start || end || size) this.range.set({ start, end, size });

    const plots = stringArray(this.getAttribute('plots'));
    if (plots && plots.length) this.plots = plots;
  }

  setDataset(dataset) {
    this.ds = dataset;
    // this.plots = [];
    return this;
  }

  setRange(range) {
    this.range.set(range);
    return this;
  }

  addPlot(seriesName) {
    this.plots.push(seriesName);
    return this;
  }

  getValue(index, seriesName) {
    return this.ds.getValue(index, seriesName);
  }

  getLabel(val) {
    return val + (this.units ?? '');
  }
}
