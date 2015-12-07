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
  var parts = str.split('->').map(p => p.trim());
  var targetWire = parts[1];
  var command = parts[0];
  var opperands = command.split(' ');
  if(command.match(/^\d*$/) !== null) {
    circuit[targetWire] = num(command);
  } else if(command.match(/AND/) !== null) {
    circuit[targetWire] = and(opperands[0], opperands[2], circuit);
  } else if(command.match(/OR/) !== null) {
    circuit[targetWire] = or(opperands[0], opperands[2], circuit);
  } else if(command.match(/LSHIFT/) !== null) {
    circuit[targetWire] = lshift(opperands[0], opperands[2], circuit);
  } else if(command.match(/RSHIFT/) !== null) {
    circuit[targetWire] = rshift(opperands[0], opperands[2], circuit);
  } else if(command.match(/NOT/) !== null) {
    circuit[targetWire] = not(opperands[1], circuit);
  } else {
    circuit[targetWire] = wire(command, circuit);
  }
  return circuit;
}

function wire(a, circ) {
  return _.memoize(() => {
    return circ[a]();
  });
}

function num(x) {
  return () => {
    return x;
  }
}

function not(a, circ) {
  return _.memoize(() => {
    return 65535 - circ[a]();
  });
}

function and(a, b, circ) {
  if(a.match(/^\d*$/) !== null) {
    return _.memoize(() => {
      return a & circ[b]();
    });
  }
  return () => {
    return circ[a]() & circ[b]();
  }
}

function or(a, b, circ) {
  return _.memoize(() => {
    return circ[a]() | circ[b]();
  });
}

function lshift(a, x, circ) {
  return _.memoize(() => {
    return circ[a]() << x;
  });
}

function rshift(a, x, circ) {
  return _.memoize(() => {
    return circ[a]() >>> x;
  });
}
