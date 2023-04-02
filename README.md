# Fresh Mint Store

Another lightweight state management library compatible with Preact/React
external store interface to share state among Fresh islands. The library offers
a simple way to manage the state of your Islands saving the state data to
different storage options, such as window, sessionStorage, and localStorage.

## Usage

First import the preactCreateStore function:

```typescript
import { preactCreateStore } from "./preact_mint_store.ts";
```

Then create a store with an optional initial state and options:

```typescript
const initialState = { count: 0 };
const [useStore, setState] = preactCreateStore(initialState);
```

Now, you can use the useStore hook in your components to access the state:

```tsx
import { preactCreateStore } from "@mint/preact.ts";

const [useState, setState] = preactCreateStore(2);

export default function Counter() {
  const state = useState();
  return (
    <div class="flex gap-2 w-full">
      <p>Counter</p>
      <p class="flex-grow-1 font-bold text-xl">{state}</p>
      <Button
        onClick={() => {
          setState(state - 1);
        }}
      >
        -1
      </Button>
      <Button
        onClick={() => {
          setState(state + 1);
        }}
      >
        +1
      </Button>
    </div>
  );
}
```

To access from multiple Islands, it's useful to keep a storage file and import
from there the `preactCreateStore` result hooks.

```tsx
// store.ts
export const [useState, setState] = preactCreateStore({counter: 2});

// Counter.tsx
import { setState, useState } from "../stores.ts";
...
```

Note that you can pass namespaces to your stores if you need. Keep in mind that
stores with the same namespace will share the same object and it can break your
components if not handled well.

The `CreateStoreOptions` object allows you to configure the behavior of your
store:

- `namespace`: A custom namespace for your store. Defaults to a random
  namespace.
- `provider`: The storage provider to use ("window", "sessionStore",
  "localStorage"). Defaults to "window". Be careful when choosing session or
  localStorage, it could be helpful to share state through pages and can add
  more complexity and non-deterministics bugs.
- `forceInitial`: A boolean indicating whether to use the initial state passed
  to the store, even if there's data in the storage. Defaults to false. For
  example:

```tsx
const options = {
  namespace: "customNamespace",
  provider: "localStorage",
  forceInitial: true,
};

const [useStore, setState] = preactCreateStore(initialState, options);
```

The `preactCreateStore` is simplification for the following code: If you are
using other library than preact, it can be useful to integrate.

```tsx
import { useSyncExternalStore } from "preact/compat";
import { createStore, StoreAPI } from "@mint/mod.ts";

function useStore<State>(store: StoreAPI<State>) {
  return useSyncExternalStore(store.subscribe, store.getState);
}
const options = {};
const store = createStore(2, options);

export default function Counter() {
  const state = useStore(store);
  return (
    <Button
      onClick={() => {
        store.setState(state - 1);
      }}
    >
      -1
    </Button>
  );
}
```
