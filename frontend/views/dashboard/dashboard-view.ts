import {css, customElement, html} from "lit-element";
import { MobxLitElement } from "@adobe/lit-mobx";
import "@vaadin/vaadin-button";
import "@vaadin/vaadin-text-field";
import "@vaadin/vaadin-checkbox";
import "@vaadin/vaadin-progress-bar";
import "@vaadin/vaadin-ordered-layout/vaadin-horizontal-layout";
import Todo from "../../generated/com/example/application/Todo";
import { store } from "../../store";

@customElement("dashboard-view")
export class dashboardView extends MobxLitElement {

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

  static get styles() {
    return css`
      :host {
        display: block;
        padding: var(--lumo-space-l);
      }
      
      .dashboard {
    background-color: var(--lumo-tint-40pct);
    display: grid;
    grid-template-columns: 1fr 1fr;
    column-gap: var(--lumo-space-m);
    row-gap: var(--lumo-space-m);
    height: 100%;
}

.dashboard__column {
    height: 100%;
    background-color: var(--lumo-primary-color-10pct);
    border-radius: var(--lumo-space-xs);
    box-shadow: var(--lumo-box-shadow-s);
    margin:var(--lumo-space-m);
}


.dashboard__column__title {
    background-color: var(--lumo-primary-color);
    color: var(--lumo-primary-contrast-color);
    border-radius: var(--lumo-space-xs) var(--lumo-space-xs) 0 0;
    padding: var(--lumo-space-s);
}

.dashboard__column--inprogress .dashboard__column__title {
    background-color: var(--lumo-secondary-text-color);
}

.dashboard__column--complete .dashboard__column__title {
    background-color: var(--lumo-success-color);
}

.dashboard__column__task {
    background-color: var(--lumo-primary-contrast-color);
    padding: var(--lumo-space-s);
    margin: var(--lumo-space-s);
    border-radius: var(--lumo-space-xs);
    box-shadow: var(--lumo-box-shadow-s);
}

.dashboard__column__task__title {
    font-weight: bold;
}

.dashboard__column__task__description {
    color: var(--lumo-contrast-70pct);
    padding-top: var(--lumo-space-s);
    font-style: italic;
}

.ignore-elements {
    font-style: italic;
    opacity: 80%;
}

.sortable-ghost {
    opacity:70%;
}

.sortable-chosen {
    background-color: #919191;
}

.sortable-drag {
    background-color:gray;
    opacity:50%;
}
.sort {
   height: 100%;
}
    `;
  }

}
