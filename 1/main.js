const fs = require('fs');
const request = require('request');

var cookieString = fs.readFileSync('../sessionCookie.txt', 'utf8');
var jar = request.jar();
var cookie = request.cookie(cookieString);
var url = 'http://adventofcode.com/day/1/input';
jar.setCookie(cookie, url);

request.get({url: url,jar: jar}, (error, response, body) => {
	var result = body.split('').reduce((agg,value,index)=>{return{c:agg.c + (value=='('?1:-1),f: (agg.c<0 && agg.f<0 ? index : agg.f)}},{c:0,f:-1});   
	console.log(`Santa stopped at floor ${result.c}`);
	console.log(`Santa went to basement at ${result.f}`);
});
