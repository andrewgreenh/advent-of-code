import getInput from '../lib/getInput';
import { numbers } from '../lib/ts-it/numbers';

const input = getInput(21, 2021);
const [, p1, , p2] = numbers(input);
const cache = new Map<string, Pair>();

console.log(play(deterministicDice(), Number(p1) - 1, Number(p2) - 1));
console.log(solve([p1 - 1, p2 - 1], [0, 0], 0, 3));

type Pair = [number, number];

function solve(pos: Pair, score: Pair, turn: 0 | 1, openThrows: number): Pair {
  const key = JSON.stringify(arguments);
  if (cache.has(key)) return cache.get(key)!;
  if (score[0] > 20) return [1, 0];
  if (score[1] > 20) return [0, 1];
  if (openThrows === 0) {
    const newScore = [score[0], score[1]] as Pair;
    newScore[turn] += pos[turn] + 1;
    return solve(pos, newScore, (1 - turn) as 0 | 1, 3);
  }

  let wins = [0, 0] as Pair;
  for (let i = 1; i <= 3; i++) {
    const newPos = [pos[0], pos[1]] as Pair;
    newPos[turn] = (newPos[turn] + i) % 10;
    let results = solve(newPos, score, turn, openThrows - 1);
    wins[0] += results[0];
    wins[1] += results[1];
  }
  cache.set(key, wins);
  return wins;
}

function* deterministicDice() {
  while (true) {
    for (let i = 1; i <= 100; i++) yield i;
  }
}

function play(dice: Iterator<number, void>, p1Pos: number, p2Pos: number) {
  let p1 = { pos: p1Pos, score: 0 };
  let p2 = { pos: p2Pos, score: 0 };
  let player = p1;
  let i = 0;
  while (p1.score < 1000 && p2.score < 1000) {
    let x = dice.next().value!;
    let y = dice.next().value!;
    let z = dice.next().value!;
    i += 3;
    player.pos += x + y + z;
    if (player.pos > 9) player.pos = player.pos % 10;
    player.score += player.pos + 1;
    player = player === p1 ? p2 : p1;
  }

  const winner = p1.score > p2.score ? p1 : p2;
  const loser = winner === p1 ? p2 : p1;

  return loser.score * i;
}
