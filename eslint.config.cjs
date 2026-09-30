'use strict';

const eslint = require('@eslint/js');

const MINI_PROGRAM_GLOBALS = Object.freeze({
  App: 'readonly',
  Component: 'readonly',
  Page: 'readonly',
  clearTimeout: 'readonly',
  console: 'readonly',
  getApp: 'readonly',
  getCurrentPages: 'readonly',
  module: 'readonly',
  require: 'readonly',
  setTimeout: 'readonly',
  wx: 'readonly'
});

const RULES = Object.freeze({
  ...eslint.configs.recommended.rules,
  'array-callback-return': 'error',
  'arrow-body-style': ['error', 'as-needed'],
  'arrow-parens': ['error', 'as-needed'],
  'brace-style': ['error', '1tbs'],
  'comma-dangle': ['error', 'never'],
  'comma-spacing': ['error', { before: false, after: true }],
  curly: ['error', 'all'],
  'dot-notation': 'error',
  eqeqeq: ['error', 'always'],
  'eol-last': ['error', 'always'],
  indent: ['error', 2, { SwitchCase: 1 }],
  'keyword-spacing': 'error',
  'no-duplicate-imports': 'error',
  'no-eval': 'error',
  'no-implied-eval': 'error',
  'no-new-wrappers': 'error',
  'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
  'no-param-reassign': 'error',
  'no-shadow': 'error',
  'no-trailing-spaces': 'error',
  'no-undef': 'error',
  'no-unneeded-ternary': 'error',
  'no-unreachable': 'error',
  'no-unused-vars': ['error', {
    args: 'after-used',
    caughtErrors: 'all',
    ignoreRestSiblings: true
  }],
  'no-useless-catch': 'error',
  'no-var': 'error',
  'object-curly-spacing': ['error', 'always'],
  'object-shorthand': 'error',
  'prefer-const': 'error',
  'prefer-promise-reject-errors': 'error',
  'prefer-template': 'error',
  quotes: ['error', 'single', { avoidEscape: true }],
  radix: 'error',
  semi: ['error', 'always'],
  'space-before-blocks': 'error',
  'space-before-function-paren': ['error', { anonymous: 'always', asyncArrow: 'always', named: 'never' }],
  'space-infix-ops': 'error',
  'space-unary-ops': 'error',
  'template-curly-spacing': 'error',
  'valid-typeof': 'error',
  yoda: 'error'
});

module.exports = [
  {
    ignores: [
      '.idea/**',
      'miniprogram_npm/**',
      'node_modules/**'
    ]
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: MINI_PROGRAM_GLOBALS
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error'
    },
    rules: RULES
  },
  {
    files: ['**/*.cjs'],
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'commonjs',
      globals: {
        __dirname: 'readonly',
        console: 'readonly',
        module: 'readonly',
        process: 'readonly',
        require: 'readonly'
      }
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error'
    },
    rules: RULES
  }
];
