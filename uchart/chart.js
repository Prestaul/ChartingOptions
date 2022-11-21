import { Dataset } from './dataset.js';

export class Chart {
  root = null;

  constructor(root, data, { observeResize = true } = {}) {
    this.root = root;
    this.dataset = new Dataset(data);

    if (observeResize) new ResizeObserver(() => this.onResize()).observe(this.root);
  }

  onResize() {
    throw new Error('Not implemented');
  }

  render() {
    throw new Error('Not implemented');
  }
}
