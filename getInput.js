const fs = require('fs');
const request = require('request');
const path = require('path');

module.exports = function(day) {
  var cookiePath = path.join(__dirname, 'sessionCookie.txt');
  var cookieString = fs.readFileSync(cookiePath, 'utf8');
  var jar = request.jar();
  var cookie = request.cookie(cookieString);
  var url = `http://adventofcode.com/day/${day}/input`;
  jar.setCookie(cookie, url);
  return new Promise((resolve) => {
    request.get({url: url,jar: jar}, (error, response, body) => {
      resolve(body);
    });
  })
};
