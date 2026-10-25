package com.taskmanager.backend;

import com.taskmanager.backend.controller.TaskController;
import com.taskmanager.backend.entity.Task;
import com.taskmanager.backend.entity.TaskPriority;
import com.taskmanager.backend.entity.TaskStatus;
import com.taskmanager.backend.service.TaskService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@WebMvcTest(TaskController.class)
public class TaskControllerGetByIdTest {
    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private TaskService taskService;

    // Functional: requesting an existing task id returns 200 with that task.
    @Test
    void getTaskById_withExistingId_returns200AndTask() throws Exception {
        Task task = new Task(
                "Buy groceries",
                "Milk and eggs",
                TaskStatus.TODO,
                TaskPriority.MEDIUM,
                null
        );
        task.setId(1L); // Set ID to random larger number
        when(taskService.getTaskById(1L)).thenReturn(task);

        mockMvc.perform(get("/api/tasks/{id}", 1L))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.title").value("Buy groceries"))
                .andExpect(jsonPath("$.status").value("TODO")
        );

        verify(taskService, times(1)).getTaskById(1L);
    }

    // NFR (security / input validation)
    // Threshold: each of the 6 malformed id values below must return HTTP 400
    // (100% rejection) and cause 0 calls to TaskService, proving bad path input
    // is stopped at the web layer before reaching business logic or the database.
    @ParameterizedTest
    @ValueSource(strings = {"abc", "1.5", "99999999999999999999", "null", "1e3", "-"})
    void getTaskById_withMalformedId_isRejectedBeforeReachingService(String badId) throws Exception {
        mockMvc.perform(get("/api/tasks/{id}", badId))
                .andExpect(status().isBadRequest()
        );
        verifyNoInteractions(taskService);
    }
}
