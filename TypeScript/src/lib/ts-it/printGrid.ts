import { join } from './join';
import { map } from './map';

export function printGrid<T>(iter: Iterable<Iterable<T>>) {
  console.log(join('\n')(map<Iterable<T>, string>(line => join('\t')(line))(iter)))
}
