import { now } from 'lodash';

export function run(label: string, func: () => any) {
  const start = now();
  const result = func();
  const end = now();
  console.log(`${label} after ${end - start} ms: ${result}`);
}
