import Heap from './Heap';

const shouldBeBefore = (a: number, b: number) => a < b;

let heap: Heap<number>;

beforeEach(() => {
  heap = new Heap<number>(shouldBeBefore);
});

describe('Heap', () => {
  it('should return undefined when empty', () => {
    expect(heap.size).toBe(0);
    expect(heap.peek()).toBeUndefined();
    expect(heap.pop()).toBeUndefined();
    expect(heap.size).toBe(0);
  });

  it('should adapt size correctly', () => {
    heap.add(1);

    expect(heap.size).toBe(1);
    expect(heap.pop()).toBe(1);
    expect(heap.size).toBe(0);
  });

  it('should sort correctly', () => {
    const items = [10, 2, 3, 1, 12, 25, 17];
    const sorted = [1, 2, 3, 10, 12, 17, 25];

    items.forEach(item => heap.add(item));
    expect(heap.size).toBe(sorted.length);

    expect(heap.popAll()).toEqual(sorted);
    expect(heap.size).toBe(0);
  });
});
