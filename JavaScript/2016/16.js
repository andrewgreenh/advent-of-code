const input = require('../getInput')(16, 2016).trim();

const flipString = s => s.split('').reverse().map(i => (i === '1' ? '0' : '1')).join('');
const modify = s => `${s}0${flipString(s)}`;
const getCorrectLenght = (s, length) => {
  while (s.length < length) {
    s = modify(s);
  }
  return s.substr(0, length);
};
const getCrc = crc => {
  do {
    let newCrc = '';
    for (let i = 0; i < crc.length; i += 2) {
      if (crc[i] === crc[i + 1]) newCrc += '1';
      else newCrc += '0';
    }
    crc = newCrc;
  } while (crc.length % 2 === 0);
  return crc;
};


console.log(getCrc(getCorrectLenght(input, 272)));
console.log(getCrc(getCorrectLenght(input, 35651584)));
