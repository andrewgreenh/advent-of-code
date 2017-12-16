import getInput from '../lib/getInput'
import { enumerate } from '../lib/ts-it/enumerate'
import { range } from '../lib/ts-it/range'

function danceN(n) {
  let start = 'abcdefghijklmnop'
  let programs = start.split('')
  let moves = getInput(16, 2017).split(',')

  let history: string[] = [start]
  let cycleLength = 0
  for (cycleLength of range(0, n)) {
    dance()
    let string = programs.join('')
    if (history.includes(string)) break
    else history.push(string)
  }
  if (cycleLength > 0) for (let i of range(0, n % (cycleLength + 1))) dance()
  return programs.join('')

  function dance() {
    for (let move of moves) {
      if (move[0] === 's') spin(+move.slice(1))
      if (move[0] === 'p') partner(move[1], move[3])
      if (move[0] === 'x') {
        let [ia, ib] = move
          .slice(1)
          .split('/')
          .map(Number) as [number, number]
        exchange(ia, ib)
      }
    }
  }

  function spin(n) {
    let toMove = programs.slice(-n)
    for (let i = programs.length - n - 1; i >= 0; i--) programs[i + n] = programs[i]
    for (let [index, char] of enumerate(toMove)) programs[index] = char
  }

  function exchange(ia, ib) {
    let temp = programs[ia]
    programs[ia] = programs[ib]
    programs[ib] = temp
  }

  function partner(a, b) {
    exchange(programs.indexOf(a), programs.indexOf(b))
  }
}

console.log(danceN(1))
console.log(danceN(1000000000))
