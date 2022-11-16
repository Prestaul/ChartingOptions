import { DhtmlElement } from '/dhtml/define.js';

import { isNumber, nullableNumber, stringArray } from '../utils.js';
import { Range } from '../range.js';

export class AxisElement extends DhtmlElement {
  ds = null
  range = new Range();

  targetGridlines = 5;
  units = null;
  invert = false;
  hidden = false;
  anchor = null;

  series = [];

  constructor(dataset, range, options = {}) {
    super();

    const { invert = false, hidden = false, anchor, series, units, targetGridlines } = options;
    
    if (dataset) this.ds = dataset;
    if (range) this.range.set(range);
    this.invert = !!invert;
    this.hidden = !!hidden;
    if (anchor) this.anchor = anchor;
    if (units) this.units = units;
    if (isNumber(targetGridlines)) this.targetGridlines = targetGridlines;
    if (Array.isArray(series)) this.series = series;
    
    if (this.onConstruction) this.onConstruction(dataset, range, options);
  }

  init() {
    if (this.hasAttribute('invert')) this.invert = true;
    if (this.hasAttribute('hidden')) this.hidden = true;
    if (this.hasAttribute('anchor')) this.anchor = this.getAttribute('anchor');
    if (this.hasAttribute('units')) this.units = this.getAttribute('units');
    this.targetGridlines = nullableNumber(this.getAttribute('targetGridlines')) ?? this.targetGridlines;

    const start = nullableNumber(this.getAttribute('rangeStart'));
    const end = nullableNumber(this.getAttribute('rangeEnd'));
    const size = nullableNumber(this.getAttribute('rangeSize'));
    if (start || end || size) this.range.set({ start, end, size });

    if (this.onInit) this.onInit();
  }

  setDataset(dataset) {
    this.ds = dataset;
    // this.series = [];
    return this;
  }

  setRange(range) {
    this.range.set(range);
    return this;
  }

  addSeries(seriesNames) {
    this.series = this.series.concat(seriesNames);
    return this;
  }

  getValue(index, seriesName) {
    return this.ds.getValue(index, seriesName);
  }

  getLabel(val) {
    return val + (this.units ?? '');
  }
}
