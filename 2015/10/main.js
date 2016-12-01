const input = require('../getInput')(10).trim();

const
  conwayStep = s => s.match(/(.)\1*/g).map(d => d.length+d[0]).join(''),
  conway = (n, str) => new Array(n).fill().reduce(conwayStep, str);

console.log(conway(40, input).length, conway(50, input).length);
