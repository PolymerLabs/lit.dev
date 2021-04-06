/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import resolve from '@rollup/plugin-node-resolve';
import summary from 'rollup-plugin-summary';
import {terser} from 'rollup-plugin-terser';

const terserOptions = {
  warnings: true,
  ecma: 2020,
  compress: {
    unsafe: true,
    passes: 2,
  },
  output: {
    // "some" preserves @license and @preserve comments
    comments: 'some',
    inline_script: false,
  },
  mangle: {
    properties: false,
  },
};

export default [
  {
    input: 'lib/global/mobile-nav.js',
    output: {
      file: 'site/_includes/js/global/mobile-nav.js',
      format: 'esm',
    },
    plugins: [resolve(), terser(terserOptions), summary()],
  },
  {
    input: 'lib/global/mods.js',
    output: {
      file: 'site/_includes/js/global/mods.js',
      format: 'esm',
    },
    plugins: [resolve(), terser(terserOptions), summary()],
  },
  {
    input: 'lib/pages/home.js',
    output: {
      file: 'site/_includes/js/pages/home.js',
      format: 'esm',
    },
    plugins: [resolve(), terser(terserOptions), summary()],
  },
  {
    input: 'lib/pages/docs.js',
    output: {
      file: 'site/_includes/js/pages/docs.js',
      format: 'esm',
    },
    plugins: [resolve(), terser(terserOptions), summary()],
  },
  {
    input: 'lib/pages/playground.js',
    output: {
      file: 'site/_includes/js/pages/playground.js',
      format: 'esm',
    },
    plugins: [resolve(), terser(terserOptions), summary()],
  },
  {
    input: ['lib/global/global.js', 'lib/global/playground-elements.js'],
    output: {
      dir: '_site/js/global/',
      format: 'esm',
      // Override the default chunk name of "[name]-[hash].js" because:
      //
      // 1. By default, the hash is included in the filename, which would
      //    require us to pipe the hash to the Eleventy HTML template somehow,
      //    because we preload this chunk. This will obviously break if we ever
      //    have >1 chunk, so we'll probably eventually need to do this piping
      //    (chunkFileNames can also be a function, so we could pick static
      //    names that way too).
      //
      // 2. The default name is picked from one of the included modules. In our
      //    case, it picks "mwc-icon-button", which isn't great because this
      //    more importantly contains lit, mwc-base, etc.
      chunkFileNames: 'common.js',
    },
    onwarn(warning) {
      if (warning.code !== 'CIRCULAR_DEPENDENCY') {
        console.error(`(!) ${warning.message}`);
      }
    },
    plugins: [
      resolve({
        dedupe: () => true,
      }),
      terser(terserOptions),
      summary(),
    ],
  },
];
