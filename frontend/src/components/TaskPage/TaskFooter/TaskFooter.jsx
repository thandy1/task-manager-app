import "./TaskFooter.css";
import { isOverdue } from "../../../utils/dates";


export default function TaskFooter({ tasks }) {
    // If their are no tasks, returns null to hide the footer.
    if (tasks.length == 0) {
        return null;
    }
    const total = tasks.length;
    const active = tasks.filter((task) => task.status === "IN_PROGRESS").length;
    const completed = tasks.filter((task) => task.status === "DONE").length;
    const overdue = tasks.filter((task) => task.dueDate && task.status !== "DONE" && isOverdue(task.dueDate)).length;
    return (
        <footer className="task-footer">
            <span>
                {total} {total === 1 ? "task" : "tasks"} · {active} active · {completed} completed
            </span>
            <span>
                {overdue} overdue {overdue === 1 ? "task" : "tasks"}
            </span>
        </footer>
    );
}