import { sortBy, sum } from 'lodash';
import getInput from '../lib/getInput';
import { numbers } from '../lib/ts-it/numbers';

const input = sortBy(getInput(1, 2022).split('\n\n').map(numbers).map(sum));

console.log(sum(input.slice(-1)));
console.log(sum(input.slice(-3)));
