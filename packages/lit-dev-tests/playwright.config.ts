/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import {PlaywrightTestConfig} from '@playwright/test';
const config: PlaywrightTestConfig = {
  testDir: 'src/playwright',
  use: {
    screenshot: 'off',
    baseURL: 'http://localhost:6415/',
  },
  webServer: {
    command: 'npm start',
    port: 6415,
  },
  // Prevent implicit snapshot creation and tests passing. Create screenshots
  // explicitly with either:
  //  * Github Action: "Artifacts / Download link for updated screenshots" for
  //    committing the snapshot to the repository.
  //  * `npm run test:integration:update-golden-screenshots` for local testing.
  updateSnapshots: 'none',
};
export default config;
