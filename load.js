const fs = require('fs');
const request = require('request');
const path = require('path');

var cookiePath = path.join(__dirname, 'sessionCookie.txt');
var cookieString = fs.readFileSync(cookiePath, 'utf8');

var day = process.argv[2];
getInputOfDay(day)
  .then(input => {
    fs.writeFileSync(`inputs/${day}.txt`, input);
    console.log(`File written successfully: inputs/${day}.txt`);
  })
  .catch(error => console.log(error));

function getInputOfDay(day) {
  var jar = request.jar();
  var cookie = request.cookie(cookieString);
  var url = `http://adventofcode.com/day/${day}/input`;
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
