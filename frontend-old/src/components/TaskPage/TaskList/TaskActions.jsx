import { Pencil, Trash2 } from "lucide-react";

export default function TaskActions({ onEdit, onDelete }) {
    return (
        <div className="task-actions">
            <button className="action-btn action-edit" aria-label="Edit task" onClick={onEdit}>
                <Pencil size={14} />
            </button>
            <button className="action-btn action-delete" aria-label="Delete task" onClick={onDelete}>
                <Trash2 size={14} />
            </button>
        </div>
    );
}