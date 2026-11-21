export default {
  'oreamo-web/**/*.{js,jsx,ts,tsx}': [
    'pnpm --dir oreamo-web exec eslint --fix',
    'pnpm --dir oreamo-web exec prettier --write',
  ],
  'oreamo-web/**/*.{json,css,md}': ['pnpm --dir oreamo-web exec prettier --write'],

  'oreamo-agent/**/*.py': [
    'uv run --directory oreamo-agent ruff check --fix',
    'uv run --directory oreamo-agent ruff format',
  ],

  'oreamo-api/**/*.java': () => 'oreamo-api/gradlew -p oreamo-api spotlessApply',
};
