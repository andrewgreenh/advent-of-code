const fs = require('fs');
const path = require('path');

const day = process.argv[2];
const year = process.argv[3];

const content = `import * as _ from 'lodash';
import getInput from '../lib/getInput';

const input = getInput(${+day}, ${+year}).trim();

const parse = x => x;

const result1 = _(input).thru(parse);
// const result2 = _(input).thru(parse);

console.log(result1);
// console.log(result2);
`;

fs.writeFileSync(path.join(__dirname, `src/${year}/${day}.ts`), content);
