import { sumBy } from 'lodash';
import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(2, 2022);
const lines = stringToLines(input).map((p) => p.split(' '));

const picks = ['R', 'P', 'S'] as const;
const losesTo = { R: 'P', P: 'S', S: 'R' };
const scoreByPick = { R: 1, P: 2, S: 3 };

function calcScore([elfPick, yourPick]: string[]) {
  const youWin = losesTo[elfPick] === yourPick;
  const outcomeScore = youWin ? 6 : elfPick === yourPick ? 3 : 0;
  return scoreByPick[yourPick] + outcomeScore;
}

const part1Picks = lines.map(([elf, yourPick]) => [
  picks['ABC'.indexOf(elf)],
  picks['XYZ'.indexOf(yourPick)],
]);

const part2Picks = lines.map(([elf, yourStrat]) => [
  picks['ABC'.indexOf(elf)],
  picks[('ABC'.indexOf(elf) + 3 + [-1, 0, 1]['XYZ'.indexOf(yourStrat)]) % 3],
]);

console.log(sumBy(part1Picks, calcScore));
console.log(sumBy(part2Picks, calcScore));
