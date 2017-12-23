let multcount = 0
let [a, b, c, d, e, f, g, h] = [0, 0, 0, 0, 0, 0, 0, 0]
a = 1
b = 57
c = b
if (a !== 0) {
  b *= 100
  b -= -100000
  c = b
  c -= -17000
}
do {
  f = 1
  d = 2
  do {
    e = 2

    if (b % d === 0) f = 0
    multcount = multcount + b - 2
    // do {
    //   g = d
    //   g *= e
    //   multcount++
    //   g -= b
    //   if (g === 0) f = 0
    //   e -= -1
    //   g = e
    //   g -= b
    // } while (g !== 0)

    d -= -1
    g = d
    g -= b
  } while (g !== 0)
  if (f === 0) h -= -1
  g = b
  g -= c
  b -= -17
} while (g !== 0)
console.log(multcount)
console.log(h)

export default null
