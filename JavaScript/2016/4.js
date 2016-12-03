const _ = require('lodash');
const input = _.trim(require('../getInput')(4, 2016));

const data = input.split('\n').map(line => 0);

console.log(data);
