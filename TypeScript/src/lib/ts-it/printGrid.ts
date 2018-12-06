import { join } from './join';
import { map } from './map';
import { pipe } from './pipe';

export function printGrid<T>(
  iter: Iterable<Iterable<T | undefined>>,
) {
  console.log(pipe(iter)(map(join('\t')), join('\n')));
}
