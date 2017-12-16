export function size(iter: Iterable<any>) {
  let size = 0
  for (let _ of iter) size++
  return size
}
