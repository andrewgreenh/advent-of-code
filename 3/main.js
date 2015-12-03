const _ = require('lodash');
var input = require('../getInput')(3);
require('../loadScan');

var toCoordinates = _.wrap((x, y, move) => {
	if(move == '>') return [x+1, y];
	if(move == 'v') return [x, y+1];
	if(move == '<') return [x-1, y];
	if(move == '^') return [x, y-1];
}, (fn, coords, move) => fn(coords[0], coords[1], move));

var result1 = _(input).scan(toCoordinates, [0,0]).uniq(false, c => c[0]+','+c[1]).value().length;
var result2 = _(input).partition((e, i) => i % 2 == 0)
	.map((input) => _(input).scan(toCoordinates, [0,0]).value())
  .union().flatten().uniq(false, c => c[0]+','+c[1]).value().length;
console.log(result1, result2);
