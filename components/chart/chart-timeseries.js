import { ChartElement } from './chart.js';
import { IndicesXAxisElement, NumericYAxisElement } from './axes/index.js';

export class ChartTimeseriesElement extends ChartElement {
  getDefaultXAxis() {
    return new IndicesXAxisElement(this.ds);
  }

  getDefaultYAxis() {
    return new NumericYAxisElement(this.ds, null, { invert: true });
  }
}

customElements.define('chart-timeseries', ChartTimeseriesElement);
