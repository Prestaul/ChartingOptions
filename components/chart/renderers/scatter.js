import { svg } from 'https://unpkg.com/uhtml?module';

import { RendererElement } from './renderer.js';

export class ScatterElement extends RendererElement {
  renderSeries(seriesNameX, seriesNameY) {
    return svg`
      <g class="chart-scatter-series">
        ${this.ds.getSeries(seriesNameX).map((v, i) => svg`
          <circle cx=${this.axisX.tr(v)} cy=${this.axisY.tr(this.ds.getValue(i, seriesNameY))} r="3" />
        `)}
      </g>
    `;
  }

  render() {
    return svg`
      <g class="chart-scatter">
        ${this.seriesX.flatMap((name, i) => this.renderSeries(name, this.seriesY[i]))}
      </g>
    `;
  }
}

customElements.define('chart-scatter', ScatterElement);
