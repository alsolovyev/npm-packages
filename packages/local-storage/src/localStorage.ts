import MemoryStorage from './memoryStorage'
import type { IStorageEngine } from './storage.interface'

export interface ILocalStorage {
  readonly length: number
  clear(): boolean
  get<T>(key: string, defaultValue?: T): T | null
  remove(key: string): boolean
  set<T>(key: string, value: T): boolean
}

/**
 * A class to simplify work with local storage.
 *
 * @remarks
 * If local storage is not supported, in-memory storage will be used as a fallback.
 *
 * @example
 * ```ts
 * const localStorage = new LocalStorage()
 * localStorage.set('key', { a: 1, b: ['uno', 'dos', 'tres'] })
 * localStorage.get<{ a: number, b: string[] }>('key', { a: 1, b: [] })
 * localStorage.remove('key')
 * ```
 */
export default class LocalStorage implements ILocalStorage {
  private readonly _storageEngine: IStorageEngine

  constructor() {
    this._storageEngine = this._checkLocalStorageSupport()
      ? window.localStorage
      : new MemoryStorage()
  }

  /**
   * The number of key/value pairs currently present in local storage.
   * @readonly
   */
  public get length(): number {
    return this._storageEngine.length
  }

  /**
   * Removes all key/value pairs from the store, if any.
   *
   * @returns true if removing was successful, otherwise false
   */
  public clear(): boolean {
    try {
      this._storageEngine.clear()
    } catch (_) {
      return false
    }

    return true
  }

  /**
   * Returns the current value associated with the given key.
   * If the given key does not existin the list associated with the object,
   * then it returns the default value or null.
   *
   * @remarks
   * The return value is automatically parsed using JSON.parse()
   *
   * @param key - the key to look up the value in local storage
   * @param [defaultValue] - the fallback value
   * @returns the current value associated with the given key, or null
   *
   * @example Basic example:
   * ```ts
   * const localStorage = new LocalStorage()
   * localStorage.get<string>('key')
   * ```
   *
   * @example Default value example:
   * ```ts
   * const localStorage = new LocalStorage()
   * localStorage.get<string>('key', 'default value')
   * ```
   */
  public get<T>(key: string): T | null
  public get<T>(key: string, defaultValue: T): T
  public get<T>(key: string, defaultValue?: T): T | null {
    const storageValue = this._storageEngine.getItem(key)

    if (!storageValue) {
      return defaultValue || null
    }

    let value: T | null

    try {
      value = JSON.parse(storageValue) as T
    } catch (err) {
      value = null
    }

    return defaultValue && (value === null || value === undefined) ? (defaultValue as T) : value
  }

  /**
   * Removes the key/value pair with the given key from the list associated
   * with the object, if a key/value pair with the given key exists.
   *
   * @param key - the key to be removed from local storage
   * @returns true if the key/value has been removed, otherwise false
   */
  public remove(key: string): boolean {
    try {
      this._storageEngine.removeItem(key)
    } catch (_) {
      return false
    }

    return true
  }

  /**
   * Sets the value of the pair identified by key to value, creating
   * a new key/value pair if none existed for key previously.
   *
   * @remark
   * The value will be converted to a string using JSON.stringify() before being stored
   *
   * @param key - the key by which a value will be stored in local storage
   * @param value - the value to be stored
   *
   * @returns true if the key/value has been saved, otherwise false
   */
  public set<T>(key: string, value: T): boolean {
    const storageValue = JSON.stringify(value)

    try {
      this._storageEngine.setItem(key, storageValue)
    } catch (_) {
      return false
    }

    return true
  }

  /**
   * Checks local storage support
   */
  private _checkLocalStorageSupport(): boolean {
    try {
      if (!window.localStorage) return false

      // In iOS5 Private Browsing mode, attempting to use
      // localStorage.setItem will throw the exception:
      //   QUOTA_EXCEEDED_ERROR DOM Exception 22.
      // Peculiarly, getItem and removeItem calls do not throw.
      const key = `__${Math.round(Math.random() * 1e7)}__`
      window.localStorage.setItem(key, '')
      window.localStorage.removeItem(key)

      return true
    } catch (_) {
      return false
    }
  }
}
