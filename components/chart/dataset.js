export class Dataset {
  #data = null;
  #firstIndex = 0;
  #length = 0;
  #cache = {};

  constructor(data) {
    if (data) this.data = data;
  }

  get data() { return this.#data; }
  set data(data) {
    if (!(data instanceof Array && data.length >= 2))
      throw new Error('Data provided to a Dataset must be of type Array and have a length of at least two.');
    this.#data = data;
    this.firstIndex = 0;
    this.length = this.data.length;
    this.reset();
  }

  get firstIndex() { return this.#firstIndex; }
  set firstIndex(firstIndex) { this.#firstIndex = firstIndex; }

  get length() { return this.#length; }
  set length(length) { this.#length = length; }

  reset(firstIndex, length) {
    if (Number.isInteger(firstIndex)) {
      this.#firstIndex = Math.min(Math.max(0, firstIndex), this.data.length - 2);
    }

    length = Number.isInteger(length) ? length : this.#length;
    this.#length = Math.min(Math.max(2, length), this.data.length - this.#firstIndex);

    this.#cache = {};
  }
  cache(key, getter, args) {
    return this.#cache[key] || (this.#cache[key] = getter.apply(this, args || []));
  }

  getValue(index, seriesName) {
    return this.getSeries(seriesName)[index - this.#firstIndex];
  }

  getLastIndex() {
    return this.#firstIndex + this.#length - 1;
  }

  getSeries(seriesName) {
    return this.cache(seriesName, () => this.#data
      .map(row => (seriesName in row) ? row[seriesName] : null)
    ).slice(this.#firstIndex, this.#firstIndex + this.#length);
  }
  getMappedSeries(seriesName, key, mapper) {
    return this.cache(seriesName + '~' + key, () => this.getSeries(seriesName).map(mapper));
  }
  getNumericSeries(seriesName) {
    return this.getMappedSeries(seriesName, 'numeric', value => parseFloat(value, 10));
  }
  getIntegerSeries(seriesName) {
    return this.getMappedSeries(seriesName, 'integers', value => value.getTime ? value.getTime() : value ^ 0);
  }

  getMin(seriesName) {
    return this.cache(seriesName + '~min', () => {
      const series = this.getNumericSeries(seriesName);
      let min = Number.MAX_VALUE;
      let i = series.length;

      while (i--) if (series[i] < min && !Number.isNaN(series[i])) min = series[i];

      return (min === Number.MAX_VALUE) ? 0 : min;
    });
  }
  getMax(seriesName) {
    return this.cache(seriesName + '~max', function() {
      const series = this.getNumericSeries(seriesName);
      let max = Number.MIN_VALUE;
      let i = series.length;

      while (i--) if (series[i] > max && !Number.isNaN(series[i])) max = series[i];

      return (max === Number.MIN_VALUE) ? 0 : max;
    });
  }
}
