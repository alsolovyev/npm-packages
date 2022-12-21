const fs = require('fs')
const path = require('path')
const swc = require('@swc/core')
const swcOptions = require('./swcrc.json')

const cwd = process.cwd()
const distDir = path.join(cwd, 'dist')
const inputFile = path.join(cwd, 'src', 'localStorage.ts')
const outputFilename = 'index.js'
const outputModules = [
  {
    type: 'es6',
    prefix: 'esm'
  },
  {
    type: 'commonjs',
    prefix: 'cjs'
  }
]

const clearOutputDir = dir =>
  new Promise((resolve, reject) => {
    try {
      fs.existsSync(dir) && fs.rmSync(dir, { recursive: true })
      fs.mkdirSync(dir)
      resolve()
    } catch (error) {
      reject(error)
    }
  })

const bundle = async () => {
  !fs.existsSync(distDir) && fs.mkdirSync(distDir)

  const { bundle } = await swc.bundle({
    entry: {
      bundle: inputFile
    }
  })

  for (const { type, prefix } of outputModules) {
    swcOptions.module.type = type

    const { code } = await swc.transform(bundle.code, {
      ...swcOptions
    })

    const outputDir = path.join(distDir, prefix)
    const outputFile = path.join(outputDir, outputFilename)

    await clearOutputDir(outputDir)
    await fs.promises.writeFile(outputFile, code)
  }
}

bundle()
