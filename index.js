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
  const formattedLines = []
  for (const line of lines) {
    formattedLines.push(await format(line, 'Ogre'))
  }
  const allLines = formattedLines.join('\n').split('\n')
  const maxWidth = allLines.reduce((acc, value) => {
    const width = stringWidth(value)
    if (width > acc) {
      return width
    }

    return acc
  }, 0)

  console.log('\n')

  allLines
    .map(line => addPadding(line, maxWidth))
    .map(line => {
      if (line && stripAnsi(line).trim().length > 0) {
        console.log(line)
      }
    })

  console.log('\n')
  console.log('\n')
}

module.exports = formatAndPrintLines
