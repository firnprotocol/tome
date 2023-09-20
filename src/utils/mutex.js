export class OrderedMutex {
  constructor() {
    this.state = 0;
    this.callbacks = {};
  }

  acquire(i) {
    if (this.state === i) {
      return Promise.resolve();
    }
    return new Promise((resolve) => {
      this.callbacks[i] = resolve;
    });
  }

  release() {
    this.state++;
    if (this.callbacks[this.state] !== undefined) this.callbacks[this.state]();
  }
}
