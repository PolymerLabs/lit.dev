import {html, css, LitElement} from 'lit';
import {customElement} from 'lit/decorators.js';
// TODO: Import directives

const ROWS = 8;
const COLUMNS = 8;

@customElement('my-element')
export class MyElement extends LitElement {
  static styles = css`
    /* playground-fold */
    :host {
      display: block;
      width: 400px;
      height: 400px;
    }
    #board {
      display: grid;
      grid-template-columns: repeat(${COLUMNS}, ${100/COLUMNS}%);
      grid-template-rows: repeat(${ROWS}, ${100/ROWS}%);
      border: 2px solid #404040;
      box-sizing: border-box;
      height: 100%;
    }
    .square {
      padding: 2px;
    }
    .square.black {
      color: #ddd;
      background: black;
    }
    .square.white {
      color: gray;
      background: white;
    }
    /* playground-fold-end */

  `;

  render() {
    return html`
      <p>Let's play a game!</p>
      <div id="board">
        <!-- TODO: Place squares here. -->
      </div>
    `;
  }
}
