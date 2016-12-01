const _ = require('lodash');
var input = require('../getInput')(15).trim().split('\n');

const
  dic = input.map(line => line.match(/ (-?\d+)/g).map(_.ary(parseInt, 1))),
  crunch = withCals => {
    var results = [];
    for(var Su = 0; Su < 101; Su++) {
      for(var Sp = 0; Sp < 101 - Su; Sp++) {
        for(var Ca = 0; Ca < 101 - Su - Sp; Ca++) {
          var Ch = 100-Su-Sp-Ca;
          cap = Su*dic[0][0] + Sp*dic[1][0] + Ca*dic[2][0] + Ch*dic[3][0],
          dur = Su*dic[0][1] + Sp*dic[1][1] + Ca*dic[2][1] + Ch*dic[3][1],
          fla = Su*dic[0][2] + Sp*dic[1][2] + Ca*dic[2][2] + Ch*dic[3][2],
          tex = Su*dic[0][3] + Sp*dic[1][3] + Ca*dic[2][3] + Ch*dic[3][3],
          cal = Su*dic[0][4] + Sp*dic[1][4] + Ca*dic[2][4] + Ch*dic[3][4];
          if(cap<0 || dur<0 || fla<0 || tex<0) results.push(0);
          else if(withCals && cal !== 500) results.push(0);
          else results.push(cap*dur*fla*tex);
        }
      }
    }
    return results;
  };

console.log(_.max(crunch(false)), _.max(crunch(true)));
