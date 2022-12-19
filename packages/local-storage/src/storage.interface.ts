// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IStorageEngine
  extends Pick<Storage, 'getItem' | 'setItem' | 'removeItem' | 'clear'> {}
