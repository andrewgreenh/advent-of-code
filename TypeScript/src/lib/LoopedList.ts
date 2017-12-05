export class LoopedList<T> {
  private items: T[]

  constructor(iter: Iterable<T>) {
    this.items = [...iter]
  }

  public get(index: number) {
    return this.items[this.correctIndex(index)]
  }

  private correctIndex(index: number) {
    return index >= 0 ? index % this.items.length : this.items.length + index % this.items.length
  }

  public set(index: number, value: T) {
    return (this.items[this.correctIndex(index)] = value)
  }

  public replaceItems(iter: Iterable<T>) {
    this.items = [...iter]
  }
}
