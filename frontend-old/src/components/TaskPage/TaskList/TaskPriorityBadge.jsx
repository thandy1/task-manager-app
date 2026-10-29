export default function TaskPriorityBadge({ priority }) {
    return (
        <span className={`priority-badge priority-${priority.toLowerCase()}`}>
            {priority}
        </span>
    );
}