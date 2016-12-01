const fs = require('fs');
const request = require('request');
const path = require('path');

var cookiePath = path.join(__dirname, '../sessionCookie.txt');
var cookieString = fs.readFileSync(cookiePath, 'utf8');


var day = process.argv[2];
var year = process.argv[3];
getInputOfDay(day, year)
  .then(input => {
    fs.writeFileSync(path.join(__dirname, `${year}/${day}.txt`), input);
    console.log(`File written successfully: ${year}/${day}.txt`);
  })
  .catch(error => console.log(error));

function getInputOfDay(day, year) {
  var jar = request.jar();
  var cookie = request.cookie(cookieString);
  var url = `http://adventofcode.com/${year}/day/${day}/input`;
  jar.setCookie(cookie, url);
  return new Promise((resolve, reject) => {
    request.get({url: url,jar: jar}, (error, response, body) => {
      if(response.statusCode == 200) {
        resolve(body);
      } else if(response.statusCode == 404) {
        reject('Not ready');
      } else {
        throw 'Unknown error: ' + response.statusCode;
      }
    });
  })
}
