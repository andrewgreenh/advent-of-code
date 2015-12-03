const getInput = require('../getInput');
const _ = require('lodash');

getInput(3).then((input) => {
  var result1 = calcDistinctCoords(input).length;
  var result2 = _.chain(input).partition((e, i) => i % 2 == 0)
		.map(calcDistinctCoords).union().flatten().uniq().value().length;
	console.log(result1, result2);
});

function calcDistinctCoords(instructions) {
	return  _.chain(instructions).reduce(addNewMove, ['0,0']).uniq().value();
}

function addNewMove(agg, move) {
	var c = _.map(_.last(agg).split(','), (e) => parseInt(e));
	if(move == '>') agg.push((c[0]+1) + ',' + c[1]);
	if(move == 'v') agg.push(c[0] + ',' + (c[1]+1));
	if(move == '<') agg.push((c[0]-1) + ',' + c[1]);
	if(move == '^') agg.push(c[0] + ',' + (c[1]-1));
	return agg;
}
