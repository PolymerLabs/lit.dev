import {html, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
import './my-section.js';
import './my-heading.js';

@customElement('my-app')
export class MyApp extends LitElement {
  render() {
    // <my-section> serves as both context provider and consumer. It provides a
    // level value that is 1 greater than what's provided to it. This allows
    // nested <my-section> to provide a different value based on its depth.

    // <my-heading> adjusts what heading tag to use and the color based on the
    // level context.
    return html`
      <my-section>
        <my-heading>Heading level 1</my-heading>
        <my-section>
          <my-heading>Heading level 2</my-heading>
        </my-section>
        <my-section>
          <my-heading>Heading level 2</my-heading>
          <my-section>
            <my-heading>Heading level 3</my-heading>
          </my-section>
          <my-section>
            <my-heading>Heading level 3</my-heading>
            <my-section>
              <my-heading>Heading level 4</my-heading>
            </my-section>
          </my-section>
        </my-section>
        <my-section>
          <my-heading>Heading level 2</my-heading>
          <my-section>
            <my-heading>Heading level 3</my-heading>
            <my-section>
              <my-heading>Heading level 4</my-heading>
            </my-section>
            <my-section>
              <my-heading>Heading level 4</my-heading>
            </my-section>
          </my-section>
        </my-section>
      </my-section>
      <my-section>
        <my-heading>Heading level 1</my-heading>
        <my-section>
          <my-heading>Heading level 2</my-heading>
          <my-section>
            <my-heading>Heading level 3</my-heading>
            <my-section>
              <my-heading>Heading level 4</my-heading>
              <my-section>
                <my-heading>Heading level 5</my-heading>
              </my-section>
            </my-section>
          </my-section>
        </my-section>
        <my-section>
          <my-heading>Heading level 2</my-heading>
          <my-section>
            <my-heading>Heading level 3</my-heading>
            <my-section>
              <my-heading>Heading level 4</my-heading>
            </my-section>
          </my-section>
        </my-section>
      </my-section>
    `;
  }
}
