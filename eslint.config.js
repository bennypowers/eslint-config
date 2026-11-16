// @ts-check
import js from '@eslint/js';
import { createRequire } from 'node:module';
import html from 'eslint-plugin-html';
import jsonc from 'eslint-plugin-jsonc';
import litA11y from 'eslint-plugin-lit-a11y';
import noOnlyTests from 'eslint-plugin-no-only-tests';
import stylistic from '@stylistic/eslint-plugin';
import globals from 'globals';
import tseslint from 'typescript-eslint';

const require = createRequire(import.meta.url);
/** Rule data derived from eslint-config-google, translated for @stylistic. */
const googleRules = require('./google-rules.json');

const OFF = 'off';
const WARNING = 'warn';
const ERROR = 'error';

const ALWAYS = 'always';
const NEVER = 'never';
const IGNORE = 'ignore';


/**
 * ESLint deprecated its formatting rules in 8.53 and will remove them in 11.
 * Route every rule that `@stylistic/eslint-plugin` implements through that
 * plugin, and leave everything else on the ESLint core rule of the same name.
 */
function withStylistic(rules) {
  return Object.fromEntries(
    Object.entries(rules).map(([name, value]) => {
      return stylistic.rules[name] ? [`@stylistic/${name}`, value] : [name, value];
    }),
  );
}

/** These files run in a nodejs context, mostly config files */
const NODE_FILES = [
  '*.cjs.js',
  '.babelrc.js',
  'commitlint.config.?([cm])js',
  'karma.conf.?([cm])js',
  'postcss.config.?([cm])js',
  'rollup.config.?([cm])js',
  'web-*.config.?([cm])js',
  'workbox-config.?([cm])js',
];

/** These files contain mocha tests */
const TEST_FILES = [
  '**/*.@(test,spec).[jt]s',
];

/** Packages which re-export lit-html */
const litHtmlSources = [
  '@apollo-elements/lit-apollo',
  '@open-wc/testing',
];

const TYPESCRIPT_FILES = [
  '**/*.ts',
  '**/*.mts',
  '**/*.cts',
];

const tsRecommended = tseslint.configs.recommended.map(config => ({
  ...config,
  files: TYPESCRIPT_FILES,
}));

/**
 * ESLint 9 removed the core `valid-jsdoc` and `require-jsdoc` rules. Shared
 * configs written for ESLint 8 still reference them, and there is no
 * replacement, so strip them rather than fail on an unknown rule.
 */
const REMOVED_RULES = new Set(['valid-jsdoc', 'require-jsdoc']);

function withoutRemovedRules(config) {
  if (!config.rules)
    return config;
  return {
    ...config,
    rules: Object.fromEntries(
      Object.entries(config.rules).filter(([name]) => !REMOVED_RULES.has(name)),
    ),
  };
}

export default [
  {
    ignores: [
      'node_modules/',
      'package-lock.json',
    ],
  },
  js.configs.recommended,
  withoutRemovedRules({ rules: googleRules }),
  withoutRemovedRules(litA11y.configs.recommended),
  ...jsonc.configs['flat/recommended-with-jsonc'],
  ...tsRecommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.es2022,
      },
    },

    settings: {
      litHtmlSources,
    },

    plugins: {
      '@stylistic': stylistic,
      html,
      'no-only-tests': noOnlyTests,
    },

    rules: withStylistic({
      'arrow-parens': [ERROR, 'as-needed'],
      'brace-style': [ERROR, '1tbs', { allowSingleLine: true }],
      'block-spacing': [ERROR, ALWAYS],

      'comma-dangle': [ERROR, {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: IGNORE,
      }],

      'comma-spacing': ERROR,
      'comma-style': [ERROR, 'last'],
      'curly': [ERROR, 'multi-or-nest'],
      'eqeqeq': [ERROR, ALWAYS, { null: IGNORE }],

      'indent': [ERROR, 2, {
        flatTernaryExpressions: true,
        SwitchCase: 1,
        ignoredNodes: [
          `ConditionalExpression`,
          `TaggedTemplateExpression[tag.name="html"] > TemplateLiteral CallExpression > ObjectExpression`,
          `TaggedTemplateExpression[tag.name="html"] > TemplateLiteral ObjectExpression`,
          `TaggedTemplateExpression[tag.name="html"] > TemplateLiteral CallExpression > TaggedTemplateLiteral`,
          `TaggedTemplateExpression[tag.name="html"] > TemplateLiteral ArrowFunctionExpression > BlockStatement`,
        ],
      }],

      'linebreak-style': [ERROR, 'unix'],
      'lines-between-class-members': [ERROR, ALWAYS, { exceptAfterSingleLine: true }],

      'max-len': [ERROR, 100, {
        ignoreComments: true,
        ignoreTemplateLiterals: true,
        ignorePattern: '^import (type )?\\{? ?\\w+ ?\\}? from \'(.*)\';$',
        ignoreUrls: true,
      }],

      'new-cap': OFF,

      'no-unused-vars': [WARNING, { ignoreRestSiblings: true }],
      'no-var': ERROR,
      'no-console': ERROR,
      'no-extend-native': ERROR,

      // Replaces the deprecated object-curly-spacing and array-bracket-spacing
      // rules. Line-break enforcement is disabled for brackets and imports so
      // wrapped lists stay allowed, matching the previous rules.
      '@stylistic/list-style': [ERROR, {
        singleLine: { spacing: NEVER },
        overrides: {
          '{}': { singleLine: { spacing: ALWAYS } },
          '[]': OFF,
          '()': OFF,
          'ImportDeclaration': OFF,
          'ImportAttributes': OFF,
        },
      }],

      'no-only-tests/no-only-tests': ERROR,


      'operator-linebreak': [ERROR, 'after', { overrides: { '?': 'after', ':': 'before' } }],

      'prefer-const': ERROR,
      'prefer-destructuring': ERROR,
      'prefer-object-spread': ERROR,
      'prefer-promise-reject-errors': OFF,
      'prefer-spread': ERROR,
      'prefer-template': ERROR,

      'spaced-comment': [ERROR, ALWAYS, { markers: ['/'] }],
      'space-before-function-paren': [ERROR, {
        anonymous: NEVER,
        named: NEVER,
        asyncArrow: ALWAYS,
      }],
      'space-infix-ops': ERROR,
      'space-unary-ops': ERROR,

      'template-tag-spacing': ERROR,
      'template-curly-spacing': ERROR,
    }),
  },
  {
    files: TEST_FILES,
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.mocha,
      },
    },
    rules: {
      '@stylistic/max-len': OFF,
      'no-invalid-this': OFF,
      'no-console': OFF,
    },
  },
  {
    files: ['**/*.json', '**/*.jsonc', '**/*.json5'],
    rules: {
      // Line length and formatting rules do not apply to data files.
      '@stylistic/max-len': OFF,
    },
  },
  {
    files: TYPESCRIPT_FILES,
    rules: {
      // The core rule cannot see type-only usage; the TypeScript-aware
      // variant below covers these files.
      'no-unused-vars': OFF,
      '@typescript-eslint/no-explicit-any': [WARNING, {
        ignoreRestArgs: true,
      }],
      '@typescript-eslint/no-unused-vars': [WARNING, {
        ignoreRestSiblings: true,
      }],
      '@typescript-eslint/ban-ts-comment': [WARNING, {
        'ts-expect-error': 'allow-with-description',
      }],
    },
  },
  {
    files: NODE_FILES,
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    files: ['*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
  {
    files: ['**/*.html'],
    plugins: {
      html,
    },
  },
];
