import { render, html, svg } from 'https://unpkg.com/uhtml?module';
import { DhtmlElement } from '/dhtml/define.js';

import { Dataset } from './dataset.js';
import { AxisElement } from './axes/index.js';
import { RendererElement } from './renderers/index.js';

export class ChartElement extends DhtmlElement {
  ds = null;
  
  axesX = [];
  startXAxis = null;
  endXAxis = null;
  
  axesY = [];
  startYAxis = null;
  endYAxis = null;
  
  renderers = [];

  init() {
    this.initDataset();
    this.initChildren();    

    this.attachShadow({ mode: "open" });
    this.resize().render();

    new ResizeObserver(() => this.resize().render()).observe(this);
  }
  
  initDataset() {
    // Initilize dataset
    let json = this.getAttribute('data');

    if (!json) {
      const dataId = this.getAttribute('dataId');
      if (!dataId) throw new Error('ChartXYElement requires either a "data" or "dataId" attribute.');

      const el = document.getElementById(dataId);

      if (!el) throw new Error(`Unable to find data element with id: ${dataId}`);
      if (el.tagName !== 'SCRIPT' || el.getAttribute('type') !== 'application/json')
        throw new Error('Data element must be a script tag with type of "application/json".');

      json = el.textContent;
    }

    if (json) {
      let data;
      try {
        data = JSON.parse(json);
      } catch (e) {
        throw new Error('Data element must contain valid JSON.', { cause: e });
      }
      this.ds = new Dataset(data);
    }
  }

  initXAxis(axis) {
    axis.setDataset(this.ds);
    if (!axis.hidden) {
      if (!axis.anchor) {
        if (!this.endXAxis) {
          axis.anchor = 'end';
          this.endXAxis = axis;
        } else if (!this.startXAxis) {
          axis.anchor = 'start';
          this.startXAxis = axis;
        } else {
          axis.hidden = true;
        }
      }
    }
    this.axesX.push(axis);
  }

  initYAxis(axis) {
    axis.setDataset(this.ds);
    if (!axis.hidden) {
      if (!axis.anchor) {
        if (!this.startYAxis) {
          axis.anchor = 'start';
          this.startYAxis = axis;
        } else if (!this.endYAxis) {
          axis.anchor = 'end';
          this.endYAxis = axis;
        } else {
          axis.hidden = true;
        }
      }
    }
    this.axesY.push(axis);
  }

  initChildren() {
    let currentXAxis = null;
    let currentYAxis = null;
    
    Array.from(this.children).forEach(el => {
      if (el instanceof AxisElement) {
        // Initialize axis
        el.setDataset(this.ds);

        if(el.orientation === 'x') this.initXAxis(currentXAxis = el);
        if(el.orientation === 'y') this.initYAxis(currentYAxis = el);
      } else if (el instanceof RendererElement) {
        // Initialize renderer
        if (!currentXAxis) this.initXAxis(currentXAxis = this.getDefaultXAxis());
        if (!currentYAxis) this.initYAxis(currentYAxis = this.getDefaultYAxis());
        
        currentXAxis.addSeries(el.seriesX);
        currentYAxis.addSeries(el.seriesY);

        el.setDataset(this.ds);
        el.setAxes(currentXAxis, currentYAxis);
        this.renderers.push(el);
      } else {
        console.warn(`Unknown child element in ChartXyElement: ${el.tagName}`, el);
      }
    });
  }

  resize() {
    const rangeX = {
      start: this.startYAxis?.size ?? 0,
      end: this.clientWidth - (this.endYAxis?.size ?? 0)
    };
    this.axesX.forEach(x => x.setRange(rangeX).reset());

    const rangeY = {
      start: this.startXAxis?.size ?? 18,
      end: this.clientHeight - (this.endXAxis?.size ?? 18)
    };
    this.axesY.forEach(y => y.setRange(rangeY).reset());
    
    return this;
  }

  renderGrid() {
    const { startXAxis, endXAxis, startYAxis, endYAxis } = this;
    const xaxis = endXAxis ?? startXAxis;
    const yaxis = startYAxis ?? endYAxis;
    
    if (!(yaxis && xaxis)) return;

    const suppressSecondary = startYAxis && endYAxis && startYAxis.gridlines.length !== endYAxis.gridlines.length;
    const secondaryLines = suppressSecondary ? [] : [...yaxis.gridlines];
    if (!suppressSecondary) {
      if (!startXAxis) secondaryLines.push(yaxis.invert ? yaxis.gridMax : yaxis.gridMin);
      if (!endXAxis) secondaryLines.push(yaxis.invert ? yaxis.gridMin : yaxis.gridMax);
    }

    const primaryLines = [];
    if (startXAxis) primaryLines.push(yaxis.invert ? yaxis.gridMax : yaxis.gridMin)
    if (endXAxis) primaryLines.push(yaxis.invert ? yaxis.gridMin : yaxis.gridMax);
    
    const { start, end } = xaxis.range;

    return svg`
      <g class="chart-gridlines">
        ${secondaryLines.map(gl => svg`
          <line class="secondary" x1=${start} y1=${yaxis.tr(gl)} x2=${end} y2=${yaxis.tr(gl)} />
        `)}
        ${primaryLines.map(gl => svg`
          <line class="primary" x1=${start} y1=${yaxis.tr(gl)} x2=${end} y2=${yaxis.tr(gl)} />
        `)}
      </g>
    `;
  }

  render() {
    render(this.shadowRoot, html`
      <style>
        :host {
          overflow: hidden;
        }

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

        .chart-gridlines {
          translate: 0 0.5px;
        }

        .chart-x-axis {
          translate: 0.5px calc(100% - 29.5px);
        }
        .chart-x-axis--start {
          translate: 0.5px 0px;
        }
        
        .chart-y-axis {
          translate: 44px 0.5px;
        }        
        .chart-y-axis--end {
          translate: calc(100% - 44px) 0.5px;
        }

        .chart-lines polyline {
          fill: none;
          stroke-width: 3;
        }
        .chart-lines polyline:nth-of-type(1) {
          stroke: #5B91F4;
        }
        .chart-lines polyline:nth-of-type(2) {
          stroke: #3CCECE;
        }
        .chart-lines polyline:nth-of-type(3) {
          stroke: #FFC043;
        }
        .chart-lines polyline:nth-of-type(4) {
          stroke: #E28454;
        }
        .chart-lines polyline:nth-of-type(5) {
          stroke: #174291;
        }
      </style>
      ${svg`
        <svg 
          viewbox=${`0 0 ${this.clientWidth} ${this.clientHeight}`} 
          width="${this.clientWidth}" 
          height="${this.clientHeight}"
        >
          ${this.startXAxis?.render()}
          ${this.endXAxis?.render()}
          ${this.startYAxis?.render()}
          ${this.endYAxis?.render()}
          ${this.renderGrid()}
          ${this.renderers.map(r => r.render())}
        </svg>
      `}
    `);
  }

  getDefaultXAxis() {
    throw new Error('Not implemented');
  }

  getDefaultYAxis() {
    throw new Error('Not implemented');
  }
}
