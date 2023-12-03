import fs from 'fs';
import path, { join } from 'path';
import { fileURLToPath } from 'url';

const day = process.argv[2];
const year = process.argv[3];

const content = `import { asyncGetInput } from '../lib/getInputAsync';
import { stringToLines } from '../lib/ts-it/lines';
import { numbers } from '../lib/ts-it/numbers';

const input = await asyncGetInput(${+day}, ${year});
const nums = numbers(input);
const lines = stringToLines(input);

let result
for (const line of lines) {
  console.log(line)
}

console.log(result)

`;

const dirname =
  typeof __dirname !== 'undefined'
    ? __dirname
    : join(fileURLToPath(import.meta.url), '..');

fs.writeFileSync(path.join(dirname, `src/${year}/${day}.ts`), content);
fs.writeFileSync(path.join(dirname, `src/${year}/${day}.txt`), '');
