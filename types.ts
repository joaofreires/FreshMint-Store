export type Listener<K> = (state: K, prevState?: K) => void;

const __MINT_STORE_ID = "__MINT_STORE_ID";

declare global {
  interface Window {
    __MINT_STORE: WebStorageProxy | undefined;
  }
}

interface WebStorageProxy {
  window?: WebStorage;
  sessionStorage?: WebStorage;
}

export type StoreAPI<S> = Store<S>;

export enum ProvidersType {
  window,
  localStorage,
  sessionStorage,
}

export type StorageProviders = keyof typeof ProvidersType;

export interface CreateStoreOptions {
  namespace?: string;
  provider?: StorageProviders;
  forceInitial?: boolean;
}

export interface Store<S> {
  setState: (f: ((state: S) => Partial<S>) | Partial<S>) => void;
  subscribe: (listener: Listener<S>) => () => void;
  getState: () => S;
  reset: () => void;
}

export interface Provider<S> {
  getState: () => S | undefined;
  initialize: (initialState?: S) => void;
  setState: (state: Partial<S>) => void;
  addListener: (arg0: Listener<S>) => () => void;
}

export interface WebStorage {
  setData: (namespace: string, newData: Record<string, unknown>) => void;
  getData: (namespace: string) => unknown;
  addListener: (
    namespace: string,
    listener: Listener<Record<string, unknown> | undefined>,
  ) => () => void;
}
