import { DhtmlElement } from '/dhtml/define.js';
import { render, html, svg } from 'https://unpkg.com/uhtml?module';

export class XyPlotElement extends DhtmlElement {
  init() {
    console.log('XyPlotElement::init');

    this.ds = this.querySelector('cons-dataset');
    this.xaxis = this.querySelector('cons-x-numeric-axis, cons-x-index-axis');
    this.yaxis = this.querySelector('cons-y-numeric-axis, cons-y-index-axis');
    this.plot = this.querySelector('cons-lines');

    this.ds.getMappedSeries('DO', 'merged', (_, i) => this.ds.getValue(i, 'PU') + 2 * this.ds.getValue(i, 'DO'));
    let avg = this.ds.getValue(0, 'DO');
    this.ds.getMappedSeries('DO', 'avg', v => avg = v * 0.3 + avg * 0.7);
    this.ds.getMappedSeries('', 'dt', (_, i) => {
      const dt = new Date();
      dt.setDate(dt.getDate() + i);
      return `${dt.getMonth() + 1}/${dt.getDate()}`;
    });
    this.ds.firstIndex = 10;
    this.ds.length -= 10;

    this.xaxis?.setDataset(this.ds);
    this.yaxis?.setDataset(this.ds);
    this.plot.setDataset(this.ds).setXAxis(this.xaxis).setYAxis(this.yaxis);

    this.attachShadow({ mode: "open" });
    this.resize().render();

    new ResizeObserver(() => this.resize().render()).observe(this);
  }

  resize() {
    this.xaxis?.setRange({ start: 50, end: this.clientWidth }).reset();
    this.yaxis?.setRange({ start: 18, end: this.clientHeight - 30 }).reset();
    return this;
  }

  renderGrid() {
    const { xaxis, yaxis } = this;
    if (!(yaxis && xaxis)) return;

    const { start, end } = xaxis.range;

    return svg`
      <g class="cons-gridlines">
        <line class="secondary" x1=${start} y1=${yaxis.tr(yaxis.gridMax)} x2=${end} y2=${yaxis.tr(yaxis.gridMax)} />
        ${yaxis.gridlines.map(gl => svg`
          <line class="secondary" x1=${start} y1=${yaxis.tr(gl)} x2=${end} y2=${yaxis.tr(gl)} />
        `)}
        <line class="primary" x1=${start} y1=${yaxis.tr(yaxis.gridMin)} x2=${end} y2=${yaxis.tr(yaxis.gridMin)} />
      </g>
    `;
  }

  render() {
    render(this.shadowRoot, html`
      <style>
        :host {
          overflow: hidden;
        }
        
        .cons-x-axis {
          translate: 0.5px calc(100% - 29.5px);
        }
        
        .cons-y-axis {
          translate: 44px 0.5px;
        }

        .cons-gridlines {
          translate: 0 0.5px;
        }

        line {
          stroke: #757575;
        }
        line.secondary {
          stroke: #E2E2E2;
        }

        :is(.cons-x-axis, .cons-y-axis) text {
          fill: #757575;
          font: 400 12px sans-serif;
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
          viewbox=${`0 0 ${this.clientWidth} ${this.clientHeight}`} 
          width="${this.clientWidth}" 
          height="${this.clientHeight}"
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