// window_storage_test.ts
import {
  assert,
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.182.0/testing/asserts.ts";

import { getProvider } from "./storage_providers.ts";

Deno.test("WindowProvider: should initialize with initialState", () => {
  const initialState = { key: "initialValue" };
  const provider = getProvider("window", initialState);
  assertEquals(provider.getState(), initialState);
});

Deno.test("SessionStorageProvider: should initialize with initialState", () => {
  const initialState = { key: "initialValue" };
  const provider = getProvider("sessionStorage", initialState);
  assertEquals(provider.getState(), initialState);
});

Deno.test("LocalStorageProvider: should initialize with initialState", () => {
  const initialState = { key: "initialValue" };
  const provider = getProvider("localStorage", initialState);
  assertEquals(provider.getState(), initialState);
});

Deno.test("LocalStorageProvider: should set and get state", () => {
  const provider = getProvider("localStorage");
  const state = { key: "value" };
  provider.setState(state);
  assertEquals(provider.getState(), state);
});

Deno.test("LocalStorageProvider: should call listener when state is set", () => {
  const provider = getProvider("localStorage");
  let called = false;
  provider.addListener(() => {
    called = true;
  });
  provider.setState({ key: "newValue" });
  assert(called);
});

Deno.test("LocalStorageProvider: should remove listener", () => {
  const provider = getProvider("localStorage");
  let callCount = 0;
  const listener = () => {
    callCount++;
  };
  const removeListener = provider.addListener(listener);
  provider.setState({ key: "newValue" });
  assertEquals(callCount, 1);

  removeListener();
  provider.setState({ key: "newerValue" });
  assertEquals(callCount, 1); // No new calls
});

Deno.test("LocalStorageProvider: should handle custom namespace", () => {
  const provider1 = getProvider<Record<string, unknown> | undefined>(
    "localStorage",
    undefined,
    "namespace1",
  );
  const provider2 = getProvider<Record<string, unknown> | undefined>(
    "localStorage",
    undefined,
    "namespace2",
  );
  const state1 = { key: "value1" };
  const state2 = { key: "value2" };
  provider1.setState(state1);
  provider2.setState(state2);
  assertEquals(provider1.getState(), state1);
  assertEquals(provider2.getState(), state2);
  assertNotEquals(provider1.getState(), provider2.getState());
});
Deno.test("WindowProvider: should set and get state", () => {
  const provider = getProvider("window");
  const state = { key: "value" };
  provider.setState(state);
  assertEquals(provider.getState(), state);
});

Deno.test("SessionStorageProvider: should set and get state", () => {
  const provider = getProvider("sessionStorage");
  const state = { key: "value" };
  provider.setState(state);
  assertEquals(provider.getState(), state);
});

Deno.test("WindowProvider: should call listener when state is set", () => {
  const provider = getProvider("window");
  let called = false;
  provider.addListener(() => {
    called = true;
  });
  provider.setState({ key: "newValue" });
  assert(called);
});

Deno.test("SessionStorageProvider: should call listener when state is set", () => {
  const provider = getProvider("sessionStorage");
  let called = false;
  provider.addListener(() => {
    called = true;
  });
  provider.setState({ key: "newValue" });
  assert(called);
});

Deno.test("WindowProvider: should remove listener", () => {
  const provider = getProvider("window");
  let callCount = 0;
  const listener = () => {
    callCount++;
  };
  const removeListener = provider.addListener(listener);
  provider.setState({ key: "newValue" });
  assertEquals(callCount, 1);

  removeListener();
  provider.setState({ key: "newerValue" });
  assertEquals(callCount, 1); // No new calls
});

Deno.test("SessionStorageProvider: should remove listener", () => {
  const provider = getProvider("sessionStorage");
  let callCount = 0;
  const listener = () => {
    callCount++;
  };
  const removeListener = provider.addListener(listener);
  provider.setState({ key: "newValue" });
  assertEquals(callCount, 1);

  removeListener();
  provider.setState({ key: "newerValue" });
  assertEquals(callCount, 1); // No new calls
});

Deno.test("WindowProvider: should handle custom namespace", () => {
  const provider1 = getProvider<Record<string, unknown> | undefined>(
    "window",
    undefined,
    "namespace1",
  );
  const provider2 = getProvider<Record<string, unknown> | undefined>(
    "window",
    undefined,
    "namespace2",
  );
  const state1 = { key: "value1" };
  const state2 = { key: "value2" };
  provider1.setState(state1);
  provider2.setState(state2);
  assertEquals(provider1.getState(), state1);
  assertEquals(provider2.getState(), state2);
  assertNotEquals(provider1.getState(), provider2.getState());
});

Deno.test("SessionStorageProvider: should handle custom namespace", () => {
  const provider1 = getProvider<Record<string, unknown> | undefined>(
    "sessionStorage",
    undefined,
    "namespace1",
  );
  const provider2 = getProvider<Record<string, unknown> | undefined>(
    "sessionStorage",
    undefined,
    "namespace2",
  );
  const state1 = { key: "value1" };
  const state2 = { key: "value2" };
  provider1.setState(state1);
  provider2.setState(state2);
  assertEquals(provider1.getState(), state1);
  assertEquals(provider2.getState(), state2);
  assertNotEquals(provider1.getState(), provider2.getState());
});
