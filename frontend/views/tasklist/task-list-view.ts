import { customElement, html } from "lit-element";
import "@vaadin/vaadin-button";
import "@vaadin/vaadin-text-field";
import "@vaadin/vaadin-checkbox";
import "@vaadin/vaadin-progress-bar";
import { Binder, field } from "@vaadin/form";
import TodoModel from "../../generated/com/example/application/TodoModel";
import Todo from "../../generated/com/example/application/Todo";
import { store } from "../../stores/store";
import { View } from "../../view";
import { CheckboxElement } from "@vaadin/vaadin-checkbox";

@customElement("task-list-view")
export class TaskListView extends View {
  private binder = new Binder(this, TodoModel);

  render() {
    const { model } = this.binder;

    return html`
      <h1>My tasks</h1>
      <div class="form">
        <vaadin-text-field ...=${field(model.task)}></vaadin-text-field>
        <vaadin-button theme="primary" @click=${this.addTask}
          >Add</vaadin-button
        >
      </div>
      <div class="tasks">
        ${store.todos.map(
          (todo) => html`
            <div class="todo">
              <vaadin-checkbox
                ?checked=${todo.done}
                @change=${(e: CustomEvent) => this.updateTodoStatus(todo, e)}
              ></vaadin-checkbox>
              ${todo.task}
            </div>
          `
        )}
      </div>
    `;
  }

  async addTask() {
    await this.binder.submitTo(store.saveTodo.bind(store));
    this.binder.clear();
  }

  updateTodoStatus(todo: Todo, e: CustomEvent) {
    const checkBox = e.target as CheckboxElement;
    todo.done = checkBox.checked;
    store.saveTodo(todo);
  }
}
