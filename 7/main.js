const _ = require('lodash');
var input = require('../getInput')(7).trim().split('\n');

var circuit = _(input).reduce(parseLine, {});
var result1 = circuit.a();
console.log(result1);

var circuit = _(input).reduce(parseLine, {});
circuit.b = () => result1;
result2 = circuit.a();
console.log(result2);

function parseLine(circuit, str) {
  var [command, target] = str.split('->').map(p => p.trim());
  var [a,b,c] = command.split(' ');
  if(command.match(/^\d*$/))
    return _.set(circuit, `${target}`, () => command);
  if(command.match(/AND/))
    return _.set(circuit, `${target}`,
      _.memoize(() => (a.match(/^\d*$/) ? a & circuit[c]() : circuit[a]() & circuit[c]())));
  if(command.match(/OR/))
    return _.set(circuit, `${target}`,
      _.memoize(() => circuit[a]() | circuit[c]()));
  if(command.match(/LSHIFT/))
    return _.set(circuit, `${target}`,
      _.memoize(() => circuit[a]() << c));
  if(command.match(/RSHIFT/))
    return _.set(circuit, `${target}`,
      _.memoize(() => circuit[a]() >> c));
  if(command.match(/NOT/))
    return _.set(circuit, `${target}`,
      _.memoize(() => ~circuit[b]()));
  return _.set(circuit, `${target}`,
    _.memoize(() => circuit[a]()));
}
