import { makeAutoObservable } from "mobx";
import Todo from "./generated/com/example/application/Todo";
import * as endpoint from "./generated/TodoEndpoint";

import {CompatClient, Stomp} from "@stomp/stompjs";
import * as SockJS from "sockjs-client";

class Store {
  todos: Todo[] = [];
  socket?: WebSocket;
  stompClient?: CompatClient;
  constructor() {
    makeAutoObservable(this);
    this.init();
    this.connectSockJs();
  }

  async init() {
    this.setTodos(await endpoint.getTodos());
  }

  private connectSockJs() {
    console.log('Store connectSockJs');
    this.socket = new SockJS('/topic-websocket');
    this.stompClient = Stomp.over(this.socket);
    const stompClient = this.stompClient;
    this.stompClient.connect({}, () =>
        stompClient.subscribe('/topic/todos', (messageOutput) => {
          // new item
          console.log('Store showMessageOutput: ' + JSON.parse(messageOutput.body));
          this.mergeTodo(JSON.parse(messageOutput.body) as Todo);
        }));
  }


  setTodos(todos: Todo[]) {
    this.todos = todos;
  }

  async saveTodo(todo: Todo) {
    /*const saved =*/ await endpoint.saveTodo(todo);
    /*if (todo.id === 0) {
      this.addTodo(saved);
    } else {
      this.updateTodo(saved);
    }*/
    // you can also push from the client
    /*if (this.stompClient) {
      this.stompClient!.send("/app/topic-websocket", {},
          JSON.stringify(saved));
    }*/
  }

  private addTodo(todo: Todo) {
    this.todos = [...this.todos, todo];
  }

  private updateTodo(updated: Todo) {
    this.todos = this.todos.map((todo) =>
      updated.id === todo.id ? updated : todo
    );
  }

  private mergeTodo(updated: Todo) {
    if (this.todos.findIndex((todo) => updated.id === todo.id) > -1) {
      this.updateTodo(updated);
    } else {
      this.addTodo(updated);
    }
  }

  get completedTodosCount() {
    return this.todos.filter((t) => t.done).length;
  }

  get totalTodosCount() {
    return this.todos.length;
  }

  get progress() {
    return this.completedTodosCount / this.totalTodosCount;
  }
}

export const store = new Store();
