import TaskStatusBadge from "./TaskStatusBadge";
import TaskPriorityBadge from "./TaskPriorityBadge";
import TaskActions from "./TaskActions";
import { isOverdue } from "../../../utils/dates";
import { truncate } from "../../../utils/text";
import "./TaskItem.css";

function formatDate(dueDate) {
    return new Date(dueDate + "T00:00:00").toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
    })
}

// The conditional render hides the date when task.dueDate is null which acts as
// an optional due date.
export default function TaskItem({ task }) {
    return (
        <li className="task-item">
            <div className="task-info">
                <span className="task-title">{task.title}</span>
                {task.description && (
                    <p className="task-description">{truncate(task.description, 50)}</p>
                )}
            </div>
            <div className="task-meta">
                <TaskStatusBadge status={task.status} />
                <TaskPriorityBadge priority={task.priority} />
                {task.dueDate && (
                    <span className={`task-due ${isOverdue(task.dueDate) ? "overdue" : ""}`}>{formatDate(task.dueDate)}</span>
                )}
            <TaskActions />
            </div>
        </li>

    );
}