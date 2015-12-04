var input = require('../getInput')(4).trim();
const _ = require('lodash');
const md5 = require('js-md5');
const lazy = require('lazy.js');

var seq = lazy.generate((i) => i);
var result1 = seq.dropWhile((e) => !(_(md5(input + e)).startsWith('00000'))).first();
var result2 = seq.dropWhile((e) => !(_(md5(input + e)).startsWith('000000'))).first();
console.log(result1, result2);
