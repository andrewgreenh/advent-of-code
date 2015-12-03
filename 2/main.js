const getInput = require('../getInput');

getInput(2).then((input) => {
	var dataArray = input.trim().split('\n');
	var resources = dataArray.map(calcPaperAndRibbon).reduce(addObjectValues);
	console.log(`Santa needs ${resources.p} sqr. feet of paper`);
	console.log(`Santa needs ${resources.r} feet of ribbon`);
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

function addObjectValues(agg, res) {
	return {
		p: agg.p + res.p,
		r: agg.r + res.r
	};
}
