var input = require('../getInput')(1);
const _ = require('lodash');
require('../loadScan');

var result1 = _(input).scan((a, e) => e == '(' ? a+1 : a-1, 0).last();
var result2 = _(input).scan((a, e) => e == '(' ? a+1 : a-1, 0).indexOf(-1);
console.log(result1, result2);
