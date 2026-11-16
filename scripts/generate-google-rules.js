#!/usr/bin/env node
/**
 * Regenerates `google-rules.json` from `eslint-config-google`.
 *
 * The upstream package last published in 2018 and targets ESLint 5. Its rule
 * names are the ESLint core names, several of which moved to
 * `@stylistic/eslint-plugin` and changed their option shapes. This script
 * translates the rule set once so the config depends on maintained packages
 * and does not break when ESLint removes its deprecated formatting rules.
 *
 * Usage: node scripts/generate-google-rules.js
 */
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import stylistic from '@stylistic/eslint-plugin';
import { builtinRules } from 'eslint/use-at-your-own-risk';
import google from 'eslint-config-google';

/** @param {unknown} value */
function severity(value) {
  if (Array.isArray(value))
    return value[0];
  return value;
}

/** @param {unknown} value */
function options(value) {
  if (Array.isArray(value))
    return value.slice(1);
  return [];
}

/**
 * Option shapes that differ between the deprecated core rule and the
 * stylistic reimplementation.
 */
function translate(name, value) {
  if (name === 'quotes' && stylistic.rules.quotes) {
    const [mode, opts = {}] = options(value);
    if (typeof opts.allowTemplateLiterals === 'boolean') {
      return [
        severity(value),
        mode,
        {
          ...opts,
          allowTemplateLiterals: opts.allowTemplateLiterals ? 'always' : 'never',
        },
      ];
    }
  }
  return value;
}

const translated = {};
const skipped = [];

for (const [name, value] of Object.entries(google.rules)) {
  const core = builtinRules.get(name);
  if (name === 'array-bracket-spacing' || name === 'object-curly-spacing')
    // Expressed in the config as a single @stylistic/list-style rule.
    continue;
  if (stylistic.rules[name])
    translated[`@stylistic/${name}`] = translate(name, value);
  else if (core && !core.meta.deprecated)
    translated[name] = value;
  else
    skipped.push(name);
}

const target = join(fileURLToPath(import.meta.url), '..', '..', 'google-rules.json');
await writeFile(target, `${JSON.stringify(translated, null, 2)}\n`);

// eslint-disable-next-line no-console
console.log(`wrote ${target}: ${Object.keys(translated).length} rules, skipped ${skipped.length}: ${skipped.join(', ')}`);
