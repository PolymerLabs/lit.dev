/**
 * @license
 * Copyright 2021 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */

import type Koa from 'koa';

/**
 * Options for contentSecurityPolicyMiddleware.
 */
export interface ContentSecurityPolicyMiddlewareOptions {
  /**
   * Enables some additional directives that are only required when running in
   * local dev mode.
   */
  devMode?: boolean;

  /**
   * If true, CSP violations will be reported to the Google CSP Collector.
   */
  reportViolations?: boolean;

  /**
   * An array of "<hash-algorithm>-<base64-value>" CSP sources that will be
   * allowlisted to run as inline scripts.
   */
  inlineScriptHashes?: string[];

  /**
   * Origin for Playground preview iframes.
   */
  playgroundPreviewOrigin: string;
}

/**
 * A Google service which aggregates CSP violations.
 */
const CSP_REPORT_URI = 'https://csp.withgoogle.com/csp/lit-dev';

/**
 * TODO(aomarks) Generate this automatically. See
 * https://github.com/lit/lit.dev/issues/531.
 */
const GOOGLE_ANALYTICS_INLINE_SCRIPT_HASH = `'sha256-bG+QS/Ob2lFyxJ7r7PCtj/a8YofLHFx4t55RzjR1znI='`;

/**
 * Creates a Koa middleware that sets the lit.dev Content Security Policy (CSP)
 * headers.
 *
 * Some good resources about CSP:
 * https://web.dev/strict-csp/
 * https://www.w3.org/TR/CSP3/
 * https://developer.mozilla.org/en-US/docs/Web/HTTP/CSP
 * https://speakerdeck.com/lweichselbaum/csp-a-successful-mess-between-hardening-and-mitigation
 * https://csp-evaluator.withgoogle.com/
 */
