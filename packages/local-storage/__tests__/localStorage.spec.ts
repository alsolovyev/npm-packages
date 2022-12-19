/* eslint @typescript-eslint/no-unsafe-member-access: 0 */
/* eslint @typescript-eslint/ban-ts-comment: 0 */

import LocalStorage from '../src/localStorage'
import type { ILocalStorage } from '../src/localStorage'

describe('Local Storage', () => {
  let ls: ILocalStorage

  beforeEach(() => {
    ls = new LocalStorage()
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  it('should return true if an item was saved to local storage', () => {
    expect(ls.set('key', 'value')).toBeTruthy()
    expect(ls.set('key1', false)).toBeTruthy()
    expect(ls.set('key2', { a: 'b' })).toBeTruthy()
  })

  it('should return false if an error occurred while saving to local storage', () => {
    // @ts-ignore
    ls['_storageEngine'] = jest.fn().mockImplementationOnce(() => new Error())

    expect(ls.set('key', 'value')).toBeFalsy()
  })

  it('should return exactly the same value', () => {
    const key = 'obj'
    const obj: { [key: string]: unknown } = { a: 1 }

    ls.set(key, obj)
    expect(typeof ls.get(key)).toBe(typeof obj)
    expect(ls.get(key)).toStrictEqual(obj)
  })

  it('should return null if an item is undefined', () => {
    expect(ls.get('key')).toBeNull()
  })

  it('should return a default value if the item is undefined', () => {
    const defaultValue: Array<string> = ['lorem', 'ipsum', 'dolor']
    const value = ls.get<Array<string>>('key', defaultValue)

    expect(value).toStrictEqual(defaultValue)
  })

  it('should return null if an error occurred while parsing the return value', () => {
    JSON.parse = jest.fn().mockImplementationOnce(() => {
      throw new Error()
    })

    const key = 'key'

    ls.set(key, 'value')

    expect(ls.get(key)).toBeFalsy()
  })

  it('should return true if an item was removed from local storage', () => {
    const key = 'key'

    ls.set(key, 'value')

    expect(ls.remove(key)).toBeTruthy()
    expect(ls.get(key)).toBeNull()
  })

  it('should return false if an error occurred while removing item from local storage', () => {
    // @ts-ignore
    ls['_storageEngine'] = jest.fn().mockImplementationOnce(() => new Error())

    const key = 'key'

    ls.set(key, 'value')

    expect(ls.remove(key)).toBeFalsy()
  })
})