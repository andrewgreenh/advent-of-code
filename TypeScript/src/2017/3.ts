import * as _ from 'lodash';
import getInput from '../lib/getInput';

const input = getInput(3, 2017).trim();

const parse = (x: string) => x;

const result1 = _(input).thru(parse);
const result2 = _(input).thru(parse);

console.log(result1);
// console.log(result2);
