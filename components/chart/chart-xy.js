import { ChartElement } from './chart.js';
import { NumericXAxisElement, NumericYAxisElement } from './axes/index.js';

export class ChartXYElement extends ChartElement {
  getDefaultXAxis() {
    return new NumericXAxisElement(this.ds);
  }

  getDefaultYAxis() {
    return new NumericYAxisElement(this.ds, null, { invert: true });
  }
}

customElements.define('chart-xy', ChartXYElement);
