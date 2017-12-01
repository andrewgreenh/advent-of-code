const _ = require('lodash');

function slide(array, n) {
  const results = [];
  if (array.length < n) return null;
  for (let i = 0; i < array.length + 1 - n; i++) {
    const window = [];
    for (let j = i; j < n + i; j++) {
      window.push(array[j]);
    }
    results.push(window);
  }
  return results;
}

_.mixin({
  slide,
});
