import { ClipboardList } from "lucide-react";
import "./TaskList.css";

export default function EmptyState() {
    return (
        <div className="empty-state">
            <ClipboardList size={48} />
            <p>No Tasks yet. Click Add to get started.</p>
        </div>
    );
}