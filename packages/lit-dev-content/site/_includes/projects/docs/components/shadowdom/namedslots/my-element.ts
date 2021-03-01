import { LitElement, html, customElement } from 'lit-element';

@customElement('my-element')
export class MyElement extends LitElement {
  protected render() {
    return html`
      <p>
        <slot name="one"></slot>
        <slot name="two"></slot>
      </p>
    `;
  }
}
