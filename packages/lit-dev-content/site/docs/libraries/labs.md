---
title: Lit Labs
eleventyNavigation:
  key: Lit Labs
  parent: Related libraries
  order: 3
---

Lit Labs is an umbrella for projects related to Lit that aren't quite ready for production. These projects may be experimental or incomplete, and they're subject to breaking changes. Lit Labs projects are published under the `@lit-labs` npm scope.

Current Lit Labs projects include:

* [Motion](https://github.com/lit/lit/blob/main/packages/labs/motion/README.md#lit-labsmotion). Animation helpers for Lit templates. The `@lit-labs/motion` package includes an `animate` directive for adding tweening animations when an element changes state, as well as an `AnimateController` class for programmatically controlling and coordinating animations. You can find a number of motion examples in the [Playground](https://lit.dev/playground/#sample=examples/motion-simple).
* [React](https://github.com/lit/lit/tree/main/packages/labs/react#lit-labsreact). React integration helpers for custom elements and reactive controllers.
* [scoped-registry-mixin](https://github.com/lit/lit/tree/main/packages/labs/scoped-registry-mixin#lit-labsscoped-registry-mixin) Mixin for Lit that integrates with the speculative [Scoped CustomElementRegistry polyfill](https://github.com/webcomponents/polyfills/tree/master/packages/scoped-custom-element-registry).
* [SSR](https://github.com/lit/lit/tree/main/packages/labs/ssr#lit-labsssr). A package for server-side rendering Lit templates and components.
* [Task](https://github.com/lit/lit/blob/main/packages/labs/task/README.md#lit-labstask). A reactive controller for handling asynchronous tasks.

When a Lit Labs project is ready for production it may be migrated to a new location outside of Lit Labs. For example, the [`@lit/localize`](/docs/localization/overview/) package started out as a Lit Labs project.
