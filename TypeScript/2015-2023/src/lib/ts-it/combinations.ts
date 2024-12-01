import { drop } from './drop';
import { enumerate } from './enumerate';
import { iterable } from './iterable';
import { map } from './map';

export function combinations<T>(n: number, withReplacement = false) {
  return function* combinationsGenerator(
    inputIterable: Iterable<T>,
  ): Iterable<Iterable<T>> {
    if (n === 1) {
      yield* map<T, Iterable<T>>((item) => [item])(inputIterable);
      return;
    }
    for (const [index, item] of enumerate(inputIterable)) {
      const remaining = withReplacement
        ? inputIterable
        : iterable(() => drop<T>(index + 1)(inputIterable));
      yield* map((items: Iterable<T>) => [item, ...items])(
        combinations<T>(n - 1, withReplacement)(remaining),
      );
    }
  };
}
