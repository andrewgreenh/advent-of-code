const fs = require('fs')
const path = require('path')

const day = process.argv[2]
const year = process.argv[3]

const content = `import getInput from '../lib/getInput'
import { lines } from '../lib/ts-it/lines'

let result
for (let line of lines(getInput(${+day}, ${year}))) {
  console.log(line)
}

console.log(result)

`

fs.writeFileSync(path.join(__dirname, `src/${year}/${day}.ts`), content)
