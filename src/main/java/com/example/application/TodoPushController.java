package com.example.application;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
public class TodoPushController {

  @MessageMapping("/topic-websocket")
  @SendTo("/topic/todos")
  public Todo newTodo(Todo todo) {
    return todo;
  }

}