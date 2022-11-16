import { svg } from 'https://unpkg.com/uhtml?module';

import { RendererElement } from './renderer.js';

export class LinesElement extends RendererElement {
  renderSeries(name) {
    return svg`
      <polyline
        points=${this.ds.getSeries(name).map((v, i) => 
          `${this.axisX.ts(i + this.ds.firstIndex)} ${this.axisY.ts(v)}`
        )}
      />
    `;
  }

  render() {
    return svg`
      <g class="chart-lines">
        ${this.seriesY.map(name => this.renderSeries(name))}
      </g>
    `;
  }
}

customElements.define('chart-lines', LinesElement);
