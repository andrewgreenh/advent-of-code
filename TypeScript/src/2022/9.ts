import { pipe, range } from 'remeda';
import { dirIndexByName, fourDirectionOffsets } from '../lib/directions';
import getInput from '../lib/getInput';
import {
  euclidDist,
  Vector2D,
  vectorAddM,
  vectorDifference,
} from '../lib/math/vectors';
import { stringToLines } from '../lib/ts-it/lines';
import slide from '../lib/ts-it/slide';

const input = getInput(9, 2022);
const lines = stringToLines(input);

let length = 10;
let snake = range(0, length).map((i) => [0, 0] as Vector2D);

const directionByLetter = {
  D: fourDirectionOffsets[dirIndexByName.down],
  U: fourDirectionOffsets[dirIndexByName.up],
  L: fourDirectionOffsets[dirIndexByName.left],
  R: fourDirectionOffsets[dirIndexByName.right],
};

let history1 = new Set<string>();
let history2 = new Set<string>();

history1.add(snake.at(1)!.join('---'));
history2.add(snake.at(-1)!.join('---'));

for (const line of lines) {
  const [dir, len] = line.split(' ');
  for (let i = 0; i < +len; i++) {
    vectorAddM(snake[0], directionByLetter[dir]);

    for (const [head, tail] of pipe(snake, slide(2))) {
      const dist = euclidDist(head, tail);
      if (dist < 2) continue;
      const [dx, dy] = vectorDifference(head, tail);
      if (dx !== 0) tail[0] += Math.sign(dx);
      if (dy !== 0) tail[1] += Math.sign(dy);
    }
    history1.add(snake.at(1)!.join('---'));
    history2.add(snake.at(-1)!.join('---'));
  }
}

console.log(history1.size, history2.size);
