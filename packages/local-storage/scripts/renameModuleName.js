const { name, types } = require('../package.json')
const { readFile, writeFile } = require('fs/promises')
const path = require('path')

const cwd = process.cwd()
const typesFile = path.join(cwd, types)

const replaceStringInFile = async (file, from, to) => {
  const data = await readFile(file, 'utf-8')
  const modifiedData = data.replace(from, to)
  await writeFile(file, modifiedData)
}

replaceStringInFile(typesFile, 'module "localStorage"', `module "${name}"`)
