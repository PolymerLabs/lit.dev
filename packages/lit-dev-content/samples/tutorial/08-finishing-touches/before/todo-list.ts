import {LitElement, html, css} from 'lit';
import {customElement, property, query} from 'lit/decorators.js';

type ToDoItem = {
  text: string,
  completed: boolean
};

@customElement('todo-list')
export class ToDoList extends LitElement {
  static get styles() {
    return css`
      .completed {
        text-decoration-line: line-through;
        color: #777;
      }
    `;
  }

  @property({attribute: false})
  listItems = [
    { text: 'Make to-do list', completed: true },
    { text: 'Complete Lit tutorial', completed: false }
  ];
  @property()
  hideCompleted = false;

  render() {
    // TODO: Replace items definition.
    const items = this.listItems;
    const todos = html`
      <ul>
        ${items.map((item) =>
          html`
            <li
                class=${item.completed ? 'completed' : ''}
                @click=${() => this.toggleCompleted(item)}>
              ${item.text}
            </li>`
        )}
      </ul>
    `;
    // TODO: Define partial templates.
    return html`
      <h2>To Do</h2>
      <!-- TODO: Update expression. -->
      ${todos}
      <input id="newitem" aria-label="New item">
      <button @click=${this.addToDo}>Add</button>
      <br>
      <label>
        <input type="checkbox"
          @change=${this.setHideCompleted}
          ?checked=${this.hideCompleted}>
        Hide completed
      </label>


    `;
  }

  toggleCompleted(item: ToDoItem) {
    item.completed = !item.completed;
    this.requestUpdate();
  }

  setHideCompleted(e: Event) {
    this.hideCompleted = (e.target as HTMLInputElement).checked;
  }

  @query('#newitem')
  input!: HTMLInputElement;

  addToDo() {
    this.listItems.push({text: this.input.value, completed: false});
    this.input.value = '';
    this.requestUpdate();
  }
}

