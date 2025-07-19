const tsParser = (await import('@typescript-eslint/parser')).default;

export default [
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': await import('@typescript-eslint/eslint-plugin'),
      react: await import('eslint-plugin-react'),
      'react-hooks': await import('eslint-plugin-react-hooks'),
    },
    rules: {
      'react/react-in-jsx-scope': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  },
];
