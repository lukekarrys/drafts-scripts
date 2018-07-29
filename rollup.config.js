import fs from 'fs'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default fs.readdirSync('./src').map((script) => ({
  input: `src/${script}`,
  output: {
    name: script.replace('.js', ''),
    file: `dist/${script}`,
    format: 'iife'
  },
  plugins: [resolve(), commonjs()]
}))
