const _ = require('lodash');
var boss = require('../getInput')(21).match(/\d+/g).map(_.ary(parseInt, 1));
boss.unshift(['boss']);

const weapons = [
  ['Dagger', 8, 4, 0],
  ['Shortsword', 10, 5, 0],
  ['Warhammer', 25, 6, 0],
  ['Longsword', 40, 7, 0],
  ['Greataxe', 74, 8, 0],
];

const armors = [
  ['Nothing', 0, 0, 0],
  ['Leather', 13, 0, 1],
  ['Chainmail', 31, 0, 2],
  ['Splintmail', 53, 0, 3],
  ['Bandedmail', 75, 0, 4],
  ['Platemail', 102, 0, 5],
];
const rings = [
  ['Nothing', 0, 0, 0],
  ['Nothing', 0, 0, 0],
  ['+1 DMG', 25, 1, 0],
  ['+2 DMG', 50, 2, 0],
  ['+3 DMG', 100, 3, 0],
  ['+1 ARM', 20, 0, 1],
  ['+2 ARM', 40, 0, 2],
  ['+3 ARM', 80, 0, 3],
]

var cheapestWinner = generatePlayers()
.filter(player => isNotBoss(simulateFight(player, boss)))
.reduce((cheapest, player) => costsOfPlayer(cheapest) > costsOfPlayer(player) ? player : cheapest);
console.log(cheapestWinner, costsOfPlayer(cheapestWinner));

var mostExpensiveLooser = generatePlayers()
.filter(player => isBoss(simulateFight(player, boss)))
.reduce((worst, player) => costsOfPlayer(worst) < costsOfPlayer(player) ? player : worst);
console.log(mostExpensiveLooser, costsOfPlayer(mostExpensiveLooser));

function generatePlayers() {
  var ringCombinations = generateRingCombinations(rings);
  var players = [];
  for(var i = 0; i < weapons.length; i++) {
    for(var j = 0; j < armors.length; j++) {
      for(var g = 0; g < ringCombinations.length; g++) {
        players.push(computePlayer(weapons[i], armors[j], ringCombinations[g]));
      }
    }
  }
  return players;
}

function generateRingCombinations(rings) {
  var results = [];
  for(var i = 0; i < rings.length - 1; i++) {
    for(var j = i+1; j < rings.length; j++) {
      results.push([rings[i], rings[j]]);
    }
  }
  return results;
}

function computePlayer(weapon, armor, rings) {
  var equipment = [weapon[0], armor[0]].concat(rings.map(r => r[0]));
  var lifePoints = 100;
  var damage = weapon[2] + _(rings).pluck(2).sum();
  var armor = armor[3] + _(rings).pluck(3).sum();
  return [equipment, lifePoints, damage, armor];
}

function simulateFight(player, boss) {
  var clonedPlayer = _.cloneDeep(player);
  var clonedBoss = _.cloneDeep(boss);
  var winner = undefined;
  var lossPerRoundPlayer = clonedBoss[2] - clonedPlayer[3];
  var lossPerRoundBoss = clonedPlayer[2] - clonedBoss[3];
  if(lossPerRoundPlayer < 1) lossPerRoundPlayer = 1;
  if(lossPerRoundBoss < 1) lossPerRoundBoss = 1;
  while(winner === undefined) {
    clonedBoss[1] -= lossPerRoundBoss;
    if(clonedBoss[1] < 1) {
      winner = player;
      break;
    };
    clonedPlayer[1] -= lossPerRoundPlayer;
    if(clonedPlayer[1] < 1) {
      winner = boss;
      break;
    };
  }
  return winner;
}

function isBoss(player) {
  return player[0][0] === 'boss'
}

function isNotBoss(player) {
  return !isBoss(player);
}

function costsOfPlayer(player) {
  var equipment = player[0];
  var weaponCosts = weapons.filter(weapon => weapon[0] == equipment[0])[0][1];
  var armorCosts = armors.filter(armor => armor[0] == equipment[1])[0][1];
  var ring1Costs = rings.filter(ring => ring[0] == equipment[2])[0][1];
  var ring2Costs = rings.filter(ring => ring[0] == equipment[3])[0][1];
  return weaponCosts + armorCosts + ring1Costs + ring2Costs;
}
