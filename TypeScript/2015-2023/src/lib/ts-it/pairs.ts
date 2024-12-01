import { keys } from '../utils';

export function toPairs<Object extends {}>(
  o: Object,
): ReadonlyArray<Readonly<[keyof Object, Object[keyof Object]]>> {
  return keys(o).map((key) => [key, o[key]] as const);
}

export function fromPairs<T extends any[]>(
  pairs: Iterable<T>,
): Record<any, any>;
export function fromPairs<Tuple extends [any, any]>(
  pairs: Iterable<Tuple>,
): Record<Tuple[0], Tuple[1]> {
  let result = {} as Record<Tuple[0], Tuple[1]>;
  for (const [key, value] of pairs) {
    result[key] = value;
  }
  return result;
}

