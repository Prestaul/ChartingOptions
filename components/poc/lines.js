import { DhtmlElement } from '/dhtml/define.js';
import { svg } from 'https://unpkg.com/uhtml?module';
import { stringArray } from './utils.js';

export class LinesElement extends DhtmlElement {
  ds = null;
  xaxis = null;
  yaxis = null;
  plots = [];

  init() {
    console.log('LinesElement::init');
    this.plots = stringArray(this.getAttribute('plots'));
  }

  setDataset(dataset) {
    this.ds = dataset;
    return this;
  }

  setXAxis(xaxis) {
    this.xaxis = xaxis;
    return this;
  }

  setYAxis(yaxis) {
    this.yaxis = yaxis;
    return this;
  }

  renderSeries(name) {
    return svg`
      <polyline
        points=${this.ds.getSeries(name).map((v, i) =>
      `${this.xaxis.ts(i + this.ds.firstIndex)} ${this.yaxis.ts(v)}`
    )}
      />
    `;
  }

  render() {
    return svg`
      <g class="cons-lines">
        ${this.plots.map(name => this.renderSeries(name))}
      </g>
    `;
  }
}

customElements.define('cons-lines', LinesElement);
