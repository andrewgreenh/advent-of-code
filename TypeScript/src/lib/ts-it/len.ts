export function len(iter: Iterable<any>) {
  if (iter instanceof Array) return iter.length;
  if (iter instanceof Set) return iter.size;
  let size = 0;
  for (let _ of iter) size++;
  return size;
}
