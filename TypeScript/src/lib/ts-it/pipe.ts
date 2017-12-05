export function pipe(initial) {
  return function through(...funcs: ((i: any) => any)[]) {
    return funcs.reduce((value, func) => func(value), initial)
  }
}
