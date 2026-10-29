const STATUS_LABELS = {
    TODO: "TODO",
    IN_PROGRESS: "IN PROGRESS",
    DONE: "DONE",
};

export default function TaskStatusBadge({ status }) {
    return (
        <span className={`status-badge status-${status.toLocaleLowerCase()}`}>
            {STATUS_LABELS[status]}
        </span>
    );
}