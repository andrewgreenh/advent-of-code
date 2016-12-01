var input = require('../getInput')(1);
const _ = require('lodash');
require('../loadScan');

var floors = _(input).scan((a, e) => e == '(' ? a+1 : a-1, 0);
console.log(floors.last(), floors.indexOf(-1));
