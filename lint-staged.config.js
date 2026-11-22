export default {
  'web/**/*.{js,jsx,ts,tsx}': [
    'pnpm --dir web exec eslint --fix',
    'pnpm --dir web exec prettier --write',
  ],
  'web/**/*.{json,css,md}': ['pnpm --dir web exec prettier --write'],

  'agent/**/*.py': [
    'uv run --directory agent ruff check --fix',
    'uv run --directory agent ruff format',
  ],

  'api/**/*.java': () => 'api/gradlew -p api spotlessApply',
};
