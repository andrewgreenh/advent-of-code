const fs = require('fs');
const path = require('path');
const request = require('request');

const cookiePath = path.join(__dirname, '../sessionCookie.txt');
const cookieString = fs.readFileSync(cookiePath, 'utf8');

const day = process.argv[2];
const year = process.argv[3];
getInputOfDay(day, year)
  .then(input => {
    fs.writeFileSync(path.join(__dirname, `src/${year}/${day}.txt`), input);
    console.log(`File written successfully: ${year}/${day}.txt`);
  })
  .catch(error => console.log(error));

function getInputOfDay(day, year) {
  const jar = request.jar();
  const cookie = request.cookie(cookieString);
  const url = `https://adventofcode.com/${year}/day/${day}/input`;
  jar.setCookie(cookie, url);
  return new Promise((resolve, reject) => {
    request.get({ url, jar }, (error, response, body) => {
      if (response.statusCode === 200) {
        resolve(body);
      } else if (response.statusCode === 404) {
        reject('Not ready');
      } else {
        throw 'Unknown error: ' + response.statusCode;
      }
    });
  });
}
