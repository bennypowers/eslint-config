Special JavaScript and TypeScript code standards for special people.

- Flat config, for ESLint 9 and 10
- TypeScript linting with [typescript-eslint](https://typescript-eslint.io)
- A11y linting with [eslint-plugin-lit-a11y](https://github.com/open-wc/open-wc/tree/master/packages/eslint-plugin-lit-a11y)
- JSON and JSONC linting with [eslint-plugin-jsonc](https://github.com/ota-meshi/eslint-plugin-jsonc)
- HTML linting with [eslint-plugin-html](https://github.com/BenoitZugmeyer/eslint-plugin-html)
- Catch `.only` with [eslint-plugin-no-only-tests](https://www.npmjs.com/package/eslint-plugin-no-only-tests)
- ESLint core rules where they still exist, with the `eslint-config-google` rule set as a base

## Install

```bash
npm install --save-dev eslint @pwrs/eslint-config
```

## Usage

`eslint.config.js`:

```js
import pwrs from '@pwrs/eslint-config';

export default [
  ...pwrs,
];
```

The package exports an array of flat config objects, so it can be spread into a
project config and extended afterwards. Project-specific adjustments go in later
entries:

```js
import pwrs from '@pwrs/eslint-config';
import globals from 'globals';

export default [
  ...pwrs,
  {
    languageOptions: {
      globals: globals.node,
    },
    rules: {
      'no-console': 'warn',
    },
  },
];
```

## Requirements

- ESLint 9 or 10
- Node 20 or newer
