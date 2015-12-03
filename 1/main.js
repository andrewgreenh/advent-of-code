const getInput = require('../getInput');

getInput(1).then((input) => {
  var result = input.split('').reduce(toFinalFloors, {c:0,f:-1});
	console.log(result.c, result.f);
});

function toFinalFloors(agg, elem, indx) {
  return {
    c:agg.c + (elem=='('?1:-1),
    f: (agg.c<0 && agg.f<0 ? indx : agg.f)
  };
}
