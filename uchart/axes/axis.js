import { isNumber } from '../utils.js';
import { Range } from '../range.js';

export class Axis {
  dataset = null
  range = new Range();

  invert = false;
  targetGridlines = 5;
  units = null;

  plot = [];

  constructor(dataset, { range = null, invert = false, targetGridlines, units, plot } = {}) {
    if (dataset) this.dataset = dataset;
    if (range) this.range.set(range);
    this.invert = !!invert;
    if (isNumber(targetGridlines)) this.targetGridlines = targetGridlines;
    if (units) this.units = units;
    if (Array.isArray(plot)) this.plot = plot;
  }

  setDataset(dataset) {
    this.dataset = dataset;
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
    return this.dataset.getValue(index, seriesName);
  }

  getLabel(val) {
    return val + (this.units ?? '');
  }
}
