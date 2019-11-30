export function forEach<DataType>(callback: (item: DataType) => any) {
  return function doForEach(iter: Iterable<DataType>) {
    for (const item of iter) callback(item);
  };
}
