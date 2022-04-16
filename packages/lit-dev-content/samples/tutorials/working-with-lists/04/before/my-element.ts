import {LitElement, html} from 'lit';
import {customElement, property, state} from 'lit/decorators.js';

@customElement('my-element')
class MyElement extends LitElement {
  @property({attribute: false})
  items = ['San Francisco', 'New York', 'Los Angeles', 'Chicago', 'Seattle'];

  @state()
  lastIndex = 0;

  render() {
    return html`
      <p>The last city I've been to: ${this.items[this.lastIndex]}</p>
      <ul>
        <!-- TODO: Add mouseenter event handlers for items below. -->
        ${this.items.map(
          (item) => html`<li>${item}</li>`
        )}
      </ul>
    `;
  }

  // TODO: Implement method to update `lastIndex`.
}
