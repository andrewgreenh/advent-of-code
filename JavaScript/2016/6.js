    const _ = require('lodash');
    const lines = require('../getInput')(6, 2016).trim().split('\n');

    const getResult = funcName =>
      _(_.range(8)).map(i => _(lines).map(i).countBy().toPairs()[funcName](1)).map(0).join('');

    console.log(['maxBy', 'minBy'].map(getResult));
