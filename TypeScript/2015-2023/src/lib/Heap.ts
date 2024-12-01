export interface ShouldBeBefore<T> {
  (a: T, b: T): boolean;
}

class Heap<T> {
  private items: T[] = [];

  public get size(): number {
    return this.items.length - 1;
  }

  constructor(private shouldBeBefore: ShouldBeBefore<T>) {
    this.items.length = 1;
  }

  private getParentIndexOf(index: number) {
    if (index === 1) return index;
    return Math.floor(index / 2);
  }

  private getLeftChildIndexOf(index: number) {
    return 2 * index;
  }

  private getRightChildIndexOf(index: number) {
    return 2 * index + 1;
  }

  private siftUp(startIndex: number) {
    if (startIndex === 1) return;
    const item = this.items[startIndex];
    const parentIndex = this.getParentIndexOf(startIndex);
    const parentItem = this.items[parentIndex];
    const shouldBeBefore = this.shouldBeBefore(item, parentItem);
    if (!shouldBeBefore) return;
    this.items[parentIndex] = item;
    this.items[startIndex] = parentItem;
    this.siftUp(parentIndex);
  }

  private siftDown(startIndex: number) {
    const item = this.items[startIndex];
    const leftChildIndex = this.getLeftChildIndexOf(startIndex);
    const rightChildIndex = this.getRightChildIndexOf(startIndex);
    const leftChild = this.items[leftChildIndex];
    const rightChild = this.items[rightChildIndex];
    const isLeaf = !leftChild && !rightChild;
    if (isLeaf) return;
    const leftIsSwapCandidate = rightChild
      ? this.shouldBeBefore(leftChild, rightChild)
      : true;
    const swapIndex = leftIsSwapCandidate ? leftChildIndex : rightChildIndex;
    const swapChild = this.items[swapIndex];
    if (this.shouldBeBefore(item, swapChild)) return;
    this.items[swapIndex] = item;
    this.items[startIndex] = swapChild;
    this.siftDown(swapIndex);
  }

  public add(item: T) {
    this.items.push(item);
    this.siftUp(this.items.length - 1);
  }

  public peek(): T {
    return this.items[1];
  }

  public pop(): T | undefined {
    if (this.size === 0) return undefined;
    const item = this.items[1];
    const lastItem = this.items[this.size];
    this.items[1] = lastItem;
    this.items.pop();
    this.siftDown(1);
    return item;
  }

  public popAll(): T[] {
    const result: T[] = [];
    while (this.size !== 0) result.push(this.pop() as T);
    return result;
  }
}

export default Heap;
