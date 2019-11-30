export class LoopedList<T> {
  public items: T[];

  constructor(iter: Iterable<T>) {
    this.items = [...iter];
  }

  public get(index: number) {
    return this.items[this.correctIndex(index)];
  }

  public correctIndex(index: number) {
    const l = this.items.length;
    return index >= 0 ? index % l : (index % l + l) % l;
  }

  public set(index: number, value: T) {
    return (this.items[this.correctIndex(index)] = value);
  }

  public replaceItems(iter: Iterable<T>) {
    this.items = [...iter];
  }
}
