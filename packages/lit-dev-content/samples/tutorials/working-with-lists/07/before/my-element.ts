import {LitElement, html} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {map} from 'lit/directives/map.js';

@customElement('my-element')
class MyElement extends LitElement {
  @property({attribute: false})
  things = [
    "Raindrops on roses",
    "Whiskers on kittens",
    "Bright copper kettles",
    "Warm woolen mittens",
  ];

  render() {
    return html`
      <p>A few of my favorite things</p>
      <ul>
        ${map(
          this.things,
          (thing, index) => html`
            <li>
              ${thing}
              <button @click=${() => this._deleteThing(index)}>Delete</button>
            </li>
          `
        )}
      </ul>
    `;
  }

  private _deleteThing(index: number) {
    this.things.splice(index, 1);
    this.requestUpdate();
  }
}
