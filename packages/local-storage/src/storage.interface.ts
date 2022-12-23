// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IStorageEngine
  extends Pick<Storage, 'clear' | 'getItem' | 'length' | 'removeItem' | 'setItem'> {}
