import { range } from 'lodash';
import { InfiniteGrid, Vector } from './InfiniteGrid';
import { zip } from './ts-it/zip';

export class LinePainter {
  /**
   *
   * @param s Instrcution of shape 10,12 -> 26,12
   */
  static parse(s: string): [Vector, Vector] {
    const match = s.match(/(\d+),(\d+) -> (\d+),(\d+)/);
    if (!match) throw new Error(`Input ${s} does not match d,d -> d,d`);
    const [, x1, y1, x2, y2] = match.map(Number);

    return [
      [x1, y1],
      [x2, y2],
    ];
  }
  grid = new InfiniteGrid<number, number>(() => 0);

  paint(from: Vector, to: Vector) {
    const [x1, y1] = from;
    const [x2, y2] = to;
    const xRange = range(x1, x2 + Math.sign(x2 - x1));
    const yRange = range(y1, y2 + Math.sign(y2 - y1));

    for (let [x, y] of zip(xRange, yRange, { allowUnequalLength: true })) {
      x ??= x1;
      y ??= y1;
      this.grid.set([x, y], this.grid.get([x, y]) + 1);
    }
  }

  /**
   *
   * @param s Instrcution of shape 10,12 -> 26,12
   */
  paintInstruction(s: string) {
    const match = s.match(/(\d+),(\d+) -> (\d+),(\d+)/);
    if (!match) throw new Error(`Input ${s} does not match d,d -> d,d`);
    const [, x1, y1, x2, y2] = match.map(Number);
    return this.paint([x1, y1], [x2, y2]);
  }
}
