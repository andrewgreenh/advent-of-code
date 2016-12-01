const _ = require('lodash');
const input = require('../getInput')(3);
require('../loadScan');

const toCoordinates = ([x, y], mv) => {
	if(mv=='>') return [x+1, y];
	if(mv=='v') return [x, y+1];
	if(mv=='<') return [x-1, y];
	if(mv=='^') return [x, y-1];
};

var result1 = _(input)
  .scan(toCoordinates, [0,0])
  .uniq(false, ([x,y]) => x+','+y)
  .value().length;

var result2 = _(input)
  .partition((e, i) => i % 2 == 0)
	.map((input) => _(input).scan(toCoordinates, [0,0]).value())
  .union()
  .flatten()
  .uniq(false, ([x,y]) => x+','+y)
  .value().length;

console.log(result1, result2);
