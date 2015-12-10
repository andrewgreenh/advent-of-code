var input = require('../getInput')(5).trim().split('\n');

var result1 = input.filter(isNice1).length;
console.log(result1);

var result2 = input.filter(isNice2).length;
console.log(result2);

function isNice1(str) {
  return containsDobule(str) && contains3Vowels(str) && containsNoForbiddenString(str);
}

function containsDobule(str) {
  var pattern = /(\w)\1+/;
  return str.match(pattern) !== null;
}

function contains3Vowels(str) {
  var pattern = /(.*[aeiou]){3}/
  return str.match(pattern) !== null;
}

function containsNoForbiddenString(str) {
  var pattern = /ab|cd|pq|xy/
  return str.match(pattern) === null;
}

function isNice2(str) {
  return containsRepeating2(str) && containsSameWith1InBetween(str);
}

function containsRepeating2(str) {
  var pattern = /(\w\w).*\1/
  return str.match(pattern) !== null;
}

function containsSameWith1InBetween(str) {
  var pattern = /(\w)\w\1/;
  return str.match(pattern) !== null;
}
