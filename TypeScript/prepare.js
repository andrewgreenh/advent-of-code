const fs = require('fs');
const path = require('path');

const day = process.argv[2];
const year = process.argv[3];

const content = `import getInput from '../lib/getInput'
import { iterable } from '../lib/ts-it/iterable';
import { lines as stringToLines } from '../lib/ts-it/lines';
import { p } from '../lib/ts-it/pipe';

const input = getInput(${+day}, ${year});
const lines = iterable(() => p(input)(stringToLines));

let result
for (const line of lines) {
  console.log(line)
}

console.log(result)

`;

fs.writeFileSync(path.join(__dirname, `src/${year}/${day}.ts`), content);
