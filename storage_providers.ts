import {
  Listener,
  Provider,
  ProvidersType,
  StorageProviders,
  WebStorage,
} from "./types.ts";
const __MINT_STORE_ID = "__MINT_STORE_ID";

function getWebStorageProxy(providerType: ProvidersType) {
  window.__MINT_STORE = window.__MINT_STORE ?? {};
  switch (providerType) {
    case ProvidersType.sessionStorage: {
      window.__MINT_STORE.sessionStorage = window.__MINT_STORE.sessionStorage ??
        new SessionStorage();
      return window.__MINT_STORE.sessionStorage;
    }
    default: {
      window.__MINT_STORE.window = window.__MINT_STORE.window ??
        new WindowStorage();
      return window.__MINT_STORE.window;
    }
  }
}

export function destroyWebStorageProxy() {
  window.__MINT_STORE = undefined;
}

class BaseWindowProvider<S> implements Provider<S> {
  protected namespace: string;
  protected storage: WebStorage | undefined;
  constructor(initialState?: S, namespace?: string) {
    console.log("BaseWindowProvider", namespace);
    this.namespace = namespace || __MINT_STORE_ID;
    this.initialize(initialState);
  }
  getState() {
    return this.storage?.getData(this.namespace) as S;
  }
  setState(state: Partial<S>) {
    this.storage?.setData(this.namespace, state);
  }
  addListener(listener: Listener<S>) {
    const removeListener = this.storage?.addListener(
      this.namespace,
      (state) => listener(state as S),
    );
    return removeListener ?? (() => {});
  }
  initialize(_initialState?: S) {}
}

class WindowProvider<S> extends BaseWindowProvider<S> {
  initialize(initialState?: S) {
    this.storage = getWebStorageProxy(ProvidersType.window);
    this.setState((this.getState() ?? initialState) as Partial<S>);
  }
}

class SessionStorageProvider<S> extends BaseWindowProvider<S> {
  initialize(initialState?: S) {
    this.storage = getWebStorageProxy(ProvidersType.sessionStorage);
    this.setState((this.getState() ?? initialState) as Partial<S>);
  }
}

class LocalStorageProvider<S> extends BaseWindowProvider<S> {
  initialize(initialState?: S) {
    this.storage = getWebStorageProxy(ProvidersType.localStorage);
    this.setState((this.getState() ?? initialState) as Partial<S>);
  }
}

export class WindowStorage implements WebStorage {
  private listeners: Map<
    string,
    Listener<Record<string, unknown> | undefined>[]
  > = new Map();
  private data: Record<string, unknown> = {};

  setData(namespace: string, newData: Record<string, unknown>) {
    this.data[namespace] = newData;
    this.listeners.get(namespace)?.forEach((f) => f(newData));
  }
  getData(namespace: string) {
    return this.data[namespace];
  }
  addListener(
    namespace: string,
    listener: Listener<Record<string, unknown> | undefined>,
  ) {
    const oldListeners = this.listeners.get(namespace) ?? [];
    this.listeners.set(namespace, [...oldListeners, listener]);
    return () => {
      const listenerIdx = this.listeners.get(namespace)?.indexOf(listener) ||
        -1;
      this.listeners.get(namespace)?.splice(listenerIdx, 1);
    };
  }
}

export class SessionStorage implements WebStorage {
  private listeners: Map<
    string,
    Listener<Record<string, unknown> | undefined>[]
  > = new Map();

  setData(namespace: string, newData: Record<string, unknown>) {
    sessionStorage.setItem(
      `${__MINT_STORE_ID}_${namespace}`,
      JSON.stringify(newData),
    );
    this.listeners.get(namespace)?.forEach((f) => f(newData));
  }
  getData(namespace: string) {
    return JSON.parse(
      String(sessionStorage.getItem(`${__MINT_STORE_ID}_${namespace}`)),
    );
  }
  addListener(
    namespace: string,
    listener: Listener<Record<string, unknown> | undefined>,
  ) {
    const oldListeners = this.listeners.get(namespace) ?? [];
    this.listeners.set(namespace, [...oldListeners, listener]);
    return () => {
      const listenerIdx = this.listeners.get(namespace)?.indexOf(listener) ||
        -1;
      this.listeners.get(namespace)?.splice(listenerIdx, 1);
    };
  }
}

export class LocalStorage implements WebStorage {
  private listeners: Map<
    string,
    Listener<Record<string, unknown> | undefined>[]
  > = new Map();

  setData(namespace: string, newData: Record<string, unknown>) {
    localStorage.setItem(
      `${__MINT_STORE_ID}_${namespace}`,
      JSON.stringify(newData),
    );
    this.listeners.get(namespace)?.forEach((f) => f(newData));
  }
  getData(namespace: string) {
    return JSON.parse(
      String(localStorage.getItem(`${__MINT_STORE_ID}_${namespace}`)),
    );
  }
  addListener(
    namespace: string,
    listener: Listener<Record<string, unknown> | undefined>,
  ) {
    const oldListeners = this.listeners.get(namespace) ?? [];
    this.listeners.set(namespace, [...oldListeners, listener]);
    return () => {
      const listenerIdx = this.listeners.get(namespace)?.indexOf(listener) ||
        -1;
      this.listeners.get(namespace)?.splice(listenerIdx, 1);
    };
  }
}

export function getProvider<S>(
  providerName: StorageProviders,
  initialState?: S,
  namespace?: string,
): Provider<S> {
  if (ProvidersType[providerName] == ProvidersType.sessionStorage) {
    return new SessionStorageProvider<S>(initialState, namespace);
  }
  if (ProvidersType[providerName] == ProvidersType.localStorage) {
    return new LocalStorageProvider<S>(initialState, namespace);
  }
  return new WindowProvider<S>(initialState, namespace);
}
