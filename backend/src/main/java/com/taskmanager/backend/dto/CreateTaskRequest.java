package com.taskmanager.backend.dto;

import jakarta.validation.constraints.NotBlank;
import com.taskmanager.backend.entity.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

// record is a special kind of class, it tells the compiler to generate private
// fields for each component, a constructor taking them all of them,
// accessor methods named after the field (e.g. request.title() not getTitle()),
// equals, hashCode, and toString.
public record CreateTaskRequest(
   @NotBlank String title,
   String description,
   TaskStatus status,
   @NotNull TaskPriority priority,
   LocalDate dueDate
) {}