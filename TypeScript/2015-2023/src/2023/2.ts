import { asyncGetInput } from '../lib/getInputAsync';
import { stringToLines } from '../lib/ts-it/lines';

const input = await asyncGetInput(2, 2023);
const lines = stringToLines(input);

const maxNums = {
  red: 12,
  green: 13,
  blue: 14,
};

let possibleGames = 0;
let powers = 0;
for (const line of lines) {
  const [, id, picks] = line.match(/Game (\d+): (.*)/)!;
  const rounds = picks.split('; ').map((s) => {
    const round = {} as { [color: string]: number };
    for (const pick of s.split(', ')) {
      const [a, b] = pick.split(' ');
      round[b] = +a;
    }
    return round;
  });
  const possible = rounds.every((round) =>
    Object.entries(round).every(([color, num]) => num <= maxNums[color]),
  );
  if (possible) possibleGames += +id;

  const minColors = { red: 0, green: 0, blue: 0 };
  for (const round of rounds) {
    for (const [color, num] of Object.entries(round)) {
      minColors[color] = Math.max(minColors[color], num);
    }
  }
  powers += minColors.red * minColors.green * minColors.blue;
}

console.log(possibleGames, powers);
