import getInput from '../lib/getInput';

const input = getInput(4, 2017).trim();

const parse = x => x.split('\n').map(x => x.split(' '));

const hasNoDuplicates = row => new Set(row).size === row.length;
const sortWord = word => [...word].sort().join('');
const result = rowMapper => parse(input).map(rowMapper).filter(hasNoDuplicates).length;

console.log([row => row, row => row.map(sortWord)].map(result));
