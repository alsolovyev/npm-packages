window.localStorage = window.localStorage || {}

const options = {
  writable: false,
  enumerable: false
}

Object.defineProperties(window.localStorage, {
  setItem: {
    ...options,
    value: jest.fn((key, val) => {
      this[key] = String(val)
    })
  },

  getItem: {
    ...options,
    value: jest.fn(key => (this[key] !== undefined ? this[key] : null))
  },

  removeItem: {
    ...options,
    value: jest.fn(key => {
      delete this[key]
    })
  },

  clear: {
    ...options,
    value: jest.fn(() => {
      Object.keys(this).map(key => delete this[key])
    })
  },

  length: {
    get: () => Object.keys(this).length
  }
})
