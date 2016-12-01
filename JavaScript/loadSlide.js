const _ = require('lodash');

function slide(array, n) {
  var results = [];
  if(array.length < n) return null;
  for(var i = 0; i < array.length+1-n; i++) {
    var window = [];
    for(var j = i; j < n+i; j++) {
      window.push(array[j]);
    }
    results.push(window);
  }
  return results;
};

_.mixin({
  slide: slide
});
