const _ = require('lodash');
const input = require('../getInput')(3, 2017).trim();

const parse = x => x;

const result1 = _(input).thru(parse);

const result2 = _(input).thru(parse);

console.log(result1);
// console.log(result2);
