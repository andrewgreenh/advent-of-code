import getInput from '../lib/getInput';
import { enumerate } from '../lib/ts-it/enumerate';
import { last } from '../lib/ts-it/last';
import { numbers } from '../lib/ts-it/numbers';
import { p } from '../lib/ts-it/pipe';
import { range } from '../lib/ts-it/range';
import { sumBy } from '../lib/ts-it/sumBy';

const [[header], ...boards] = getInput(4, 2021)
  .split('\n\n')
  .map((part) => part.split('\n').map(numbers));

const winners: typeof boards = [];
const results: number[] = [];

for (const num of header) {
  for (const board of boards) {
    if (winners.includes(board)) continue;
    for (const [y, row] of enumerate(board)) {
      for (const [x, cell] of enumerate(row)) {
        if (cell === num) board[y][x] = -num;
      }
    }

    for (const n of range(0, 5)) {
      if (board[n].every((x) => x < 0)) handleWinner(board, num);
      if (board[0].every((v, i) => board[i][n] < 0)) handleWinner(board, num);
    }
  }
}
console.log(results[0], last(results));

function handleWinner(board: number[][], num: number) {
  winners.push(board);
  const result = p(board.flat())(sumBy((x) => (x < 0 ? 0 : x)));
  results.push(result * num);
}
