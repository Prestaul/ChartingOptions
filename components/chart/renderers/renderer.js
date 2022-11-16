import { DhtmlElement } from '/dhtml/define.js';

import { stringArray } from '../utils.js';

export class RendererElement extends DhtmlElement {
  ds = null;
  axisX = null;
  axisY = null;

  seriesX = [];
  seriesY = [];

  init() {
    const x = stringArray(this.getAttribute('x'));
    if (x && x.length) this.seriesX = x;

    const y = stringArray(this.getAttribute('y'));
    if (y && y.length) this.seriesY = y;
  }

  setDataset(dataset) {
    this.ds = dataset;
    return this;
  }
  
  setAxes(axisX, axisY) {
    this.axisX = axisX;
    this.axisY = axisY;
    return this;
  }

  addSeriesX(...seriesNames) {
    this.seriesX = this.seriesX.concat(...seriesNames);
    return this;
  }

  addSeriesY(...seriesNames) {
    this.seriesY = this.seriesY.concat(...seriesNames);
    return this;
  }

  render() {
    throw new Error('Not implemented');
  }
}
