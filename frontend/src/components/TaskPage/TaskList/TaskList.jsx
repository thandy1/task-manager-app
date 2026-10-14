import TaskItem from "./TaskItem";
import EmptyState from "./EmptyState";
import "./TaskList.css";

export default function TaskList({ tasks }) {
    // Return EmptyState display when there's no tasks to show.
    if (tasks.length == 0) {
        return <EmptyState />;
    }

    return (
        <ul className="task-list">
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}
        </ul>
    );
}