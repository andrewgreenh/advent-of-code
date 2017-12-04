import { drop } from './drop';

class MyIter implements IterableIterator<number> {
  private values = [0, 1, 2, 3, 4, 5];
  private index = 0;
  private done = false;

  next() {
    const value = this.values[this.index];
    this.index++;
    if (value === undefined) this.done = true;
    return { done: this.done, value };
  }

  return(value?) {
    this.done = true;
    return { done: true, value };
  }

  [Symbol.iterator] = () => {
    return this;
  };
}

describe('dropWhile', () => {
  // it('should close iterator correctly', () => {
  //   const iterator = new MyIter();
  //   iterator.return = jest.fn(iterator.return);

  //   drop(3)(iterator);

  //   for (const x of iterator) {
  //     continue;
  //   }

  //   expect(iterator.return).toHaveBeenCalledTimes(1);
  // });

  it('should close iterator directly if length is exceeded', () => {
    let iterator = new MyIter();
    iterator.return = jest.fn(iterator.return);
    const callback = jest.fn();

    const droppedIterator = drop(10)(iterator);

    for (const x of droppedIterator) {
      callback();
    }

    expect(callback).not.toHaveBeenCalled();
    expect(iterator.return).toHaveBeenCalledTimes(1);
  });
});
