import * as it from './';

const range = it.range(0, 10)
const result: number[] = it.pipe(range)(
  it.dropWhile(i => i < 7),
  it.toArray
);


console.log(result);
