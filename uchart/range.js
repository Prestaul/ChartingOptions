export class Range {
  #start = 0;
  #size = 0;

  get start() { return this.#start; }
  set start(start) { this.#start = start; }

  get end() { return this.#start + this.#size; }
  set end(end) { this.#size = end - this.#start; }

  get size() { return this.#size; }
  set size(size) { this.#size = size; }

  set({ start, end, size }) {
    if (start != null) this.start = start;
    if (size != null) this.size = size;
    if (end != null) this.end = end;
  }
}
