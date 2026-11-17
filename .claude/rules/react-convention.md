---
description: This file describes the conventions for implementing React.
paths:
  - "oreamo-web/src/**/*.{tsx}"
  - "oreamo-web/src/**/*.{ts}"
---

# React Convention

```
Follow the rules when implementing React.
```

### React Compiler Optimization

- React compiler will optimize the component or hook instead of using useMemo and useCallback.
- Avoid using useMemo, useCallback and memo manually as much as possible.
- Only use memoization techniques when there is a performance issue.
- Use IIFE instead of useMemo when a value needs to be computed only once during the component's or hook's lifecycle.

### Side Effects

- Do not use useEffect, useLayoutEffect, useImperativeHandle as much as possible.
- When there is no other way to solve the problem without useEffect, make a custom hook which wraps the useEffect logic and use the hook in the component. This way, the component code will be cleaner and easier to read.
