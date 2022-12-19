const { expect } = require('@jest/globals')
const { ESLint } = require('eslint')

expect.extend({
  async toBeCorrectConfig(overrideConfigFile) {
    try {
      new ESLint({ overrideConfigFile })

      return {
        message: () => 'Config loaded correctly',
        pass: true
      }
    } catch (error) {
      return {
        message: () => error,
        pass: false
      }
    }
  }
})
