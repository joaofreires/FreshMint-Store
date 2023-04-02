import { CreateStoreOptions, Listener, Provider, Store } from "./types.ts";
import { getProvider } from "./storage_providers.ts";

const __MINT_STORE_ID = "__MINT_STORE_ID";

const defaultCreateStoreOptions: CreateStoreOptions = {
  provider: "window",
  forceInitial: false,
};

export function createStore<S>(): Store<S>;
export function createStore<S>(
  initialState?: S | (() => S),
  opts?: CreateStoreOptions,
): Store<S>;
export function createStore<S>(
  initialState?: S | (() => S),
  opts?: CreateStoreOptions,
): Store<S>;
export function createStore<S>(
  initialState?: S | (() => S),
  opts?: CreateStoreOptions,
): Store<S>;
export function createStore<S>(
  initialState: S | (() => S) | undefined = undefined,
  opts: CreateStoreOptions = defaultCreateStoreOptions,
): Store<S> {
  const forceInitial = opts.forceInitial ?? false;
  const namespace = opts.namespace ||
    `${__MINT_STORE_ID}_${crypto.randomUUID()}`;
  const providerName = opts.provider ?? "window";
  const initialStateData = (initialState instanceof Function)
    ? initialState()
    : initialState;
  const provider: Provider<S> = getProvider(
    providerName,
    initialStateData,
    namespace,
  );
  console.log(provider);
  let state: S = (forceInitial ? initialStateData : provider.getState()) ??
    {} as S;
  provider.setState(state);
  const listeners: Listener<S>[] = [];

  function dispatchListeners() {
    listeners.forEach((f) => f(state));
  }

  function providerListener(newState: S) {
    state = newState;
    dispatchListeners();
  }

  provider.addListener(providerListener);

  return {
    setState(update: ((newState: S) => Partial<S>) | Partial<S>) {
      let updatedState = typeof update === "function"
        ? update(state)
        : (update as Partial<S>);
      if (state instanceof Object) {
        updatedState = {
          ...(state as S),
          ...updatedState,
        };
      }
      state = updatedState as S;
      provider.setState(state as S);
    },
    subscribe(listener) {
      listeners.push(listener);
      return () => {
        const listenerIdx = listeners.indexOf(listener);
        listeners.splice(listenerIdx, 1);
      };
    },
    getState() {
      return state;
    },
    reset() {
      state = initialStateData ?? {} as S;
      dispatchListeners();
    },
  };
}
