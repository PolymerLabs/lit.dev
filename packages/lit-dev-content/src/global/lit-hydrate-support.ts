// This file is needed for rollup bundling order despite it never being loaded
// in Production. Loading this file directly in prod in default.html would cause
// an unnecessary second request to lit.js
import 'lit/experimental-hydrate-support.js';
