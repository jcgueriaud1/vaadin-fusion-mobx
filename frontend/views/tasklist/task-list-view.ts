import {css, customElement, html, query} from "lit-element";
import { MobxLitElement } from "@adobe/lit-mobx";
import "@vaadin/vaadin-button";
import "@vaadin/vaadin-text-field";
import "@vaadin/vaadin-checkbox";
import "@vaadin/vaadin-progress-bar";
import { Binder, field } from "@vaadin/form";
import TodoModel from "../../generated/com/example/application/TodoModel";
import Todo from "../../generated/com/example/application/Todo";
import { store } from "../../store";
import type {TextFieldElement} from "@vaadin/vaadin-text-field";

@customElement("task-list-view")
export class TaskListView extends MobxLitElement {
  private binder = new Binder(this, TodoModel);

  @query("#text-field")
  private textfield?: TextFieldElement;

  render() {
    const { model } = this.binder;

    return html`
      <h1>My tasks</h1>
      <div class="form">
        <vaadin-text-field id="text-field" ...=${field(model.task)}></vaadin-text-field>
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
                @checked-changed=${(e: CustomEvent) =>
                  this.updateTodoStatus(todo, e)}
              ></vaadin-checkbox>
              ${todo.task}
            </div>
          `
        )}
      </div>
    `;
  }

  protected firstUpdated() {
    if (this.textfield) {
      this.textfield.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.addTask();
        }
      });
    }
  }

  async addTask() {
    console.log("addTask");
    await this.binder.submitTo(store.saveTodo.bind(store));
    this.binder.clear();
    if (this.textfield) {
      this.textfield.focus();
    }
  }

  updateTodoStatusChange(todo: Todo, e: CustomEvent) {
    console.log("updateTodoStatusChange");
    debugger;
    todo.done = (e.target as HTMLInputElement).checked;
    store.saveTodo(todo);
  }
  updateTodoStatus(todo: Todo, e: CustomEvent) {
    console.log("updateTodoStatus");
    if (todo.done !== e.detail.value) {
      todo.done = e.detail.value;
      store.saveTodo(todo);
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: var(--lumo-space-l);
      }
    `;
  }
}
