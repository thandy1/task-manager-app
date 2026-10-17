package com.taskmanager.backend;

import com.taskmanager.backend.controller.TaskController;
import com.taskmanager.backend.service.TaskService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static  org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// The annotation starts a slice of the Spring context containing only the web layer,
// limited to this controller. It loads: TaskController itself, Spring MVC infrastructure,
// and MockMvc.
@WebMvcTest(TaskController.class) // Builds mini-app with just the controller
public class TaskControllerValidationTest {
    // A small helper to remove duplicate `mockMvc.perform(post(...)...) block`.
    private ResultActions postTask(String json) throws Exception {
        // Simulates a post request and expects a 400 response.
        return mockMvc.perform(post("/api/tasks")
                .contentType(MediaType.APPLICATION_JSON)
                .content(json));
    }

    // Field injection of a testing class, JUnit creates the test instance then Spring injects the
    // bean into the field at runtime.
    @Autowired
    // MockMvc is a testing class that simulates HTTP request and responses, enabling
    // the testing of controller logic in isolation without starting up a full http server.
    private MockMvc mockMvc; // Fake HTTP Client

    // Replaces Spring's real bean with a Mockito mock; it does not inject
    // the real service implementation. Need to stub it for specific behavior.
    @MockitoBean // fills one dependency the controller needs.
    private TaskService taskService;

    @Test
    void createTask_withBlankTitle_returns400() throws Exception {
        String json = """
               {
                   "title": "   ",
                   "description": null,
                   "status": "TODO",
                   "priority": "MEDIUM",
                   "dueDate": null
               }
               """;
        // .andExpect is an assertion method in Spring's testing framework to define
        // expectations for the results of a request
        postTask(json).andExpect(status().isBadRequest());
   }

   @Test
    void createTask_missingPriority_returns400() throws Exception {
        String json = """
            {
              "title": "Buy groceries",
              "description": null,
              "status": "TODO",
              "priority": null,
              "dueDate": null
            }
            """;
        postTask(json).andExpect(status().isBadRequest());
   }

   @Test
    void createTask_withTitleOver255Characters_returns400() throws Exception {
        String json = """
            {
              "title": "%s",
              "description": null,
              "status": "TODO",
              "priority": "MEDIUM",
              "dueDate": null
            }
            """.formatted("A".repeat(256));
        postTask(json).andExpect(status().isBadRequest());
   }
}
