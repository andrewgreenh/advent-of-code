import { Vector } from './InfiniteGrid';

export const fourDirectionOffsets = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
] as Vector[];

export const dirIndexByName = {
  up: 0,
  right: 1,
  down: 2,
  left: 3,
};

export function turnLeft(dirIndex: number) {
  return (dirIndex + 3) % 4;
}
export function turnRight(dirIndex: number) {
  return (dirIndex + 1) % 4;
}

export function move(v: Vector, movementVector: Vector): Vector {
  let [x, y] = v;
  let [xo, yo] = movementVector;
  return [x + xo, y + yo];
}
