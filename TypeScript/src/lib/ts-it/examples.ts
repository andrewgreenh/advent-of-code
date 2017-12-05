import * as it from './'

it.pipe(it.range(0))(
  it.map((i: number) => i * i),
  it.flatMap((i: number) => [i, i, i]),
  it.drop(5),
  it.filter((i: number) => i % 2 === 0),
  it.takeWhile(i => i < 100),
  it.sum,
  x => console.log(x),
)
