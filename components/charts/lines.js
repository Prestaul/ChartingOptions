import { DhtmlElement } from '/dhtml/define.js';
import { svg } from 'https://unpkg.com/uhtml?module';

export class LinesElement extends DhtmlElement {
  ds = null;
  xaxis = null;
  yaxis = null;
  series = [];

  init() {
    console.log('LinesElement::init');

    const series = JSON.parse(this.getAttribute('series'));
    if (!Array.isArray(series)) {
      throw new Error('LinesElement requires a JSON array value for the "series" attribute');
    }
    this.series = series;
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
      `${this.xaxis.ts(i)} ${this.yaxis.ts(v)}`
    )}
      />
    `;
  }

  render() {
    return svg`
      <g class="cons-lines">
        ${this.series.map(name => this.renderSeries(name))}
      </g>
    `;
  }
}

customElements.define('cons-lines', LinesElement);
