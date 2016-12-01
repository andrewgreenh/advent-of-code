const fs = require('fs');
const path = require('path');

module.exports = function(day, year) {
  var inputPath = path.join(__dirname, `${year}/inputs/${day}.txt`);
  try {
    var inputString = fs.readFileSync(inputPath, 'utf8');
    return inputString;
  } catch (e) {
    if(e.errno === -4058) { // File not found
      var msg = (
`The file inputs/${day}.txt could not be found!
 Try: node load ${day}`
      );
      throw msg;
    }
  }
};
