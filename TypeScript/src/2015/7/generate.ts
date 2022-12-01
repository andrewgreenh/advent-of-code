import fs from 'fs';
import path from 'path';
// import webpack from 'webpack';
import getInput from '../../lib/getInput';
import { stringToLines } from '../../lib/ts-it/lines';
let input = getInput(7, 2015);

for (let line of stringToLines(input)) {
  let [command, fileName] = line.split(' -> ');
  let [a, b, c] = command.split(' ');
  const fileContent = getContent(command, a, b, c);
  fs.writeFileSync(
    path.join(__dirname, 'circuit', fileName) + '.ts',
    fileContent,
  );
}

fs.writeFileSync(
  path.join(__dirname, 'circuit', 'b.ts'),
  `module.exports = 46065`,
);

// webpack(
//   {
//     entry: path.join(__dirname, 'run.js'),
//     output: {
//       path: __dirname,
//       filename: 'bundle.js',
//     },
//   },
//   (err, stats) => {},
// );

function getContent(command, a, b, c) {
  if (command.match(/^\d*$/)) return `module.exports = ${command}`;
  if (command.match(/AND/))
    return `module.exports = ${getValue(a)} & ${getValue(c)}`;
  if (command.match(/OR/))
    return `module.exports = ${getValue(a)} | ${getValue(c)}`;
  if (command.match(/LSHIFT/))
    return `module.exports = ${getValue(a)} << ${getValue(c)}`;
  if (command.match(/RSHIFT/))
    return `module.exports = ${getValue(a)} >> ${getValue(c)}`;
  if (command.match(/NOT/)) return `module.exports = ~${getValue(b)}`;
  return `module.exports = ${getValue(a)}`;
}

function getValue(numberOrName) {
  const isNumber = numberOrName.match(/^\d*$/);
  return isNumber ? numberOrName : `require('./${numberOrName}')`;
}
