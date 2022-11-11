import { DhtmlElement } from '/dhtml/define.js';
import { render, html, svg } from 'https://unpkg.com/uhtml?module';

export class XyPlotElement extends DhtmlElement {
  init() {
    console.log('XyPlotElement::init');

    this.ds = this.querySelector('cons-dataset');

    this.xaxis = this.querySelector('cons-x-numeric-axis, cons-x-index-axis');
    this.xaxis?.setDataset(this.ds).setRange(50, this.offsetWidth - 50).reset();

    this.yaxis = this.querySelector('cons-y-numeric-axis, cons-y-index-axis');
    this.yaxis?.setDataset(this.ds).setRange(0, this.offsetHeight - 20).addPlot('x').reset();

    this.plot = this.querySelector('cons-lines');
    this.plot.setDataset(this.ds).setXAxis(this.xaxis).setYAxis(this.yaxis);

    this.attachShadow({ mode: "open" });
    this.render();
  }

  renderGrid() {
    const { xaxis, yaxis } = this;
    if (!(yaxis && xaxis)) return;

    // const xStart = xaxis.t(xaxis.minValue);
    // const xEnd = xaxis.t(xaxis.maxValue);
    const xStart = 50;
    const xEnd = this.offsetWidth - 50;

    return svg`
      <g class="cons-gridlines">
        ${yaxis.gridlines.map(gl => svg`
          <line x1=${xStart} y1=${yaxis.tr(gl)} x2=${xEnd} y2=${yaxis.tr(gl)} />
        `)}
      </g>
    `;
  }

  render() {
    render(this.shadowRoot, html`
      <style>
        .cons-x-axis {
          translate: 0.5px calc(100% - 24.5px);
        }
        
        .cons-y-axis {
          translate: 44px 0;
        }

        .cons-gridlines {
          translate: 0 0.5px;
          stroke: #E2E2E2;
        }
        :is(.cons-x-axis, .cons-y-axis) line {
          stroke: #757575;
        }

        :is(.cons-x-axis, .cons-y-axis) text {
          fill: #757575;
          font: 400 12px/20px sans-serif;
        }

        .cons-lines polyline {
          fill: none;
          stroke-width: 3;
        }
        .cons-lines polyline:nth-of-type(1) {
          stroke: #5B91F4;
        }
        .cons-lines polyline:nth-of-type(2) {
          stroke: #3CCECE;
        }
        .cons-lines polyline:nth-of-type(3) {
          stroke: #FFC043;
        }
        .cons-lines polyline:nth-of-type(4) {
          stroke: #E28454;
        }
        .cons-lines polyline:nth-of-type(5) {
          stroke: #174291;
        }

      </style>
      ${svg`
        <svg 
          viewbox=${`0 0 ${this.offsetWidth} ${this.offsetHeight}`} 
          width="${this.offsetWidth}" 
          height="${this.offsetHeight}"
        >
          ${this.xaxis?.render()}
          ${this.yaxis?.render()}
          ${this.renderGrid()}
          ${this.plot.render()}
        </svg>
      `}
    `);
  }
}

customElements.define('cons-xy-plot', XyPlotElement);