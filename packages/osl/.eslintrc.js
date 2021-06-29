module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:prettier/recommended',
    'plugin:jsx-control-statements/recommended',
  ],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 12,
    sourceType: 'module',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
  root: true,
  plugins: ['react'],
  rules: {
    'react/jsx-no-undef': [2, { allowGlobals: true }],
  },
  overrides: [
    {
      files: ['*.js', '*.jsx'],
    },
  ],
}
