#!/usr/bin/env node
const asciiHeader = require('./index')

const lines = process.argv.slice(2)

asciiHeader(lines)
