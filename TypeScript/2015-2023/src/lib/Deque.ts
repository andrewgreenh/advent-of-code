import { enumerate } from './ts-it/enumerate';

interface Node<T> {
  value: T;
  next: Node<T>;
  previous: Node<T>;
}

export class Deque<T> {
  private head?: Node<T>;
  private size = 0;

  public get length() {
    return this.size;
  }

  constructor(...values: T[]) {
    for (const value of values) this.push(value);
  }

  public push(...values: T[]) {
    for (const value of values) {
      this.size++;
      if (!this.head) {
        let node: any = { value };
        node.next = node;
        node.previous = node;
        this.head = node;
      } else {
        let previous = this.head.previous;
        this.head.previous = { value, next: this.head, previous };
        previous.next = this.head.previous;
      }
    }
  }

  [Symbol.iterator]() {
    return this.values();
  }

  public unshift(...values: T[]) {
    for (const value of values) {
      this.push(value);
      this.rotate(1);
    }
  }

  public rotate(n: number) {
    if (!this.head) return;
    let rotateLeft = n < 0;
    n = Math.abs(n);
    for (let i = 0; i < n; i++) {
      this.head = rotateLeft ? this.head.next : this.head.previous;
    }
  }

  public peek(): T | undefined {
    if (!this.head) return undefined;
    return this.head.previous.value;
  }

  public peekLeft(): T | undefined {
    if (!this.head) return undefined;
    return this.head.value;
  }

  public pop(): T | undefined {
    if (!this.head) return undefined;
    this.size--;
    const popped = this.head.previous;
    if (popped === this.head) {
      this.head = undefined;
    } else {
      popped.next.previous = popped.previous;
      popped.previous.next = popped.next;
    }
    return popped.value;
  }

  public shift(): T | undefined {
    this.rotate(-1);
    return this.pop();
  }

  public *values() {
    if (!this.head) return;
    let current = this.head.next;
    yield this.head.value;
    while (current !== this.head) {
      yield current.value;
      current = current.next;
    }
  }

  public indexOf(needle: T) {
    for (let [index, value] of enumerate(this.values()))
      if (value === needle) return index;
    return -1;
  }

  public get(needle: number) {
    for (let [index, value] of enumerate(this.values()))
      if (index === needle) return value;
  }
}
