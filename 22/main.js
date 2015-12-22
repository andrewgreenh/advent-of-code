const _ = require('lodash');
const lazy = require('lazy.js');
const [bHP, bDMG] = require('../getInput')(22).match(/(\d+)/g).map(_.ary(parseInt, 1));

const pHP = 50;
const pMana = 500;
const spells = [
  {name: 'Magic Missile', costs: 53, dmg: 4},
  {name: 'Drain', costs: 73, dmg: 2, heal: 2},
  {name: 'Shield', costs: 113, effect: {duration: 6}},
  {name: 'Poison', costs: 173, effect: {duration: 6}},
  {name: 'Recharge', costs: 229, effect: {duration: 5}}
];
var simulationResults = (hard) => lazy.generate(() => simulate(hard));

var globalMin = {mana: Infinity};
var start = _.now();
simulationResults(false).filter(e=>e.won).dropWhile(e => {
  if(e.mana < globalMin.mana) {
    console.log(e.mana);
    globalMin = e;
  }
  return (_.now()-start) < 1000;
}).first();

console.log('############ Start of part 2 ############');
start = _.now();
globalMin = {mana: Infinity};
simulationResults(true).filter(e=>e.won).dropWhile(e => {
  if(e.mana < globalMin.mana) {
    console.log(e.mana);
    globalMin = e;
  }
  return (_.now()-start) < 1000;
}).first();

function simulate(hard) {
  var boss = {
    hp: bHP,
    dmg: bDMG,
  }
  var player = {
    hp: pHP,
    mana: pMana
  };
  var nooneDead = true;
  var winner;
  var effects = {
    'Shield': 0,
    'Poison': 0,
    'Recharge': 0,
  };
  var totalCosts = 0;
  while(nooneDead) {
    // Apply hardmode
    if(hard === true) {
      player.hp--;
    }
    // whoKilled(player, boss) ? ;
    // Tick effects
    applyEffects(player,boss,effects);
    if(boss.hp < 1) {
      winner = 'Player, because boss had no health left';
      nooneDead = false;
      break;
    }

    // Use random spell
    var spell;
    var spellCannotBeUsed = true;
    while(spellCannotBeUsed) {
      if(player.mana < 53) {
        spell = undefined;
        spellCannotBeUsed = false;
        break;
      }
      var spell = spells[_.random(0, 4)];
      if(spell.costs > player.mana) {
        spell = undefined;
        continue;
      }
      if(spell.effect && effects[spell.name] > 0) {
        spell = undefined;
        continue;
      }
      spellCannotBeUsed = false;
    }
    if(spell == undefined) {
      winner = 'boss, because player had no mana left';
      nooneDead = false;
      break;
    }
    if(spell.effect) {
      effects[spell.name] = spell.effect.duration;
    } else {
      if(spell.name == 'Magic Missile') {
        boss.hp -= 4;
      } else {
        boss.hp -= 2;
        player.hp += 2;
      }
    }
    player.mana -= spell.costs;
    totalCosts += spell.costs;
    if(boss.hp < 1) {
      winner = 'Player, because boss had no health left';
      nooneDead = false;
      break;
    }

    applyEffects(player,boss,effects);

    if(boss.hp < 1) {
      winner = 'Player, because boss had no health left';
      nooneDead = false;
      break;
    }
    // Process boss attack
    if(effects['Shield'] > 0) {
      player.hp -= Math.max(boss.dmg - 7, 1);
    } else {
      player.hp -= boss.dmg;
    }

    if(player.hp < 1) {
      winner = 'BOSS, because player had no health left';
      nooneDead = false;
      break;
    }
  }
  return {won: _.startsWith(winner, 'Player'), mana: totalCosts};
}

function applyEffects(player, boss, effects) {
  if(effects['Shield'] > 0) {
    effects['Shield']--;
  }
  if(effects['Poison'] > 0) {
    boss.hp -= 3;
    effects['Poison']--;
  }
  if(effects['Recharge'] > 0) {
    player.mana += 101;
    effects['Recharge']--;
  }
}
