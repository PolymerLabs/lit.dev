/**
 * @license
 * Copyright (c) 2021 The Polymer Project Authors. All rights reserved.
 * This code may only be used under the BSD style license found at
 * http://polymer.github.io/LICENSE.txt
 * The complete set of authors may be found at
 * http://polymer.github.io/AUTHORS.txt
 * The complete set of contributors may be found at
 * http://polymer.github.io/CONTRIBUTORS.txt
 * Code distributed by Google as part of the polymer project is also
 * subject to an additional IP rights grant found at
 * http://polymer.github.io/PATENTS.txt
 */

const fs = require('fs/promises');
const pathlib = require('path');

module.exports = async () =>
  // Don't use require() because of Node caching in watch mode.
  JSON.parse(
    await fs.readFile(
      pathlib.resolve(
        __dirname,
        '..',
        '..',
        '..',
        'lit-dev-api',
        'api-data',
        'pages.json'
      ),
      'utf8'
    )
  );
