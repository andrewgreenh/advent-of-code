import { map } from './map'
import { join } from './join'

export function printGrid(iter: Iterable<Iterable<any>>) {
  console.log(join('\n')(map<Iterable<any>, string>(line => join('\t')(line))(iter)))
}
