const lines = require('../getInput')(4, 2016).trim().split('\n');

const count = (arr, needle) => [...arr].filter(char => char === needle).length;
const uniq = arr => arr.reduce((agg, el) => (agg.includes(el) ? agg : [...agg, el]));
const isBeforeInString = s => (a, b) => (count(s, b) - count(s, a) || (a < b ? -1 : 1));
const getTop5 = s => uniq([...s]).sort(isBeforeInString(s)).slice(0, 5);
const re = /(.*)-(\d{3})\[(\w{5})]$/;
const parse = line => ((([, name, id, crc]) => ({ name, id: +id, crc }))(line.match(re)));
const isRealRoom = ({ name, crc }) => crc === getTop5(name.replace(/-/g, '')).join('');
const rotateChar = n => char => String.fromCharCode(97 + (char.charCodeAt() - 97 + n) % 26);
const rotateWord = n => word => [...word].map(rotateChar(n)).join('');
const rotateRoom = ({ id, name }) => ({ name: name.split('-').map(rotateWord(id)).join(' '), id });

const rooms = lines.map(parse).filter(isRealRoom);
const result1 = rooms.reduce((sum, { id }) => sum + id, 0);
const result2 = rooms.map(rotateRoom).filter(({ name, id }) => name.includes('north'));
console.log(result1, result2);