export const contentSecurityPolicyMiddleware = (
  opts: ContentSecurityPolicyMiddlewareOptions
): Koa.Middleware => {
  const makePolicy = (...directives: string[]) =>
    [
      ...directives,
      // Prevent an injected <base> tag from modifying relative URLs.
      `base-uri 'none'`,
      // Prevent form submissions.
      `form-action 'none'`,
      // Disallow other sites from iframing this site (e.g. clickjacking).
      `frame-ancestors 'none'`,
      ...(opts.reportViolations ? [`report-uri ${CSP_REPORT_URI}`] : []),
    ].join('; ');

  // Policy for the main HTML entrypoints (homepage, docs, playground, etc.)
  const htmlCsp = makePolicy(
    // TODO(aomarks) We should also enable trusted types, but that will require
    // a policy in playground-elements for creating the worker, and a policy
    // es-module-lexer for doing an eval (see next comment for more on that).
    `script-src ${[
      `'self'`,
      // TODO(aomarks) Remove unsafe-eval when https://crbug.com/1253267 is fixed.
      // See comment below about playgroundWorkerCsp.
      `'unsafe-eval'`,
      `https://www.googletagmanager.com/gtag/js`,
      GOOGLE_ANALYTICS_INLINE_SCRIPT_HASH,
      ...(opts.inlineScriptHashes?.map((hash) => `'${hash}'`) ?? []),
      // In dev mode, data: scripts are required because @web/dev-server uses them
      // for automatic reloads.
      ...(opts.devMode ? [`data:`] : []),
    ].join(' ')}`,

    // TODO(aomarks) Remove unpkg.com when https://crbug.com/1253267 is fixed.
    // See comment below about playgroundWorkerCsp.
    //
    // In dev mode, ws: connections are required because @web/dev-server uses
    // them for automatic reloads.
    `connect-src 'self' https://unpkg.com/${opts.devMode ? ` ws:` : ''}`,

    // Playground previews and embedded YouTube videos.
    `frame-src ${opts.playgroundPreviewOrigin} https://www.youtube-nocookie.com/`,

    // We need 'unsafe-inline' because CodeMirror uses inline styles See
    // https://discuss.codemirror.net/t/inline-styles-and-content-security-policy/1311/2
    // TODO(aomarks) Is it possible to know all of the possible inline styles
    // CodeMirror will use, and provide them here using 'unsafe-hashes'? They
    // look quite dynamic though.
    `style-src 'self' 'unsafe-inline'`,

    // TODO(aomarks) We need fonts.gstatic.com for fetching Open Sans (Manrope
    // is already hosted locally). We should probably just host Open Sans
    // ourselves, because there is no cross-origin caching benefit (see
    // https://developers.google.com/web/updates/2020/10/http-cache-partitioning),
    // and it would be one fewer connection to make.
    `font-src 'self' https://fonts.gstatic.com/`,

    // TODO(aomarks) We use some data: URLs for SVGs in docs.css. There's
    // probably a simpler way.
    // The ytimg.com domain is needed for embedded YouTube videos.
    `img-src 'self' data: https://i.ytimg.com/`,

    // Disallow any embeds, applets, etc. This would usually be covered by
    // `default-src: 'none'`, but we can't set that for the reason explained
    // below.
    `object-src 'none'`,

    // TODO(aomarks) This could be 'none' if we didn't use <svg><use> elements,
    // because Firefox does not follow the img-src directive for them, so there
    // is no other directive to use. See
    // https://bugzilla.mozilla.org/show_bug.cgi?id=1303364#c4 and
    // https://github.com/w3c/webappsec-csp/issues/199.
    `default-src 'self'`
  );

  // Policy for the playground-elements web worker script.
  //
  // TODO(aomarks) Currently this worker CSP will take effect in Firefox and
  // Safari, but not Chrome. Chrome does not currently follow the CSP spec for
  // workers; instead workers inherit the CSP policy of their parent context.
  // This is being actively fixed (https://crbug.com/1253267), and once it ships
  // we can remove unsafe-eval and unpkg.com from the main CSP above.
  const playgroundWorkerCsp = makePolicy(
    // unsafe-eval is needed because we use es-module-lexer to parse import
    // statements in modules. es-module-lexer needs unsafe-eval because:
    //
    // 1. It uses Web Assembly, which requires unsafe-eval until
    //    wasm-unsafe-eval ships in all browsers:
    //
    //      Spec:    https://github.com/w3c/webappsec-csp/pull/293
    //      Chrome:  https://bugs.chromium.org/p/chromium/issues/detail?id=948834
    //      Safari:  https://bugs.webkit.org/show_bug.cgi?id=197759
    //      Firefox: <not yet filed>
    //
    // 2. It uses eval() to parse JavaScript string literals
    //    (https://github.com/guybedford/es-module-lexer/blob/91964da6b086dc5029091eeef481180a814ce24a/src/lexer.js#L32).
    //    This is theoretically a safe use of eval because it's only used to
    //    process strings that have already been lexed as single or double quote
    //    strings. Trusted types could be used to isolate the exact eval() call.
    //    It may also be a good idea to replace the eval call with a fast WASM
    //    implementation of string unescaping.
    `script-src 'unsafe-eval'`,

    // Allow bare module specifiers to be fetched from unpkg. Note this does not
    // restrict the user from directly importing from arbitrary other URLs in
    // their import statements when using the Playground.
    `connect-src https://unpkg.com/`,

    // Disallow everything else.
    `default-src 'none'`
  );

  // For all other responses, set the strictest possible CSP, just in case a
  // response that shouldn't normally allow any code execution actually does.
  //
  // See https://github.com/w3c/webappsec/issues/520#issuecomment-488516726 and
  // https://github.com/webhintio/hint/issues/3403#issue-528402128 for
  // discussion of why this is a good practice.
  const strictFallbackCsp = makePolicy(`default-src 'none'`);

  return async (ctx, next) => {
    await next();

    let policy: string;
    if (ctx.response.type === 'text/html') {
      policy = htmlCsp;
    } else if (ctx.path.endsWith('/playground-typescript-worker.js')) {
      policy = playgroundWorkerCsp;
    } else {
      policy = strictFallbackCsp;
    }
    // TODO(aomarks) Remove -Report-Only suffix when we are confident the
    // policy is working.
    ctx.set('Content-Security-Policy-Report-Only', policy);
  };
};
