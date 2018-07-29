const fs = require('fs')
const path = require('path')
const test = require('tape')
const sinon = require('sinon')
const MockDate = require('mockdate')
const { setup, teardown } = require('./globals')

const run = (file) => () =>
  eval(
    fs
      .readFileSync(path.resolve(__dirname, '../../dist', `${file}.js`))
      .toString()
  )

const pad = (v, times = 2, char = '0') =>
  v.toString().length < times ? `${char.repeat(times - 1)}${v}` : v.toString()

const ts = (d = new Date()) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

const testEach = (desc, tests) => {
  const sandbox = sinon.createSandbox()
  test(desc, (t) => {
    tests(t, sandbox)
    sandbox.restore()
    MockDate.reset()
    teardown()
    t.end()
  })
}

module.exports = {
  ts,
  run,
  testEach,
  setup
}
