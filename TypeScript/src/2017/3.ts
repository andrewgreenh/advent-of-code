import * as _ from 'lodash';
import getInput from '../lib/getInput';

const input = +getInput(3, 2017).trim();

let grid: { [key: string]: number } = {};

interface Vector {
  [0]: number;
  [1]: number;
  [Symbol.iterator](): Iterator<number>;
}

function walkTheGrid<T>(
  positionCallback: (
    gridStuff: {
      position: Vector;
      get: (position: Vector) => T;
      set: (value: T) => void;
      getNeighbours: () => T[];
      index: number;
    },
  ) => boolean | void,
) {
  const grid: { [key: string]: T } = {};
  let position: Vector = [0, 0];
  let direction: Vector = [0, 1];
  let index = 0;
  const move: (a: Vector, b: Vector) => Vector = ([x, y], [vx, vy]) => [x + vx, y + vy];
  const get: (position: Vector) => T = ([x, y]) => grid[`${x}-${y}`];
  const set: (value: T) => void = value => (grid[`${position[0]}-${position[1]}`] = value);
  const turn: (direction: Vector) => Vector = ([x, y]: Vector) => {
    return [x === 1 || x === -1 ? 0 : y, y === 1 || y === -1 ? 0 : -x];
  };
  const canTurn = () => get(move(position, turn(direction))) === undefined;
  const getNeighbours: () => T[] = () => {
    const [x, y] = position;
    return [
      [x + 1, y],
      [x + 1, y - 1],
      [x, y - 1],
      [x - 1, y - 1],
      [x - 1, y],
      [x - 1, y + 1],
      [x, y + 1],
      [x + 1, y + 1],
    ].map(([x, y]) => get([x, y]));
  };
  while (!positionCallback({ position, get, set, getNeighbours, index })) {
    index++;
    if (canTurn()) direction = turn(direction);
    position = move(position, direction);
  }
}

walkTheGrid(({ index, position: [x, y], set }) => {
  const nextValue = index + 1;
  if (nextValue === input) {
    console.log(Math.abs(x) + Math.abs(y));
    return true;
  }
  set(nextValue);
});

walkTheGrid<number>(({ position: [x, y], set, getNeighbours }) => {
  const nextValue =
    getNeighbours()
      .map(val => val || 0)
      .reduce((a, b) => a + b, 0) || 1;
  if (nextValue > input) {
    console.log(nextValue);
    return true;
  }
  set(nextValue);
});
