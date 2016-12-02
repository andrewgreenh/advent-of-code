const _ = require('lodash');
const input = require('../getInput')(2, 2016);
const first = {1:{R:2,D:4},2:{R:3,D:5,L:1},3:{D:6,L:2},
               4:{U:1,R:5,D:7},5:{U:2,R:6,D:8,L:4},6:{U:3,D:9,L:5},
               7:{U:4,R:8},8:{U:5,R:9,L:7},9:{U:6,L:8}};
const second = {1:{D:3},
  2:{R:3,D:6},3:{U:1,R:4,D:7,L:2},4:{L:3,D:8},
5:{R:6},6:{U:2,R:7,D:'A',L:5},7:{U:3,R:8,D:'B',L:6},8:{U:4,R:9,D:'C',L:7},9:{L:'8'},
  A:{U:6,R:'B'},B:{U:7,R:'C',D:'D',L:'A'},C:{U:8,L:'B'},
               D:{U:'B'}};
const result = dirs => _.compact(input.split('\n')).reduce((code, line) =>
  code += line.split('').reduce(
    (pos, command) => (_.get(dirs, `${pos}.${command}`) || pos),
    _.last(code) || 5
  ), '');

console.log(result(first), result(second));
