import type { IStorageEngine } from './storage.interface'

export interface ILocalStorage {
  get<T>(key: string, defaultValue?: T): T | null
  set<T>(key: string, value: T): boolean
  remove(key: string): boolean
}

/**
 * Class for working with local storage. If the device does not support
 * local storage, in-memory storage will be used as a fallback.
 *
 * ```ts
 * const localStorage = new LocalStorage()
 * ```
 */
export default class LocalStorage implements ILocalStorage {
  private readonly _storageEngine: IStorageEngine

  constructor() {
    this._storageEngine = window.localStorage
  }

  /**
   * Returns the current value associated with the given key.
   * If the given key does not existin the list associated with the object,
   * then it returns the default value or null.
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
}
