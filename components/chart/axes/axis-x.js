import { svg } from 'https://unpkg.com/uhtml?module';

import { AxisElement } from './axis.js';
import { IndicesAxisMixin } from './indices-axis.js';
import { NumericAxisMixin } from './numeric-axis.js';

export class AxisXElement extends AxisElement {
  orientation = 'x';
  size = 30;
}

export class IndicesXAxisElement extends AxisXElement {
  render() {
    if (this.anchor === 'start') {    
      return svg`
        <g class="chart-x-axis chart-x-axis--start chart-x-axis--indices">
          ${this.gridlines.map(gl => svg`
            <line x1=${this.tr(gl)} y1="24" x2=${this.tr(gl)} y2="30" />
            <text x=${this.tr(gl)} y="18" dominant-baseline="text-bottom" text-anchor="middle">${this.getLabel(gl)}</text>
          `)}
        </g>
      `;
    }
    
    return svg`
      <g class="chart-x-axis chart-x-axis--end chart-x-axis--indices">
        ${this.gridlines.map(gl => svg`
          <line x1=${this.tr(gl)} y1="0" x2=${this.tr(gl)} y2="6" />
          <text x=${this.tr(gl)} y="18" dominant-baseline="text-top" text-anchor="middle">${this.getLabel(gl)}</text>
        `)}
      </g>
    `;
  }
}
IndicesAxisMixin(IndicesXAxisElement.prototype);
customElements.define('chart-axis-x-indices', IndicesXAxisElement);

export class NumericXAxisElement extends AxisXElement {
  render() {
    if (this.anchor === 'start') {
      return svg`
        <g class="chart-x-axis chart-x-axis--start chart-x-axis--numeric">
          ${this.gridlines.map(gl => svg`
            <line x1=${this.tr(gl)} y1="24" x2=${this.tr(gl)} y2="30" />
            <text x=${this.tr(gl)} y="18" dominant-baseline="text-bottom" text-anchor="middle">${this.getLabel(gl)}</text>
          `)}
        </g>
      `;
    }
    
    return svg`
      <g class="chart-x-axis chart-x-axis--end chart-x-axis--numeric">
        ${this.gridlines.map(gl => svg`
          <line x1=${this.tr(gl)} y1="0" x2=${this.tr(gl)} y2="6" />
          <text x=${this.tr(gl)} y="18" dominant-baseline="text-top" text-anchor="middle">${this.getLabel(gl)}</text>
        `)}
      </g>
    `;
  }
}
NumericAxisMixin(NumericXAxisElement.prototype);
customElements.define('chart-axis-x-numeric', NumericXAxisElement);
