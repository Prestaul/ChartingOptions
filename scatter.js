import { render, svg } from 'https://unpkg.com/uhtml?module';
import { Chart, NumericAxis } from '/uchart/index.js';
import { measureText } from '/utils/measure-text.js';

export class BasicScatter extends Chart {
  constructor({ root, data, plot }) {
    super(root, data);

    this.plot = plot;

    const plotsWithR = plot.map(({ r }) => r).filter(Boolean);
    this.axisR = plotsWithR.length ? new NumericAxis(this.dataset, {
      plot: plotsWithR,
      range: { start: 3, end: 30 },
      autoCalcGridlines: false,
    }) : null;

    this.axisY = new NumericAxis(this.dataset, {
      plot: plot.map(({ y }) => y),
      range: { start: 18 },
      invert: true,
      targetGridlines: 3,
      padStart: this.axisR ? 18 : 0,
      padEnd: this.axisR ? 30 : 0,
    });

    const yLabelsWidth = Math.ceil(Math.max(...[
      this.axisY.gridMax,
      ...this.axisY.gridlines,
      this.axisY.gridMin
    ].map(gl => measureText(gl).width)));

    this.axisX = new NumericAxis(this.dataset, {
      plot: plot.map(({ x }) => x),
      range: { start: yLabelsWidth + 6 },
      padStart: this.axisR ? 30 : 0,
      padEnd: this.axisR ? 30 : 0,
    });

    this.setDimensions();
    this.render();
  }

  setDimensions() {
    this.width = this.root.clientWidth;
    this.height = this.root.clientHeight;

    this.axisX.range.end = this.width;
    this.axisY.range.end = this.height - 30;

    if (this.axisR) {
      this.axisX.resetGridlines();
      this.axisY.resetGridlines();
    }
  }

  onResize() {
    this.setDimensions();
    this.render();
  }

  renderAxisX() {
    const { axisX, axisY } = this;
    return svg`
      <g class="chart-x-axis" transform=${`translate(0 ${axisY.range.end})`}>
        ${axisX.gridlines.map(gl => svg`
          <line x1=${axisX.tr(gl)} y1="0" x2=${axisX.tr(gl)} y2="6" />
          <text x=${axisX.tr(gl)} y="18" dominant-baseline="text-top" text-anchor="middle">${axisX.getLabel(gl)}</text>
        `)}
      </g>
    `;
  }

  renderAxisY() {
    const { axisX, axisY } = this;
    const xStart = Math.round(axisX.range.start);
    const xEnd = Math.round(axisX.range.end);
    const gridlines = [axisY.gridMax, ...axisY.gridlines, axisY.gridMin];

    return svg`
      <g class="chart-y-axis" transform=${`translate(${xStart} 0)`}>
        ${gridlines.map(gl => svg`
          <text x="-6" y=${axisY.ts(gl)} dominant-baseline="middle" text-anchor="end">${axisY.getLabel(gl)}</text>
        `)}
      </g>
      <g class="chart-y-axis-lines">
        ${gridlines.map(gl => svg`
          <line class=${gl === axisY.gridMin ? null : 'secondary'} x1=${xStart} x2=${xEnd} y1=${axisY.ts(gl)} y2=${axisY.ts(gl)} />
        `)}
      </g>
    `;
  }

  renderSeries({ x, y, r }) {
    const { axisX, axisY, axisR, dataset } = this;
    const seriesX = dataset.getSeries(x);
    const seriesY = dataset.getSeries(y);
    const seriesR = r && dataset.getSeries(r);

    const getRadius = r
      ? (i) => axisR.tr(seriesR[i])
      : () => 3;

    return svg`
      <g class="chart-scatter-series">
        ${seriesX.map((v, i) => svg`
          <circle cx=${axisX.tr(v)} cy=${axisY.tr(seriesY[i])} r=${getRadius(i)} />
        `)}
      </g>
    `;
  }

  render() {
    render(this.root, svg`
      <svg 
        viewbox=${`0 0 ${this.width} ${this.height}`} 
        width="${this.width}"
        height="${this.height}"
      >
        <style>
          text {
            fill: #757575;
            font: 400 12px sans-serif;
          }
  
          line {
            stroke: #757575;
          }
          line.secondary {
            stroke: #E2E2E2;
          }
          
          .chart-scatter-series circle {
            stroke: #fff;
          }
          .chart-scatter-series:nth-of-type(1) circle {
            fill: #5B91F4;
          }
          .chart-scatter-series:nth-of-type(2) circle {
            fill: #3CCECE;
          }
          .chart-scatter-series:nth-of-type(3) circle {
            fill: #FFC043;
          }
          .chart-scatter-series:nth-of-type(4) circle {
            fill: #E28454;
          }
          .chart-scatter-series:nth-of-type(5) circle {
            fill: #174291;
          }
          .chart-scatter-series:nth-of-type(6) circle {
            fill: #FF5B8C;
          }
        </style>
        ${this.renderAxisX()}
        ${this.renderAxisY()}
        <g class="chart-scatter">
          ${this.plot.map(series => this.renderSeries(series))}
        </g>
      </svg>
    `);
  }
}
