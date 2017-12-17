import { enumerate } from './ts-it/enumerate'

interface Node<T> {
  value: T
  next: Node<T>
  previous: Node<T>
}

export class Deque<T> {
  private head: Node<T>
  constructor(...values: T[]) {
    values.forEach(this.append.bind(this))
  }

  public append(value: T) {
    if (!this.head) {
      let node: any = { value }
      node.next = node
      node.previous = node
      this.head = node
    } else {
      let previous = this.head.previous
      this.head.previous = { value, next: this.head, previous }
      previous.next = this.head.previous
    }
  }

  public prepend(value: T) {
    this.append(value)
    this.rotate(1)
  }

  public rotate(n: number) {
    let rotateLeft = n < 0
    n = Math.abs(n)
    for (let i = 0; i < n; i++) {
      this.head = rotateLeft ? this.head.next : this.head.previous
    }
  }

  public *values() {
    if (!this.head) return
    let current = this.head.next
    yield this.head.value
    while (current !== this.head) {
      yield current.value
      current = current.next
    }
  }

  public indexOf(needle: T) {
    for (let [index, value] of enumerate(this.values())) if (value === needle) return index
    return -1
  }

  public get(needle: number) {
    for (let [index, value] of enumerate(this.values())) if (index === needle) return value
  }
}
