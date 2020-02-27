/* eslint-disable no-unused-vars */
const OFF = 'off';
const WARNING = 'warn';
const ERROR = 'error';

const ALWAYS = 'always';
const NEVER = 'never';
const IGNORE = 'ignore';
/* eslint-enable no-unused-vars */

const NODE_FILES = [
  'rollup.config.js',
  'karma.conf.js',
  '.babelrc.js',
  'workbox-config.js',
];

export default {
  extends: ['eslint:recommended', 'google'],
  env: { browser: true, es6: true },
  parserOptions: { ecmaVersion: 2018, sourceType: 'module' },
  plugins: [
    'html',
    'no-only-tests',
    'json',
    'no-loops',
  ],

  rules: {
    'arrow-parens': [ERROR, 'as-needed'],
    'brace-style': [ERROR, "1tbs", { "allowSingleLine": true }],
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
    'curly': [ERROR, "multi-or-nest"],
    'eqeqeq': [ERROR, ALWAYS, { null: IGNORE }],

    'indent': [ERROR, 2, {
      flatTernaryExpressions: true,
      SwitchCase: 1,
      ignoredNodes: [
        'ConditionalExpression',
        'TaggedTemplateExpression > TemplateLiteral CallExpression > ObjectExpression',
        'TaggedTemplateExpression > TemplateLiteral > ObjectExpression',
        'TaggedTemplateExpression > TemplateLiteral CallExpression > TaggedTemplateLiteral',
      ],
    }],

    'linebreak-style': [ERROR, 'unix'],
    'lines-between-class-members': [ERROR, ALWAYS],
    'max-len': [ERROR, 100, { ignoreComments: true, ignoreTemplateLiterals: true, ignoreUrls: true }],
    'new-cap': OFF,
    'no-console': ERROR,
    'no-extend-native': ERROR,
    'no-loops/no-loops': WARNING,
    'no-only-tests/no-only-tests': ERROR,
    'no-var': ERROR,
    'object-curly-spacing': [ERROR, ALWAYS],
    'operator-linebreak': [ERROR, "after", { "overrides": { "?": "after", ":": "before" } }],
    'prefer-const': ERROR,
    'prefer-destructuring': ERROR,
    'prefer-object-spread': ERROR,
    'prefer-promise-reject-errors': OFF,
    'prefer-spread': ERROR,
    'prefer-template': ERROR,
    'require-jsdoc': OFF,
    'spaced-comment': [ERROR, ALWAYS, { markers: ['/'] }],
    'space-before-function-paren': [ERROR, { anonymous: NEVER, named: NEVER, asyncArrow: ALWAYS }],
    'space-infix-ops': ERROR,
    'space-unary-ops': ERROR,
    'template-tag-spacing': ERROR,
    'template-curly-spacing': ERROR,
  },
  overrides: [{
    files: ['**/*.test.js', '**/*.spec.js'],
    env: { node: true, mocha: true },
    rules: {
      'max-len': OFF,
      'no-invalid-this': OFF,
      'no-console': OFF,
      'require-jsdoc': OFF,
    },
  }, {
    files: ['**/*.ts'],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    extends: [
      'plugin:@typescript-eslint/eslint-recommended',
      'plugin:@typescript-eslint/recommended'
    ],
    rules: {
      'valid-jsdoc': 0
    }
  }, {
    files: NODE_FILES,
    env: { node: true },
  }],
};
