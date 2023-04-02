import { useSyncExternalStore } from "preact/compat";
import { createStore } from "./mod.ts";
import { CreateStoreOptions, StoreAPI } from "./types.ts";

export function preactCreateStore<State>(
  state?: State,
  options?: CreateStoreOptions,
): [() => State, (state: Partial<State>) => void] {
  function useStore<State>(store: StoreAPI<State>) {
    return useSyncExternalStore(store.subscribe, store.getState);
  }
  const store = createStore(state, options);
  return [() => useStore(store), store.setState];
}
