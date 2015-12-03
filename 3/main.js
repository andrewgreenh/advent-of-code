const getInput = require('../getInput');
const _ = require('lodash');

var startObject = ['0,0'];

getInput(3).then((input) => {
	var instructions = input.split('');
	solveFirst(instructions);
	solveSecond(instructions);
});

function solveFirst(instructions) {
	var result = _.chain(instructions).reduce(addNewMove, ['0,0']).uniq().value().length;
	console.log(`First result: ${result}`);
}

function solveSecond(instructions) {
	bothInstructions = _.partition(instructions, (elem, index) => index % 2 == 0);
	result = _.uniq(_.chain(bothInstructions[0]).reduce(addNewMove, ['0,0']).uniq().value().concat(
		_.chain(bothInstructions[1]).reduce(addNewMove, ['0,0']).uniq().value()
	)).length;
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
