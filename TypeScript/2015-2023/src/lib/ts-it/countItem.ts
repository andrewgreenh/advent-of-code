import { sumBy } from './sumBy';

export function countItem<ItemType>(item: ItemType) {
  return function count(iter: Iterable<ItemType>) {
    return sumBy<ItemType>((i) => (item === i ? 1 : 0))(iter);
  };
}
