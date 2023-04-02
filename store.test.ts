import {
  assert,
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std/testing/asserts.ts";
import { createStore } from "./store.ts";

Deno.test("createStore: should create a store with initial state", () => {
  const initialState = { key: "initialValue" };
  const store = createStore(initialState);
  assertEquals(store.getState(), initialState);
});

Deno.test("createStore: should create a store with initial state using function", () => {
  const initialState = { key: "initialValue" };
  const store = createStore(() => initialState);
  assertEquals(store.getState(), initialState);
});

Deno.test("createStore: should update state", () => {
  const initialState = { key: "initialValue" };
  const store = createStore(initialState);
  const newState = { key: "newValue" };
  store.setState(newState);
  assertEquals(store.getState(), newState);
});

Deno.test("createStore: should call subscriber when state is updated", () => {
  const initialState = { key: "initialValue" };
  const store = createStore(initialState);
  let called = false;
  store.subscribe(() => {
    called = true;
  });
  store.setState({ key: "newValue" });
  assert(called);
});

Deno.test("createStore: should unsubscribe a listener", () => {
  const initialState = { key: "initialValue" };
  const store = createStore(initialState);
  let callCount = 0;
  const listener = () => {
    callCount++;
  };
  const unsubscribe = store.subscribe(listener);
  store.setState({ key: "newValue" });
  assertEquals(callCount, 1);

  unsubscribe();
  store.setState({ key: "newerValue" });
  assertEquals(callCount, 1); // No new calls
});

Deno.test("createStore: should reset state", () => {
  const initialState = { key: "initialValue" };
  const store = createStore(initialState);
  store.setState({ key: "newValue" });
  assertNotEquals(store.getState(), initialState);
  store.reset();
  assertEquals(store.getState(), initialState);
});
