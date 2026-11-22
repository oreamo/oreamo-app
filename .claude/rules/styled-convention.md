---
description: Conventions for MUI styled() components. Apply when styled() from @mui/material is used.
paths:
  - "web/src/**/*.{tsx}"
---

# Styled Component Convention

Apply these rules whenever `styled()` from `@mui/material` is used.

### Rules

- Design text with Typography component. Never design fonts with css.

### Naming

- A styled component for layout is named `Styled{Base}{Postfix}`.
  - `{Base}` is the component name by default.
  - `{Postfix}` is one of `Container`, `Wrapper`, `Group`, `Item`, assigned in this order by nesting depth.
  - `{Postfix}` always starts from `Container` and never skips a level.
  - When `{Base}` changes, the order restarts from `Container`.
- A styled component that is not for layout is named `Styled{Feature}`.
  - `{Feature}` describes the role of the element.

### Definition Location

- Define all styled components at the bottom of the file, after the main component.
- Order them top-down matching the order they appear in JSX.

### CSS Property Order

Follow this order within each styled block. Separate each section with a blank line.

1. **Sizing** — `width`, `minWidth`, `maxWidth`, `height`, `minHeight`, `maxHeight`
2. **Spacing** — `padding`, `paddingTop/Right/Bottom/Left`, `margin`, `marginTop/Right/Bottom/Left`
3. **Layout** — `display`, `flexDirection`, `flexWrap`, `flex`, `alignItems`, `justifyContent`, `gap`, `position`, `top`, `right`, `bottom`, `left`, `overflow`
4. **Border** — `border`, `borderTop/Right/Bottom/Left`, `borderRadius`, `outline`
5. **Background** — `backgroundColor`, `color`, `opacity`, `boxShadow`
6. **Pseudo-selectors** — `&:hover`, `&:focus`, `&:active`, `&.class`, `& > child` — always at the end

### Theme Access

- Use `({ theme }) =>` callback only when accessing theme values.
- Always use `theme` to access design tokens (colors, spacing, shape, etc.). Never import foundation constants (e.g. `PALETTE`, `BORDER_RADIUS`) directly for use in styled component CSS.

### Example

```tsx
const StyledCard = styled(Box)(({ theme }) => ({
  // 1. Sizing
  width: 160,
  height: 160,

  // 2. Spacing
  padding: "16px",

  // 3. Layout
  display: "flex",
  flexDirection: "column",
  overflow: "hidden",

  // 4. Border
  border: `1px solid ${theme.palette.scale[200]}`,
  borderRadius: "16px",

  // 5. Background
  backgroundColor: theme.palette.scale[50],
  boxShadow: theme.shadows[1],

  // 6. Pseudo-selectors
  "&:hover": {
    backgroundColor: theme.palette.scale[100],
    transform: "translateY(-3px)",
    boxShadow: theme.shadows[4],
  },
}));
```
