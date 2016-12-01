const _ = require('lodash');
var input = require('../getInput')(16).trim().split('\n');


const
  equalOrUndefined = (key, value) => (obj) => obj[key] === undefined || parseInt(obj[key]) === parseInt(value),
  greaterOrUndefined = (key, value) => (obj) => obj[key] === undefined || parseInt(obj[key]) > parseInt(value),
  lessOrUndefined = (key, value) => (obj) => obj[key] === undefined || parseInt(obj[key]) < parseInt(value),
  result1 = _(input)
    .map(line => line.match(/(\w+): (\d+)/g).map(match => match.split(': ')))
    .map(line => _.zipObject(line))
    .map((sue, i) => _.set(sue, 'id', i+1))
    .filter(equalOrUndefined('children', '3'))
    .filter(equalOrUndefined('cats', '7'))
    .filter(equalOrUndefined('samoyeds', '2'))
    .filter(equalOrUndefined('pomeranians', '3'))
    .filter(equalOrUndefined('akitas', '0'))
    .filter(equalOrUndefined('vizslas', '0'))
    .filter(equalOrUndefined('goldfish', '5'))
    .filter(equalOrUndefined('trees', '3'))
    .filter(equalOrUndefined('cars', '2'))
    .filter(equalOrUndefined('perfumes', '1'))
    .value(),
  result2 = _(input)
    .map(line => line.match(/(\w+): (\d+)/g).map(match => match.split(': ')))
    .map(line => _.zipObject(line))
    .map((sue, i) => _.set(sue, 'id', i+1))
    .filter(equalOrUndefined('children', '3'))
    .filter(greaterOrUndefined('cats', '7'))
    .filter(equalOrUndefined('samoyeds', '2'))
    .filter(lessOrUndefined('pomeranians', '3'))
    .filter(equalOrUndefined('akitas', '0'))
    .filter(equalOrUndefined('vizslas', '0'))
    .filter(lessOrUndefined('goldfish', '5'))
    .filter(greaterOrUndefined('trees', '3'))
    .filter(equalOrUndefined('cars', '2'))
    .filter(equalOrUndefined('perfumes', '1'))
    .value();
console.log(result1, result2);
