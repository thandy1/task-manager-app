// API version constants for the testing environment.
// Switch when a version migration occurs in the application.
export const API_PREFIX = "/api/v1";
export const TASKS_URL = `${API_PREFIX}/tasks`;
export const taskUrl = (id: string | number) => `${TASKS_URL}/${id}`;