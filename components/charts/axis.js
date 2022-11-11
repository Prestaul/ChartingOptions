import { DhtmlElement } from '/dhtml/define.js';

export class AxisElement extends DhtmlElement {
  unit = null;

  init() {
    this.unit = this.getAttribute('unit');
  }

  getLabel(val) {
    return val + (this.unit ?? '');
  }
}
