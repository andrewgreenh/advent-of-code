import _ from 'lodash';

function slide<T>(array: T[], windowSize: number): T[][] {
  const result: T[][] = [];
  for (let i = 0; i <= array.length - windowSize; i++) {
    const window: T[] = [];
    result.push(window);
    for (let j = 0; j < windowSize; j++) {
      window.push(array[i + j]);
    }
  }
  return result;
}

_.mixin({ slide });

export default slide;
