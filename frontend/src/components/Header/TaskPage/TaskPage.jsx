import { useState } from "react";
import TaskControls from "./TaskControls/TaskControls";
import "./TaskPage.css";

export default function TaskPage() {
    // NOTE: dummy data to test how the UI display on the DOM.
    // Will improve once React is connected to the Spring Boot API.
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Design the header', status: 'DONE', priority: 'H', dueDate: null },
        { id: 2, title: 'Build task list', status: 'IN_PROGRESS', priority: 'M', dueDate: '2026-10-20' },
        { id: 3, title: 'Write modals', status: 'TODO', priority: 'L', dueDate: '2026-10-01' },
    ]);

    return (
        <div className="task-page">
            <TaskControls taskCount={tasks.length} />
        </div>
    );

}


