const getInput = require('../getInput');

getInput(1).then((input) => {
  var result = input.split('').reduce((agg,value,index)=>{return{c:agg.c + (value=='('?1:-1),f: (agg.c<0 && agg.f<0 ? index : agg.f)}},{c:0,f:-1});
	console.log(`Santa stopped at floor ${result.c}`);
	console.log(`Santa went to basement at ${result.f}`);
});
