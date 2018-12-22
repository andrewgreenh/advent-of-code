import { join } from './join';
import { map } from './map';
import { pipe } from './pipe';

export function printGrid<T>(
  iter: Iterable<Iterable<T | undefined>>,
  defaultValue = '',
  joinColumns = '\t',
) {
  console.log(
    pipe(iter)(
      map(line =>
        pipe(line)(
          map(x => (x === undefined ? defaultValue : x)),
          join(joinColumns),
        ),
      ),
      join('\n'),
    ),
  );
}
