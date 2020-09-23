---
title: Shadow DOM
eleventyNavigation:
  key: Shadow DOM
  parent: Components
  order: 4
---

By default, Lit components use [shadow DOM](https://developers.google.com/web/fundamentals/web-components/shadowdom) to encapsulate their templated DOM.

Shadow DOM provides three benefits:

* DOM scoping. DOM APIs like `document.querySelector` won't find elements in the
  component's shadow DOM, so it's harder for global scripts to accidentally break your component.
* Style scoping. You can write encapsulated styles for your shadow DOM that don't
  affect the rest of the DOM tree.
* Composition. The component's shadow DOM (managed by the component) is separate from the component's children. You can choose how children are rendered in your templated DOM. Component users can add and remove children using standard DOM APIs without accidentally breaking anything in your shadow DOM.

Where native shadow DOM isn't available, LitElement
uses the [Shady CSS](https://github.com/webcomponents/polyfills/tree/master/packages/shadycss) polyfill.

To customize the shadow root used by your Lit component, or to render _without_ shadow DOM, see [Specify the render root](#renderroot).

## Accessing nodes in the shadow DOM

The `render()` method result is usually rendered into shadow DOM, so the nodes are not direct children of the component. Use `this.shadowRoot.querySelector()` or `this.shadowRoot.querySelectorAll()` to find nodes in the
shadow DOM.

You can query the templated DOM after its initial render (for example, in `firstUpdated`), or use a getter pattern, like this:

```js
get _closeButton() {
  return this.shadowRoot.querySelector('#close-button');
}
```

LitElement supplies a set of decorators that provide a shorthand way of defining getters like this.

More information:

*   [Element.querySelector()](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelector) on MDN.
*   [Element.querySelectorAll()](https://developer.mozilla.org/en-US/docs/Web/API/Element/querySelectorAll) on MDN.

### @query, @queryAll, and @queryAsync decorators

The `@query`, `@queryAll`, and `@queryAsync` decorators all provide a convenient way to access nodes in the component's shadow root.

<div class="alert alert-info">

**Using decorators.** Decorators are a proposed JavaScript feature, so you’ll need to use a compiler like Babel or TypeScript to use decorators. See [Using decorators](decorators) for details.

</div>

The `@query` decorator modifies a class property, turning it into a getter that returns a node from the render root. The optional second argument is a cache flag which when true performs the DOM query only once and caches the result. This can be used as a performance optimization in cases when the node being queried is not expectd to change.


```js
import {LitElement, html} from 'lit-element';
import {query} from 'lit-element/lib/decorators.js';

class MyElement extends LitElement {
  @query('#first')
  _first;

  render() {
    return html`
      <div id="first"></div>
      <div id="second"></div>
    `;
  }
}
```

This decorator is equivalent to:

```js
get first() {
  return this.renderRoot.querySelector('#first');
}
```

<div class="alert alert-info">

**shadowRoot and renderRoot**. The [`renderRoot`](/api/classes/_lit_element_.litelement.html#renderroot) property identifies the container that the template is rendered into. By default, this is the component's `shadowRoot`. The decorators use `renderRoot`, so they should work correctly even if you override `createRenderRoot` as described in [Specify the render root](#renderroot)

</div>

The `@queryAll` decorator is identical to `query` except that it returns all matching nodes, instead of a single node. It's the equivalent of calling `querySelectorAll`.


```js
import {LitElement, html} from 'lit-element';
import {queryAll} from 'lit-element/lib/decorators.js';

class MyElement extends LitElement {
  @queryAll('div')
  _divs;

  render() {
    return html`
      <div id="first"></div>
      <div id="second"></div>
    `;
  }
}
```

Here, `divs` would return both `<div>` elements in the template. For TypeScript, the typing of a `@queryAll` property is `NodeListOf<HTMLElement>`. If you know exactly what kind of nodes you'll retrieve, the typing can be more specific:

```js
@queryAll('button')
_buttons!: NodeListOf<HTMLButtonElement>
```

The exclamation point (`!`) after `buttons` is TypeScript's [non-null assertion operator](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-0.html#non-null-assertion-operator). It tells the compiler to treat `buttons` as always being defined, never `null` or `undefined`.

Finally, `@queryAsync` works like `@query`, except that instead of returning a node directly, it returns a `Promise` that resolves to that node. Code can use this instead of waiting for the `updateComplete` promise.

This is useful, for example, if the node returned by `@queryAsync` can change as a result of another property change.

## Render children with the slot element {#slots}

Your component may accept children (like a `<ul>` element can have `<li>` children).

```html
<my-element>
  <p>A child</p>
</my-element>
```
By default, if an element has a shadow tree, its children don't render at all.

To render children, your template needs to include one or more [`<slot>` elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/slot), which act as placeholders for child nodes.

<div class="alert alert-info">

**Finding slotted children.** If your component needs information about its slotted children, see [Accessing slotted children](#accessing-slotted-children).

</div>

### Use the slot element

To render an element's children, create a `<slot>` for them in the element's template. For example:

```js
render(){
  return html`
    <div>
      <slot></slot>
    </div>
  `;
}
```

Children will now render in the `<slot>`:

```html
<my-element>
  <p>Render me</p>
</my-element>
```

The children aren't _moved_ in the DOM tree, but they're rendered _as if_ they were children of the `<slot>`.

Arbitrarily many children can populate a single slot:

```html
<my-element>
  <p>Render me</p>
  <p>Me too</p>
  <p>Me three</p>
</my-element>
```

{% include project.html folder="docs/templates/slots" openFile="my-element.js" %}

### Use named slots

To assign a child to a specific slot, ensure that the child's `slot` attribute matches the slot's `name` attribute:

```js
render(){
  return html`
    <div>
      <slot name="one"></slot>
    </div>
  `;
}
```

_index.html_

```html
<my-element>
  <p slot="one">Include me in slot "one".</p>
</my-element>
```

* **Named slots only accept children with a matching `slot` attribute.**

  For example, `<slot name="one"></slot>` only accepts children with the attribute `slot="one"`.

* **Children with a `slot` attribute will only be rendered in a slot with a matching `name` attribute.**

  For example, `<p slot="one">...</p>` will only be placed in `<slot name="one"></slot>`.

**Examples**

_my-element.js_

```js
{% include projects/docs/templates/namedslots/my-element.js %}
```

_index.html_

```html
{% include projects/docs/templates/namedslots/index.html %}
```

{% include project.html folder="docs/templates/namedslots" openFile="my-element.js" %}

**Use `name`, not `id`, to select slots.**

Note that a `slot`'s `id` attribute has no effect!

_my-element.js_

```js
render(){
  return html`
    <div>
      <slot id="one"></slot>
    </div>
  `;
}
```

_index.html_

```html
<my-element>
  <p slot="one">nope.</p>
  <p>ohai..</p>
</my-element>
```

{% include project.html folder="docs/templates/slotid" openFile="my-element.js" %}

## Accessing slotted children

To access children assigned to slots in your shadow root, you can use the standard `slot.assignedNodes` method and the `slotchange` event.

For example, you can create a getter to access assigned nodes for a particular slot:

```js
get _slottedChildren() {
  const slot = this.shadowRoot.querySelector('slot');
  const childNodes = slot.assignedNodes({flatten: true});
  return Array.prototype.filter.call(childNodes, (node) => node.nodeType == Node.ELEMENT_NODE);
}
```

You can also use the `slotchange` event to take action when the assigned nodes change. The following example extracts the text content of all of the slotted children.

```js
handleSlotchange(e) {
  const childNodes = e.target.assignedNodes({flatten: true});
  // ... do something with childNodes ...
  this.allText = Array.prototype.map.call(childNodes, (node) => {
    return node.textContent ? node.textContent : ''
  }).join('');
}

render() {
  return html`<slot @slotchange=${this.handleSlotchange}></slot>`;
}
```

More information:

*   [HTMLSlotElement](https://developer.mozilla.org/en-US/docs/Web/API/HTMLSlotElement) on MDN.


### @queryAssignedNodes decorator

The `@queryAssignedNodes` decorator converts a class property into a getter that returns all of the assigned nodes for a given slot in the component's shadow tree. The optional second boolean argument when true flattens the assigned nodes, meaning any assigned nodes that are slot elements are replaced with their assigned nodes. The optional third argument is a css selector which filters the results to matching elements.

<div class="alert alert-info">

**Using decorators.** Decorators are a proposed JavaScript feature, so you’ll need to use a compiler like Babel or TypeScript to use decorators. See [Using decorators](decorators) for details.

</div>

```js
// First argument is the slot name
// Second argument is `true` to flatten the assigned nodes.
@queryAssignedNodes('header', true)
_headerNodes;

// If the first argument is absent or an empty string, list nodes for the default slot.
@queryAssignedNodes()
_defaultSlotNodes;
```

The first example above is equivalent to the following code:

```js
get headerNodes() {
  const slot = this.shadowRoot.querySelector('slot[name=header]');
  return slot.assignedNodes({flatten: true});
}
```

For TypeScript, the typing of a `queryAssignedNodes` property is `NodeListOf<HTMLElement>`.

## Specify the render root {#renderroot}

The node into which your component's template will render is called its **render root**.

By default, LitElement creates an open `shadowRoot` and renders inside it, producing the following DOM structure:

```text
<my-element>
  #shadow-root
    <p>child 1</p>
    <p>child 2</p>
```

To customize a component's render root, implement `createRenderRoot` and return the node you want the template to render into.

For example, to render the template into the main DOM tree as your element's children:

```text
<my-element>
  <p>child 1</p>
  <p>child 2</p>
```

Implement `createRenderRoot` and return `this`:

```js
class LightDom extends LitElement {
  render() {
    return html`
      <p>This template renders without shadow DOM.</p>
    `;
  }
  createRenderRoot() {
  /**
   * Render template without shadow DOM. Note that shadow DOM features like
   * encapsulated CSS and slots are unavailable.
   */
    return this;
  }
}
```

{% include project.html folder="docs/templates/renderroot" openFile="my-element.js" %}

## Resources

For more information on shadow DOM:

* [Shadow DOM v1: Self-Contained Web Components](https://developers.google.com/web/fundamentals/web-components/shadowdom) on Web Fundamentals.
* [Using shadow DOM](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM) on MDN.
