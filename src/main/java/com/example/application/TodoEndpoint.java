package com.example.application;

import java.util.List;

import com.vaadin.flow.server.connect.Endpoint;
import com.vaadin.flow.server.connect.auth.AnonymousAllowed;

import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessagingTemplate;

@Endpoint
@AnonymousAllowed
@RequiredArgsConstructor
public class TodoEndpoint {
  private final TodoRepository repo;
  private final SimpMessagingTemplate simpMessagingTemplate;

  public List<Todo> getTodos() {
    return repo.findAll();
  }

  public Todo saveTodo(Todo todo) {
    Todo save = repo.save(todo);
    pushTodo(save);
    return save;
  }

  private void pushTodo(Todo todo) {
    simpMessagingTemplate.convertAndSend("/topic/todos", todo);
  }
}
