import { range } from './ts-it/range'
import { enumerate } from './ts-it/enumerate'
import { chunk } from './ts-it/chunk'
import { reduce } from './ts-it/reduce'
import { map } from './ts-it/map'
import * as _ from 'lodash'

function hash(input, rounds = 1, sequenceLength = 256) {
  let sequence = [...range(0, sequenceLength)]
  let index = 0
  let skipSize = 0
  for (let i of range(0, rounds)) {
    for (let length of input) {
      reverse(sequence, index, length)
      index = (index + length + skipSize) % sequence.length
      skipSize++
    }
  }
  return sequence
}

function reverse(array, from, length) {
  let repeated = [...array, ...array]
  let reversed = repeated.slice(from, from + length).reverse()
  for (let [index, value] of enumerate(reversed)) {
    array[(index + from) % array.length] = value
  }
  return reversed
}

export function knotHash(string, rounds) {
  const byteInput = [...string.split('').map(str => str.charCodeAt(0)), 17, 31, 73, 47, 23]
  const knotted = hash(byteInput, rounds)
  const chunks = chunk<number>(16)(knotted)
  const chunkToNum = reduce<number, number>((a, b) => a ^ b, 0)
  const finalDecimalHash = map<Iterable<number>, number>(chunkToNum)(chunks)
  const hexResult = [
    ...map<number, string>(num => _.padStart(num.toString(16), 2, '0'))(finalDecimalHash),
  ].join('')
  return hexResult
}
