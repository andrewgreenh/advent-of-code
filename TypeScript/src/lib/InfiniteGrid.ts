import combinations from './combinations';
import { enumerate } from './ts-it/enumerate';
import { map } from './ts-it/map';
import { range } from './ts-it/range';

export interface Vector extends ReadonlyArray<number> {
  [0]: number;
  [1]: number;
  [Symbol.iterator](): IterableIterator<number>;
}

export class InfiniteGrid<CellType, DefaultType = undefined> {
  private grid: {
    [key: string]: CellType | undefined;
  } = {};
  public maxX = -Infinity;
  public minX = Infinity;
  public maxY = -Infinity;
  public minY = Infinity;

  public constructor(
    private defaultFactory: (p: Vector) => DefaultType = () => undefined as any,
  ) {}

  private getId([x, y]: Vector) {
    return `${x}-${y}`;
  }

  public set(p: Vector, v: CellType) {
    const [x, y] = p;
    if (x < this.minX) this.minX = x;
    if (x > this.maxX) this.maxX = x;
    if (y < this.minY) this.minY = y;
    if (y > this.maxY) this.maxY = y;
    const id = this.getId(p);
    this.grid[id] = v;
  }

  public get(p: Vector) {
    const id = this.getId(p);
    if (!(id in this.grid)) {
      this.set(p, this.defaultFactory(p) as any);
    }
    return this.grid[id] as CellType | DefaultType;
  }

  public *neighbours(p: Vector) {
    const neighbourVectors = [...this.neighbourVectors(p)];
    yield* map<Vector, CellType | DefaultType>(p => this.get(p))(
      neighbourVectors,
    );
  }

  public *neighbourVectors([x, y]: Vector): IterableIterator<Vector> {
    const deltas = <Vector[]>(<any>combinations([-1, 0, 1], 2, true));
    yield* deltas
      .filter(([dx, dy]) => dx !== 0 || dy !== 0)
      .map<Vector>(([dx, dy]) => [x + dx, y + dy]);
  }

  public *spiralAround([x, y]: Vector): IterableIterator<Vector> {
    let stepSize = 1;
    let step = -1;
    const moves = [() => y++, () => x++, () => y--, () => x--];
    while (true) {
      for (let move of moves) {
        for (let i = 0; i < stepSize; i++, move(), step++) {
          yield [x, y];
        }
        if (moves.indexOf(move) % 2 !== 0) stepSize++;
      }
    }
  }

  public toGrid(): (CellType | DefaultType)[][] {
    let grid: (CellType | DefaultType)[][] = [];
    for (const [yi, y] of enumerate(range(this.minY, this.maxY + 1))) {
      for (const [xi, x] of enumerate(range(this.minX, this.maxX + 1))) {
        if (!grid[yi]) grid[yi] = [];
        grid[yi][xi] = this.get([x, y]);
      }
    }
    return grid;
  }
}
