import { intersection } from 'lodash';
import getInput from '../lib/getInput';
import { p } from '../lib/ts-it/pipe';
import { sumBy } from '../lib/ts-it/sumBy';

const input = getInput(6, 2020);
const groups = input.split('\n\n').map((g) => g.split('\n'));

p(groups)(
  sumBy((g) => new Set(g.join('')).size),
  console.log,
);
p(groups)(
  sumBy((g) => intersection(...g.map((l) => l.split(''))).length),
  console.log,
);
