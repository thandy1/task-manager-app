import { Pencil, Trash2 } from "lucide-react";

export default function TaskActions() {
    return (
        <div className="task-actions">
            <button className="action-btn action-edit" aria-label="Edit task">
                <Pencil size={14} />
            </button>
            <button className="action-btn action-delete" aria-label="Delete task">
                <Trash2 size={14} />
            </button>
        </div>
    );
}