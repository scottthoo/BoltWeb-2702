import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  // public/kid-game holds built games from other repos (scripts/build-kid-games.mjs).
  { ignores: ['dist', 'public/kid-game'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      // Core no-unused-vars does not see JSX usage (<App />, <motion.div>).
      'react/jsx-uses-vars': 'error',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
  {
    // Build tooling runs in Node, not the browser.
    files: ['*.config.js', 'scripts/**/*.js'],
    languageOptions: {
      globals: globals.node,
    },
  },
];
