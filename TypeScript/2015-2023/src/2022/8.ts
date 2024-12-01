import { fourDirectionOffsets } from '../lib/directions';
import getInput from '../lib/getInput';
import { stringToLines } from '../lib/ts-it/lines';

const input = getInput(8, 2022);
const lines = stringToLines(input).map((line) => line.split('').map(Number));

let part1 = 0;
let part2 = 0;
for (let y = 0; y < lines.length; y++) {
  for (let x = 0; x < lines[y].length; x++) {
    let visible = false;
    let score = 1;
    for (const [dx, dy] of fourDirectionOffsets) {
      let nx = x + dx;
      let ny = y + dy;
      let distance = 0;
      while (true) {
        if (lines[ny]?.[nx] == null) {
          visible = true;
          break;
        }
        distance++;
        if (lines[ny][nx] >= lines[y][x]) {
          break;
        }
        nx += dx;
        ny += dy;
      }
      score *= distance;
    }
    if (visible) part1++;
    part2 = Math.max(part2, score);
  }
}
console.log(part1, part2);
