import getInput from '../lib/getInput'
import { range } from '../lib/ts-it/range'

let input = +getInput(17, 2017).trim()

let buf = [0]
let pos = 0

for (let i of range(1, 2018)) {
  pos = (pos + input) % buf.length
  buf.splice(pos + 1, 0, i)
  pos = pos + 1
  if (i === 2017) console.log(buf[pos + 1])
}

let length = 1
pos = 0
let second = 0
for (let i of range(1, 50000000)) {
  pos = (pos + input) % length
  if (pos === 0) second = i
  length++
  pos++
}
console.log(second)
