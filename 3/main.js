const getInput = require('../getInput');
const _ = require('lodash');

var startObject = ['0,0'];

getInput(3).then((input) => {
	var instructions = input.split('');

});

function solveFirst(instructions) {
	console.log(`First result: ${calcDistinctCoords(instructions).length}`);
}

function solveSecond(instructions) {
	var result = _.chain(instructions).partition((e, i) => i % 2 == 0)
		.map(calcDistinctCoords).reduce((agg, arr) => agg.concat(arr)).uniq().value().length;
	console.log(`Second result: ${result}`);
}

function addNewMove(agg, move) {
	var p = _.map(_.last(agg).split(','), (e) => parseInt(e));
	if(move == '>') agg.push((p[0]+1) + ',' + p[1]);
	if(move == 'v') agg.push(p[0] + ',' + (p[1]+1));
	if(move == '<') agg.push((p[0]-1) + ',' + p[1]);
	if(move == '^') agg.push(p[0] + ',' + (p[1]-1));
	return agg;
}

function calcDistinctCoords(instructions) {
	return  _.chain(instructions).reduce(addNewMove, ['0,0']).uniq().value();
}
