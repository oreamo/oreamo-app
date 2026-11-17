export default {
  // Web: lint and format the staged files with the web configuration.
  'oreamo-web/**/*.{js,jsx,ts,tsx}': [
    'pnpm --dir oreamo-web exec eslint --fix',
    'pnpm --dir oreamo-web exec prettier --write',
  ],
  'oreamo-web/**/*.{json,css,md}': ['pnpm --dir oreamo-web exec prettier --write'],

  // Agent: lint and format the staged files with the agent configuration.
  'oreamo-agent/**/*.py': [
    'uv run --directory oreamo-agent ruff check --fix',
    'uv run --directory oreamo-agent ruff format',
  ],

  // API: format the whole project, since Spotless does not take the file paths.
  'oreamo-api/**/*.java': () => 'oreamo-api/gradlew -p oreamo-api spotlessApply',
};
