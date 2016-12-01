const _ = require('lodash');
var input = require('../getInput')(8).trim().split('\n');

function getParsedLength(str) {
  return str.replace(/\\"/g, '"').replace(/\\\\/g, '%').replace(/\\x.{2}/g, '%').substring(1).replace(/"$/, '').length;
}

function getEscapedLength(str) {
  return str.replace(/^"/, '%%%').replace(/"$/, '%%%').replace(/\\"/g, '%%%%').replace(/\\\\/g, '%%%%').replace(/\\x.{2}/g,'%%%%%').length;
}

var result1 = _(input).map(i => i.length - getParsedLength(i)).sum();
var result2 = _(input).map(i => getEscapedLength(i) - i.length).sum();
console.log(result1, result2);
