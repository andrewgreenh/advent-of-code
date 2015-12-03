const getInput = require('../getInput');

getInput(2).then((input) => {
	var sum = input.trim().split('\n')
    .map(calcPaperAndRibbon).reduce(toSum);
	console.log(sum.p, sum.r);
});

function calcPaperAndRibbon(str) {
	var values = str.split('x');
	values.sort((a,b) => a-b);
	var paper = (
		values[0] * values[1] * 3 +
		values[0] * values[2] * 2 +
		values[1] * values[2] * 2
	);
	var ribbon = (
		values[0] * 2 + values[1] * 2 +
		values[0] * values[1] * values[2]
	);
	return {
		p: paper,
		r: ribbon
	};
}

function toSum(agg, res) {
	return {
		p: agg.p + res.p,
		r: agg.r + res.r
	};
}
