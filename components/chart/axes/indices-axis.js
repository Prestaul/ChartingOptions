import { sharpen } from '../utils.js';

export function IndicesAxisMixin(proto) {
  Object.assign(proto, {
    onConstruction(dataset, range, options) {
      // Properties
      this.hasPadding = true;
      this.gridlines = [];
  
      // Accessors
      Object.defineProperties(this, {
        firstIndex: { get() { return this.ds?.firstIndex; } },
        length: { get() { return this.ds?.length; } },
      });
  
      // Apply options
      if (options?.hasPadding != null) this.hasPadding = !!options.hasPadding;
    },
  
    onInit() {
      if (this.hasAttribute('hasPadding')) this.hasPadding = true;
    },
  
    setPadding(hasPadding) {
      this.hasPadding = !!hasPadding;
      return this;
    },
  
    getValue(index) {
      return index;
    },
  
    getLabel(index) {
      const dt = new Date(this.ds.getValue(index, 'timestamp'));
      return `${dt.getMonth() + 1}/${dt.getDate()}`;
    },
  
    transform(index) {
      const { invert, hasPadding, firstIndex, length, range: { start, end, size } } = this;
      if (invert) {
        return (firstIndex - index - (hasPadding ? 0.5 : 0)) * size / (length - (hasPadding ? 0 : 1)) + end;
      } else {
        return (index - firstIndex + (hasPadding ? 0.5 : 0)) * size / (length - (hasPadding ? 0 : 1)) + start;
      }
    },
    t(index) { return this.transform(index); },
    ts(index) { return sharpen(this.transform(index)); },
    tr(index) { return Math.round(this.transform(index)); },
  
    transformValue(index) {
      return this.transform(index);
    },
    tv(index) { return this.transform(index); },
    tvs(index) { return sharpen(this.transform(index)); },
    tvr(index) { return Math.round(this.transform(index)); },
  
    reverse(position) {
      return this.firstIndex + Math.round((position - this.near) * (this.length - (this.hasPadding ? 0 : 1)) / this.destSize);
    },
  
    calculateMinValue() {
      return this.firstIndex;
    },
    calculateMaxValue() {
      return this.firstIndex + this.length - 1;
    },
  
    reset() {
      this.minValue = this.calculateMinValue();
      this.maxValue = this.calculateMaxValue();
      return this.resetGridlines();
    },
  
    resetGridlines() {
      var segmentCount = this.length - 1,
        interval = Math.floor(segmentCount / this.targetGridlines) || 1,
        lineCount = Math.round((segmentCount + 1) / interval),
        offset = Math.round((segmentCount - (lineCount - 1) * interval) / 2);

      this.gridlines = [];
      for (var i = 0; i < lineCount; i++) {
        this.gridlines.push(this.firstIndex + offset + i * interval);
      }
  
      return this;
    }
  });
}
