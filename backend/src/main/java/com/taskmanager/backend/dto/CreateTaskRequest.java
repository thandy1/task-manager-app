package com.taskmanager.backend.dto;

import jakarta.validation.constraints.NotBlank;
import com.taskmanager.backend.entity.*;
import java.time.LocalDate;

public record CreateTaskRequest(
   @NotBlank String title,
   String description,
   TaskStatus status,
   TaskPriority priority,
   LocalDate dueDate
) {}