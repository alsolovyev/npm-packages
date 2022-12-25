/* eslint @typescript-eslint/no-unsafe-member-access: 0 */
/* eslint @typescript-eslint/ban-ts-comment: 0 */

import MemoryStorage from '../src/memoryStorage'
import { IStorageEngine } from '../src/storage.interface'

describe('Memory Storage', () => {
  let ms: IStorageEngine

  beforeEach(() => {
    ms = new MemoryStorage()
  })

  it('should return the current number of key/value pairs in memory', () => {
    expect(ms.length).toBe(0)

    ms.setItem('key', 'value')

    expect(ms.length).toBe(1)

    ms.setItem('key', 'value')
    ms.setItem('key1', 'value')
    ms.setItem('key2', 'value')

    expect(ms.length).toBe(3)
  })

  it('should save an item to memory', () => {
    const key = 'key'
    const value = 'value'

    expect(ms.setItem(key, value)).toBeUndefined()
    // @ts-ignore
    expect(ms['_store'].key).toBe(value)
  })

  it('should throw an error if no value is provided', () => {
    const key = 'key'
    const value = undefined as unknown as string

    expect(() => ms.setItem(key, value)).toThrow()
  })

  it('should return a value from memory', () => {
    const key = 'key'
    const value = 'value'

    ms.setItem(key, value)
    expect(ms.getItem(key)).toBe(value)
  })

  it('should return null if item is not defined', () => {
    const key = 'key'

    expect(ms.getItem(key)).toBeNull()
  })

  it('shoudl remove an item from memmory', () => {
    const key = 'key'

    ms.setItem(key, 'value')
    ms.removeItem(key)

    // @ts-ignore
    expect(ms['_store'].key).toBeUndefined()
  })

  it('should return null if item is not defined', () => {
    // @ts-ignore
    const store = ms['_store'] as Record<string, string>

    ms.setItem('key', 'value')
    ms.setItem('key1', 'value1')
    ms.setItem('key2', 'value2')

    expect(Object.keys(store).length).toBe(3)

    ms.clear()

    expect(Object.keys(store).length).toBe(0)
  })
})
