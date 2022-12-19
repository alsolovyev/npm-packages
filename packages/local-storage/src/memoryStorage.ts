import type { IStorageEngine } from './storage.interface'

/**
 * This class implements the in-memory local storage API. This makes
 * it possible, for example, to add, modify or delete stored data items
 * on devices that do not support local storage.
 *
 * ```ts
 * const memoryStorage = new MemoryStorage()
 * ```
 */
export default class MemoryStorage implements IStorageEngine {
  private readonly _store: Record<string, string> = Object.create(null) as Record<string, string>

  /**
   * Removes all key/value pairs, if there are any.
   **/
  public clear(): void {
    Object.keys(this._store).map(this.removeItem.bind(this))
  }

  /**
   * Returns the current value associated with the given key, or null
   * if the given key does not exist in the list associated with the object.
   */
  public getItem(key: string): string | null {
    return this._store[key] || null
  }

  /**
   * Removes the key/value pair with the given key from the list associated
   * with the object, if a key/value pair with the given key exists.
   */
  public removeItem(key: string): void {
    delete this._store[key]
  }

  /**
   * Sets the value of the pair identified by key to value, creating
   * a new key/value pair if none existed for key previously.
   */
  public setItem(key: string, value: string): void {
    if (!value)
      throw new TypeError(`Failed to execute 'setItem': 2 arguments required, but only 1 present`)

    this._store[key] = value
  }
}
