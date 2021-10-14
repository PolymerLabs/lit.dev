/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

interface LitDevEnvironment {
  mainPort: number;
  playgroundPort: number;
  fakeGithubPort: number | undefined;
  eleventyMode: 'prod' | 'dev';
  eleventyOutDir: string;
  googleAnalyticsId: string;
  reportCspViolations: boolean;
  playgroundSandboxUrl: string;
  githubMainUrl: string | undefined;
  githubApiUrl: string | undefined;
  githubAuthorizeRedirectUrl: string | undefined;
  githubClientId: string | undefined;
  /**
   * IMPORTANT: Do not hard code actual secrets.
   */
  githubClientSecret: string | undefined;
}

const TEST_GOOGLE_ANALYTICS_ID = 'G-PPMSZR9W18';
const FAKE_GITHUB_CLIENT_ID = 'FAKE_CLIENT_ID';
const FAKE_GITHUB_CLIENT_SECRET = 'FAKE_CLIENT_SECRET';

/**
 * Try to get the environment variable with the given name and throw if it's not
 * defined or is not an integer.
 */
const integerEnv = (name: string): number => {
  const val = process.env[name];
  if (!val || val.match(/^\d+$/) === null) {
    throw new Error(
      `Expected environment variable ${name} to be an integer` +
        ` but was ${JSON.stringify(val)}.`
    );
  }
  return Number(val);
};

/**
 * Try to get the environment variable with the given name and throw if it's not
 * defined or is not a valid URL.
 */
const urlEnv = (name: string): string => {
  const val = process.env[name];
  try {
    new URL(val ?? '');
  } catch {
    throw new Error(
      `Expected environment variable ${name} to be a URL` +
        ` but was ${JSON.stringify(val)}.`
    );
  }
  return val!;
};

const environment = <T extends LitDevEnvironment>(env: T): T => env;

/**
 * lit.dev environment configuration for fast local dev mode with auto-reload.
 */
export const dev = environment({
  mainPort: 5415,
  playgroundPort: 5416,
  fakeGithubPort: 5417,
  eleventyMode: 'dev',
  eleventyOutDir: '_dev',
  googleAnalyticsId: TEST_GOOGLE_ANALYTICS_ID,
  reportCspViolations: false,
  get playgroundSandboxUrl() {
    return `http://localhost:${this.playgroundPort}/`;
  },
  get githubMainUrl() {
    return `http://localhost:${this.fakeGithubPort}/`;
  },
  get githubApiUrl() {
    // We fake both github.com and api.github.com with the same server, since
    // they don't have overlapping endpoint paths.
    return this.githubMainUrl;
  },
  get githubAuthorizeRedirectUrl() {
    return `http://localhost:${this.mainPort}/playground/signin/`;
  },
  githubClientId: FAKE_GITHUB_CLIENT_ID,
  githubClientSecret: FAKE_GITHUB_CLIENT_SECRET,
});

/**
 * lit.dev environment configuration for running a prod-ish environment locally.
 */
const local = environment({
  mainPort: 6415,
  playgroundPort: 6416,
  fakeGithubPort: 6417,
  eleventyMode: 'prod',
  eleventyOutDir: '_site',
  googleAnalyticsId: TEST_GOOGLE_ANALYTICS_ID,
  reportCspViolations: false,
  get playgroundSandboxUrl() {
    return `http://localhost:${this.playgroundPort}/`;
  },
  get githubMainUrl() {
    return `http://localhost:${this.fakeGithubPort}/`;
  },
  get githubApiUrl() {
    // We fake both github.com and api.github.com with the same server, since
    // they don't have overlapping endpoint paths.
    return this.githubMainUrl;
  },
  get githubAuthorizeRedirectUrl() {
    return `http://localhost:${this.mainPort}/playground/signin/`;
  },
  githubClientId: FAKE_GITHUB_CLIENT_ID,
  githubClientSecret: FAKE_GITHUB_CLIENT_SECRET,
});

/**
 * lit.dev environment configuration for automatically generated test PRs.
 */
const pr = environment({
  get mainPort() {
    // Assigned automatically and passed as an environment variable.
    return integerEnv('PORT');
  },
  get playgroundPort() {
    // Assigned automatically and passed as an environment variable.
    return integerEnv('PORT');
  },
  fakeGithubPort: undefined, // Does not run
  eleventyMode: 'prod',
  eleventyOutDir: '_site',
  googleAnalyticsId: TEST_GOOGLE_ANALYTICS_ID,
  reportCspViolations: false,
  get playgroundSandboxUrl() {
    // Generated by cloudbuild-pr.yaml using the PR number and commit SHA and
    // passed as an environment variable.
    return urlEnv('PLAYGROUND_SANDBOX');
  },
  githubMainUrl: undefined, // Not set up yet
  githubApiUrl: undefined, // Not set up yet
  githubAuthorizeRedirectUrl: undefined, // Not set up yet
  githubClientId: undefined, // Not set up yet
  githubClientSecret: undefined, // Not set up yet
});

/**
 * lit.dev environment configuration for the live production site.
 */
const prod = environment({
  get mainPort() {
    // Assigned automatically and passed as an environment variable.
    return integerEnv('PORT');
  },
  get playgroundPort() {
    // Assigned automatically and passed as an environment variable.
    return integerEnv('PORT');
  },
  fakeGithubPort: undefined, // Does not run
  eleventyMode: 'prod',
  eleventyOutDir: '_site',
  googleAnalyticsId: 'G-FTZ6CJP9F3',
  reportCspViolations: true,
  playgroundSandboxUrl: 'https://playground.lit.dev/',
  githubMainUrl: undefined, // Not set up yet
  githubApiUrl: undefined, // Not set up yet
  githubAuthorizeRedirectUrl: undefined, // Not set up yet
  githubClientId: undefined, // Not set up yet
  githubClientSecret: undefined, // Not set up yet
});

const environments = {dev, local, pr, prod};

/**
 * Return the environment configuration matching the LITDEV_ENV environment
 * variable.
 */
export const getEnvironment = (): LitDevEnvironment => {
  const name = process.env.LITDEV_ENV;
  const env = environments[(name ?? '') as keyof typeof environments];
  if (!env) {
    throw new Error(
      `Expected environment variable LITDEV_ENV to be` +
        ` one of ${Object.keys(environments).join(', ')},` +
        ` but was ${JSON.stringify(name)}.`
    );
  }
  return env;
};
