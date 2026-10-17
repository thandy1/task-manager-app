package com.taskmanager.backend.controller;

import com.taskmanager.backend.dto.CreateTaskRequest;
import com.taskmanager.backend.entity.Task;
import com.taskmanager.backend.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// Marks this as a REST controller component, combines @Controller and @ReponseBody.
@RestController
// All endpoints in this class are prefixed with /api/tasks base path.
@RequestMapping("/api/tasks")
public class TaskController {
    private final TaskService taskService;

    // Spring inject TaskService here
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // GET /api/tasks - retrieve all tasks
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks() {
        return ResponseEntity.ok(taskService.getAllTasks());
    }

    // GET /api/tasks/{id} - retrieve a single task
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTaskById(@PathVariable Long id) {
        return ResponseEntity.ok(taskService.getTaskById(id));
    }

    // POST /api/tasks - create a new task
    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody CreateTaskRequest request) {
        // @Valid tells spring to validate the incoming request object first befoe creating the Task object
        Task task = new Task(request.title(), request.description(), request.status(),
                request.priority(), request.dueDate());
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.createTask(task));
    }

    // PUT /api/tasks/{id} - update an existing task
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(@PathVariable Long id, @RequestBody Task task) {
        return ResponseEntity.ok(taskService.updateTask(id, task));
    }

    // DELETE /api/task/{id} - delete a task
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();
    }

    // DELETE /api/tasks - delete all tasks
    @DeleteMapping
    public ResponseEntity<Void> deleteAllTasks() {
        taskService.deleteAllTasks();
        return ResponseEntity.noContent().build();
    }
}