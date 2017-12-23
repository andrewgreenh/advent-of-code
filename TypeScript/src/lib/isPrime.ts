import { any } from './ts-it/any'
import { range } from './ts-it/range'

export function isPrime(number: number) {
  number = Math.abs(number)
  if (number === 0 || number === 1) return false
  if (number < 4) return true
  return !any<number>(value => number % value === 0)(range(2, Math.sqrt(number)))
}
