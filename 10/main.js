const _ = require('lodash');
var input = require('../getInput')(10).trim();

var result = input;
_.times(40, () => result = parse(result));

console.log(result.length);

function parse(str) {
  var done, result = '', rest = str;
  while(!done) {
    var startingDigits = rest.match(/^(\d)\1*/)[0];
    if(startingDigits.length == rest.length) {
      result += startingDigits.length + startingDigits[0];
      done = true;
    } else {
      rest = rest.slice(startingDigits.length);
      result += startingDigits.length + startingDigits[0];
    }
  }
  return result;
}
