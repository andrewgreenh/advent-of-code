const _ = require('lodash');
const [bHP, bDMG] = require('../getInput')(22).match(/(\d+)/g).map(_.ary(parseInt, 1));
const pHP = 50;
const pMana = 500;
const spellObj = {
  'MM': {cost: 53, dmg: 4},
  'D': {cost: 73, dmg: 2, heal: 2},
  'S': {cost: 113, effect: {duration: 6}},
  'P': {cost: 173, effect: {duration: 6}},
  'R': {cost: 229, effect: {duration: 5}}
}

console.log(calc(pHP, pMana, bHP, bDMG, 0, false, 0, 0, 0, true));
console.log(calc(pHP, pMana, bHP, bDMG, 0, true, 0, 0, 0, true));

function calc(pHP, pMana, bHP, bDMG, spent, hard, s_t, p_t, r_t, first) {
  if(bHP < 1) {
    return spent;
  }
  if(!first) {
    // Tick effects
    if(s_t > 0) s_t--;
    if(p_t > 0) {
      bHP -= 3;
      p_t--;
    }
    if(r_t > 0) {
      pMana += 101;
      r_t--;
    }
    if(bHP < 1) return spent;
    pHP -= (s_t > 0) ? Math.max(bDMG - 7, 1) : bDMG;
    if(pHP < 1) return Infinity;
  }
  if(hard) pHP--;
  if(pHP < 1) return Infinity;

  // Tick effects
  if(s_t > 0) s_t--;
  if(p_t > 0) {
    bHP -= 3;
    p_t--;
  }
  if(r_t > 0) {
    pMana += 101;
    r_t--;
  }
  if(bHP < 1) return spent;

  var min = Infinity;
  if(pMana < 53) {
    return Infinity;
  }
  if(pMana >= 53) {
    min = Math.min(min, calc(
      pHP, pMana-spellObj['MM'].cost, bHP-spellObj['MM'].dmg, bDMG, spent+spellObj['MM'].cost, hard, s_t, p_t, r_t
    ));
  }
  if(pMana >= 73) {
    min = Math.min(min, calc(
      pHP+spellObj['D'].heal, pMana-spellObj['D'].cost, bHP-spellObj['D'].dmg, bDMG, spent+spellObj['D'].cost, hard, s_t, p_t, r_t
    ))
  };
  if(pMana >= 113 && s_t == 0) {
    min = Math.min(min, calc(
      pHP, pMana-spellObj['S'].cost, bHP, bDMG, spent+spellObj['S'].cost, hard, spellObj['S'].effect.duration, p_t, r_t
    ));
  }
  if(pMana >= 173 && p_t == 0) {
    min = Math.min(min, calc(
      pHP, pMana-spellObj['P'].cost, bHP, bDMG, spent+spellObj['P'].cost, hard, s_t, spellObj['P'].effect.duration, r_t
    ));
  }
  if(pMana >= 229 && r_t == 0) {
    min = Math.min(min, calc(
      pHP, pMana-spellObj['R'].cost, bHP, bDMG, spent+spellObj['R'].cost, hard, s_t, p_t, spellObj['R'].effect.duration
    ));
  }
  return min;
}
