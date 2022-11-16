import { svg } from 'https://unpkg.com/uhtml?module';

import { RendererElement } from './renderer.js';

export class BarsElement extends RendererElement {
  renderBar(x, y) {
    return svg`
      <rect x=${x - 2} y=${y} width="3" height=${this.axisY.range.end - y} />
    `;
  }
  renderSeries(name) {
    return svg`
      <g class="chart-bars-series">
        ${this.ds.getSeries(name).map((v, i) => 
          this.renderBar(this.axisX.tr(i), this.axisY.tr(v))
        )}
      </g>
    `;
  }

  render() {
    return svg`
      <g class="chart-bars">
        ${this.seriesY.map((name, i) => this.renderSeries(name))}
      </g>
    `;
  }
}

customElements.define('chart-bars', BarsElement);
