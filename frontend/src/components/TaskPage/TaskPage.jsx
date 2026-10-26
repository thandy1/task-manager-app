import { useState } from "react";
import TaskControls from "./TaskControls/TaskControls";
import TaskList from "./TaskList/TaskList";
import TaskFooter from "./TaskFooter/TaskFooter";
import "./TaskPage.css";

export default function TaskPage() {
    // NOTE: dummy data to test how the UI display on the DOM.
    // Will improve once React is connected to the Spring Boot API.
    const [tasks, setTasks] = useState([
        { id: 1, title: 'Design the header', description : "Create the TaskList and TaskItem components with badges, due dates, and hover actions.", status: 'DONE', priority: 'H', dueDate: null },
        { id: 2, title: 'Build task list', description : "Create the TaskList and TaskItem components with badges, due dates, and hover actions.", status: 'IN_PROGRESS', priority: 'M', dueDate: '2026-10-20' },
        { id: 3, title: 'Write modals', description : null, status: 'TODO', priority: 'L', dueDate: '2026-10-01' },
    ]);

    const [activeModal, setActiveModal] = useState(null);
    const [selectedTask, setSelectedTask] = useState(null);

    const [selectedFilters, setSelectedFilters] = useState([]);

    const filteredTasks = 
        selectedFilters.length === 0
            ? tasks
            : tasks.filter((task) => selectedFilters.includes(task.status));

    function openModal(type, task = null) {
        setActiveModal(type);
        setSelectedTask(task);
    }

    function closeModal() {
        setActiveModal(null);
        setSelectedTask(null);
    }

    return (
        <div className="task-page">
            <TaskControls 
                taskCount={tasks.length}
                selectedFilters={selectedFilters}
                onFilterChange={setSelectedFilters}
                onAddClick={() => openModal("add")}
                onClearAllClick={() => closeModal("clearAll")}
            />
            <TaskList 
                tasks={filteredTasks} 
                onEditTask={(task) => openModal("edit", task)}
                onDeleteTask={(task) => openModal("delete", task)}
            />
            <TaskFooter tasks={tasks} />
        </div>
    );

}


