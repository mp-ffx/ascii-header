const stringWidth = require('string-width')
const {Figlet: asciimo} = require('asciimo')
const stripAnsi = require('strip-ansi')

const addPadding = (value, width) => {
  const charsToAdd = Math.floor((width - stringWidth(value)) / 2)

  for (let i = 0; i < charsToAdd; i += 1) {
    value = ` ${value}`
  }

  return value
}

const format = (text, font, ) => new Promise(resolve => {
  asciimo.write(text, font, function(art){
    resolve(art)
  })
})

const formatAndPrintLines = async lines => {
  const formattedBlocks = []

  // format each line
  for (const line of lines) {
    formattedBlocks.push(await format(line, 'Ogre'))
  }

  // filter out empty lines
  const strippedBlocks = formattedBlocks.map(
    block => block
      .split('\n')
      .filter(line => {
        if (line && stripAnsi(line).trim().length > 0) {
          return true
        }
        return false
      })
  )

  // merge blocks for max with count
  const maxWidth = strippedBlocks
    .reduce((acc, values) => {
      acc.push(...values)
      return acc
    }, [])
    .reduce((acc, value) => {
      const width = stringWidth(value)
      if (width > acc) {
        return width
      }

      return acc
    }, 0)

  // align all lines
  const alignedBlocks = strippedBlocks.map(block => block.map(line => addPadding(line, maxWidth)))

  const resultingLines = [
    ...alignedBlocks[0].slice(0, alignedBlocks[0].length - 1)
  ]

  // skip first block
  for (let i = 1; i < alignedBlocks.length; i += 1) {
    const previousBlock = alignedBlocks[i - 1]
    const previousLastLine = previousBlock[previousBlock.length - 1]
    const [currentFirstLine, ...otherLines] = alignedBlocks[i]

    let resultingLine = ''
    for (let position = 0; position < Math.max(previousLastLine.length, currentFirstLine.length); position += 1) {
      const previousLineChar = previousLastLine[position]
      const firstLineChar = currentFirstLine[position]
      if (!previousLineChar || stripAnsi(previousLineChar).trim() === '') {
        resultingLine += firstLineChar || ' '
      } else if (!firstLineChar || stripAnsi(firstLineChar).trim() === '') {
        resultingLine += previousLineChar || ' '
      } else {
        const stripped1 = stripAnsi(previousLineChar)
        const stripped2 = stripAnsi(firstLineChar)
        if (stripped1 === stripped2) {
          resultingLine += stripped1
        } else if (stripped1 === '_' && stripped2 !== '_') {
          resultingLine += stripped2
        } else if (stripped2 === '_' && stripped1 !== '_') {
          resultingLine += stripped1
        } else {
          throw new Error("AAAAAAAAAAAAAh")
        }
      }
    }

    resultingLines.push(resultingLine, ...otherLines.slice(0, otherLines.length - 1))

    if (i === alignedBlocks.length - 1) {
      resultingLines.push(otherLines[otherLines.length - 1])
    }
  }

  console.log('\n')
  console.log('\n')
  resultingLines.forEach(line => console.log(line))
  console.log('\n')
  console.log('\n')
}

module.exports = formatAndPrintLines
