import { isNumber, nullableNumber, sharpen } from '../utils.js';

export function NumericAxisMixin(proto) {
  Object.assign(proto, {
    onConstruction() {
      // Properties
      this.keepZeroVisible = false;
      this.artificialMin = null;
      this.artificialMax = null;
      this.minGridlines = 2;
    
      this.autoCalcGridlines = true;
      this.gridMin = 0;
      this.gridMax = 1;
    
      this.gridlines = [];      
    },
  
    onInit() {
      if (this.hasAttribute('keepZeroVisible')) this.keepZeroVisible = true;
      this.artificialMin = nullableNumber(this.getAttribute('artificialMin')) ?? this.artificialMin;
      this.artificialMax = nullableNumber(this.getAttribute('artificialMax')) ?? this.artificialMax;
      this.minGridlines = nullableNumber(this.getAttribute('minGridlines')) ?? this.minGridlines;
    },
  
    setKeepZeroVisible(keepZeroVisible) {
      this.keepZeroVisible = keepZeroVisible;
      return this;
    },
  
    transform(value) {
      const { invert, gridMin, gridMax, range: { start, end, size } } = this;
      if (invert) {
        return (gridMin - value) * size / (gridMax - gridMin) + end;
      } else {
        return (value - gridMin) * size / (gridMax - gridMin) + start;
      }
    },
    t(value) { return this.transform(value); },
    ts(value) { return sharpen(this.transform(value)); },
    tr(value) { return Math.round(this.transform(value)); },
  
    transformValue(index, seriesName) {
      return this.transform(this.getValue(index, seriesName));
    },
    tv(index, seriesName) { return this.transformValue(index, seriesName); },
    tvs(index, seriesName) { return sharpen(this.transformValue(index, seriesName)); },
    tvr(index, seriesName) { return Math.round(this.transformValue(index, seriesName)); },
  
    calculateMinValue() {
      return Math.min.apply(Math, this.series.map(seriesName => this.ds.getMin(seriesName)));
    },
    calculateMaxValue() {
      return Math.max.apply(Math, this.series.map(seriesName => this.ds.getMax(seriesName)));
    },
  
    reset() {
      let minValue = isNumber(this.artificialMin) ? this.artificialMin : this.calculateMinValue();
      let maxValue = isNumber(this.artificialMax) ? this.artificialMax : this.calculateMaxValue();
  
      if (this.keepZeroVisible) {
        if (minValue > 0) {
          minValue = 0;
        } else if (maxValue < 0) {
          maxValue = 0;
        }
      }
  
      this.minValue = this.gridMin = minValue;
      this.maxValue = this.gridMax = maxValue;
      this.gridlines = [];

      if (this.autoCalcGridlines) {
        this.resetGridlines();
      }
  
      return this;
    },
  
    /**
     * Calculate values for gridlines
     */
    resetGridlines() {
      let minValue = this.minValue;
      let maxValue = this.maxValue;

      // if(maxValue == minValue) {
      // 	//Fudge it a little bit
      // 	minValue = 0;
      // 	maxValue = 10;
      // }
  
      if (!(maxValue - minValue)) { // jshint ignore:line
        const adjust = Math.abs((maxValue && maxValue / 10) || 0.1);
        maxValue += adjust;
        minValue -= adjust;
      }
  
      let interval = (maxValue - minValue) / (this.targetGridlines + 1);
      const magnitude = Math.log(interval) / Math.log(10);
  
      interval = 10 ** Math.floor(magnitude);
  
      const intervals = [
        interval,
        (interval == 0.01 ? 0.02 : 2.5 * interval), // 2 cent intervals instead of 2.5 cents
        5 * interval,
        10 * interval
      ];
  
      let bestDiff = null, bestInterval = null;
      for (let i = 0; i < intervals.length; i++) {
        interval = intervals[i];
  
        const lineCnt = Math.ceil(maxValue / interval) - Math.floor(minValue / interval) - 1;
        const diff = Math.round(Math.abs(this.targetGridlines - lineCnt));
  
        if (lineCnt >= this.minGridlines && (bestDiff === null || diff <= bestDiff)) {
          bestDiff = diff;
          bestInterval = interval;
        }
      }
  
      if (!bestInterval) bestInterval = intervals[0];
  
      this.gridMin = Math.floor(minValue / bestInterval) * bestInterval;
      this.gridMax = Math.ceil(maxValue / bestInterval) * bestInterval;
  
      this.gridlines = [];
      for (let line = this.gridMin + bestInterval; line < this.gridMax; line += bestInterval)
        this.gridlines.push(line);
    }
  });
}
