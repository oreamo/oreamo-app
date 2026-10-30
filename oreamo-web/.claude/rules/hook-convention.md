---
description: This file describes the conventions for implementing React hooks.
paths:
  - "src/**/use*.ts"
---

# Hook Convention

```
Follow the rules when implementing a React hook
```

### Rules

- File name should be in camelCase, starting with "use" and matching the hook name.
- Define the hook with function declaration and export it as a named export.
- Except closely related hooks, only single hook should be defined in a file.
  - Closely related hooks (e.g. hooks that share the same underlying store/state) may be defined together in a single file, named after the primary hook.
- The hook should return an object containing the values and functions that the hook provides.

### Structure

- This is just an example to show the implementation of a hook.
- It is not a strict rule and can be adjusted based on the specific use case.

```ts
interface UseHookOptions {
  ...
}

export function useHook({ ... }: UseHookOptions) {

  return {
    ...
  };
}
```
