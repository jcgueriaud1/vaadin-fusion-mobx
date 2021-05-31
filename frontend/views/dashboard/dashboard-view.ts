import { customElement, html } from "lit-element";
import "@vaadin/vaadin-button";
import "@vaadin/vaadin-text-field";
import "@vaadin/vaadin-checkbox";
import "@vaadin/vaadin-progress-bar";
import "@vaadin/vaadin-ordered-layout/vaadin-horizontal-layout";
import Todo from "../../generated/com/example/application/Todo";
import {store} from "../../stores/store";
import {View} from "../../view";

@customElement("dashboard-view")
export class DashboardView extends View {

  render() {
    return html`
      <h1>Task Dashboard</h1>
      <div class="dashboard">
        <div class="dashboard__column">
            <div class="dashboard__column__title">TODO</div>
            <div id="todo" class="sort"
                 @drop="${ (e:DragEvent) => this.onDropAction(e, false)}"
                 @dragover="${ (e:DragEvent) => this.onDragOverAction(e)}">
          ${store.todos.filter(t => !t.done).map(
            (todo) => html`
              <div class="dashboard__column__task ${(todo.locked)?"sortable-chosen":""}" 
                   draggable="${!todo.locked}" 
                   @dragstart="${(e: DragEvent) => this.onDragAction(e, todo)}"
                   @dragend="${ (e:DragEvent) => this.onDragEndAction(e, todo)}">
                  ${todo.id}. ${todo.task}
              </div>
            `
          )}
            </div>
        </div>
  
        <div class="dashboard__column dashboard__column--complete">
            <div class="dashboard__column__title">DONE</div>
            <div id="done" class="sort" 
                 @drop="${ (e:DragEvent) => this.onDropAction(e, true)}"
                 @dragover="${ (e:DragEvent) => this.onDragOverAction(e)}"
            >
                ${store.todos.filter(t => t.done).map(
              (todo) => html`
              <div class="dashboard__column__task ${(todo.locked)?"sortable-chosen":""}"
                   draggable="${!todo.locked}"
                   @dragstart="${(e: DragEvent) => this.onDragAction(e, todo)}"
                   @dragend="${ (e:DragEvent) => this.onDragEndAction(e, todo)}">
                  ${todo.id}. ${todo.task}
              </div>
            `
          )}</div>
        </div>
      </div>
    `;
  }

    private onDragAction(event: DragEvent, todo: Todo) {
      if (event.dataTransfer && event.target && event.currentTarget) {
          event.dataTransfer
              .setData('text/plain', String(todo.id));

          if (todo) {
              todo.locked = true;
              store.saveTodo(todo);
          }
      }
    }

    private onDragEndAction(event: DragEvent, todo: Todo) {
        if (event.dataTransfer && event.target && event.currentTarget) {
            if (todo) {
                todo.locked = false;
                store.saveTodo(todo);
            }
        }
    }

    private onDragOverAction(event: DragEvent) {
        event.preventDefault();
    }
    private onDropAction(event:DragEvent, done:boolean) {
        debugger;
        if (event.dataTransfer && event.target && event.currentTarget) {
            const id = parseInt(event
                .dataTransfer
                .getData('text'));
            event.dataTransfer
                .clearData();
            if (id) {
                const todo = store.todos.find(t => (t.id == id));
                if (todo) {
                    todo.done = done;
                    todo.locked = false;
                    store.saveTodo(todo);
                }
            }
        }
    }
    updateTodoStatus(todo: Todo, e: CustomEvent) {
    if (todo.done !== e.detail.value) {
      todo.done = e.detail.value;
      store.saveTodo(todo);
    }
  }


}
