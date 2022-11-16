import { svg } from 'https://unpkg.com/uhtml?module';

import { AxisElement } from './axis.js';
import { IndicesAxisMixin } from './indices-axis.js';
import { NumericAxisMixin } from './numeric-axis.js';

export class AxisYElement extends AxisElement {
  orientation = 'y';
  size = 50;
}

export class IndicesYAxisElement extends AxisYElement {
  render() {
    if (this.anchor === 'end') {
      return svg`
        <g class="chart-y-axis chart-y-axis--start chart-y-axis--index">
          ${this.gridlines.map(gl => svg`
            <text x="0" y=${this.tr(gl)} dominant-baseline="middle" text-anchor="start">${this.getLabel(gl)}</text>
          `)}
        </g>
      `;
    }

    return svg`
      <g class="chart-y-axis chart-y-axis--start chart-y-axis--index">
        ${this.gridlines.map(gl => svg`
          <text x="0" y=${this.tr(gl)} dominant-baseline="middle" text-anchor="end">${this.getLabel(gl)}</text>
        `)}
      </g>
    `;
  }
}
IndicesAxisMixin(IndicesYAxisElement.prototype);
customElements.define('chart-axis-y-indices', IndicesYAxisElement);

export class NumericYAxisElement extends AxisYElement {
  render() {
    if (this.anchor === 'end') {
      return svg`
        <g class="chart-y-axis chart-y-axis--end chart-y-axis--numeric">
            <text x="0" y=${this.tr(this.gridMax)} dominant-baseline="middle" text-anchor="start">${this.getLabel(this.gridMax)}</text>
          ${this.gridlines.map(gl => svg`
            <text x="0" y=${this.tr(gl)} dominant-baseline="middle" text-anchor="start">${this.getLabel(gl)}</text>
          `)}
            <text x="0" y=${this.tr(this.gridMin)} dominant-baseline="middle" text-anchor="start">${this.getLabel(this.gridMin)}</text>
        </g>
      `;
    }
    
    return svg`
      <g class="chart-y-axis chart-y-axis--start chart-y-axis--numeric">
          <text x="0" y=${this.tr(this.gridMax)} dominant-baseline="middle" text-anchor="end">${this.getLabel(this.gridMax)}</text>
        ${this.gridlines.map(gl => svg`
          <text x="0" y=${this.tr(gl)} dominant-baseline="middle" text-anchor="end">${this.getLabel(gl)}</text>
        `)}
          <text x="0" y=${this.tr(this.gridMin)} dominant-baseline="middle" text-anchor="end">${this.getLabel(this.gridMin)}</text>
      </g>
    `;
  }
}
NumericAxisMixin(NumericYAxisElement.prototype);
customElements.define('chart-axis-y-numeric', NumericYAxisElement);
