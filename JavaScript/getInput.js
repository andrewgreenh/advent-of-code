const fs = require('fs');
const path = require('path');

module.exports = function getInput(day, year) {
  const inputPath = path.join(__dirname, `${year}/${day}.txt`);
  try {
    const inputString = fs.readFileSync(inputPath, 'utf8');
    return inputString;
  } catch (e) {
    if (e.errno === -4058) {
      // File not found
      const msg = `The file ${day}.txt could not be found! Try: node load ${day} ${year}`;
      throw new Error(msg);
    }
    throw e;
  }
};
