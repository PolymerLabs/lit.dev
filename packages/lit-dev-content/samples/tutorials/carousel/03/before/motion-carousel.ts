import {LitElement, html, PropertyValues} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {styles} from './styles.js';

@customElement('motion-carousel')
export class MotionCarousel extends LitElement {
  static styles = styles;

  private isAdvancing = false;
  private _selected = 0;
  @property({type: Number})
  get selected() {
    return this._selected;
  }

  set selected(i: number) {
    const max = this.childElementCount - 1;
    const old = this.selected;
    const wrapToStart = old === max && i > old;
    const wrapToEnd = old === 0 && i < old;
    const selected = wrapToStart ? 0 : (wrapToEnd ? max :
      Math.min(max, Math.max(0, i)));
    if (selected !== old) {
      this._selected = selected;
      this.isAdvancing = i > old;
      this.requestUpdate('selected', old);
    }
  }

  render() {
    return html`
      <div class="fit">
        <slot></slot>
      </div>
    `;
  }

}
