---
description: This file describes the conventions for implementing React components.
paths:
  - "web/src/**/*.{tsx}"
---

# Component Convention

```
Follow the rules when implementing a React component
```

### Rules

- File name should be in PascalCase, matching the component name.
- Define the component with function keyword and export it as a named export.
- Prefer to use compound component pattern instead of props-driven pattern.
- Except compound component, only single component should be defined in a file.
  - Compound component should export only the main component, and the sub-components should be defined as properties of the main component.
- Do not handle events directly in the JSX. Instead, define event handlers as functions inside the component and pass them to the JSX elements.
- Do not use `forwardRef`. Since React 19, function components can receive `ref` as a normal prop, so declare `ref` in the props interface instead.

### Structure

- This is just an example to show the order of component implementation.
- It is not a strict rule and can be adjusted based on the specific use case.
- Follow as much as possible to keep the codebase consistent and maintainable.

```tsx
interface ComponentProps {
  ...
}

export function Component({ ... }: ComponentProps) {
  // Refs
  const ref = useRef<...>(null);

  // Functional Hooks
  const navigate = useNavigate();

  // External State Hooks
  const { ... } = use...Store();
  const { ... } = useContext(...);

  // Internal State Hooks
  const [state, setState] = useState(...);

  // Custom Hooks
  const { ... } = useSearch(...);
  const { ... } = usePagination(...);
  const { ... } = useSearchPagination(...);

  // API Hooks
  const { ... } = useTranslationInfos(...);

  // Form Hooks
  const { ... } = useForm(...);

  // Side Effect Hooks
  use...Effect(...);

  // Utilities
  const isAllowed = (...) => {
    ...
  }

  // Handlers
  const handleEvent = () => {
    ...
  }

  // Derived Values (conditional rendering only)
  const showSomething = ...

  // JSX
  return ...
}

// Styled Components
const Styled... = styled(...)`
  ... // styled
`
```
