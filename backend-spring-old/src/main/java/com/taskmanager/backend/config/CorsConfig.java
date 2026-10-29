package com.taskmanager.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

// Configuration class to configure CORS default browser security features that block request from one origin to another.
// Here we configure CORS to allow React to call Spring Boot API between their respective ports.
@Configuration
public class CorsConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        // Anonymous class to create a one-off implementation of the interface WebMvcConfigurer.
        // I don't need to define a separate named class.
        // Create an object that implements this interface, an implement the methods I care about.
        return new WebMvcConfigurer() {
            @Override
            // Callback method that gets called by Spring MVC automatically during application startup.
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/app/**") // allow all api endpoints
                        .allowedOrigins("http://localhost:5173") // only allow request from React's port
                        .allowedMethods("GET", "POST", "PUT", "DELETE")
                        .allowedHeaders("*"); // allow any request headers
            }
        };
    }
}
