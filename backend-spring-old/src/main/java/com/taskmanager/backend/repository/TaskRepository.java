package com.taskmanager.backend.repository;

import com.taskmanager.backend.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Extends JpaRepository to get built-in database operations.
// Marks as a Repository component for database access.
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

}
