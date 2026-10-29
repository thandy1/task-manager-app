import { useState } from "react";
import Modal from "../Modal/Modal";

// Props: onSave (receives the new task's fields), onCancel (closes the modal).
export default function AddTaskModal({ onSave, onCancel }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("TODO");
    const [priority, setPriority] = useState("M");
    const [dueDate, setDueDate] = useState("");

    function handleSubmit(e) {
        e.preventDefault();
        onSave({
            title: title.trim(),
            description: description.trim() || null,
            status,
            priority,
            dueDate: dueDate || null,
        });
    }

    return (
        <Modal title="Add task" onClose={onCancel}>
            <form onSubmit={handleSubmit}>
                <div className="form-field">
                    <label htmlFor="task-title">Title</label>
                    <input
                        id="task-title"
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        autoFocus
                    />
                </div>

                <div className="form-field">
                    <label htmlFor="task-description">Description</label>
                    <textarea
                        id="task-description"
                        rows={3}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>

                <div className="form-row">
                    <div className="form-field">
                        <label htmlFor="task-status">Status</label>
                        <select
                            id="task-status"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="TODO">Todo</option>
                            <option value="IN_PROGRESS">In progress</option>
                            <option value="DONE">Done</option>
                        </select>
                    </div>

                    <div className="form-field">
                        <label htmlFor="task-priority">Priority</label>
                        <select
                            id="task-priority"
                            value={priority}
                            onChange={(e) => setPriority(e.target.value)}
                        >
                            <option value="L">Low</option>
                            <option value="M">Medium</option>
                            <option value="H">High</option>
                        </select>
                    </div>
                </div>

                <div className="form-field">
                    <label htmlFor="task-due">Due date (optional)</label>
                    <input
                        id="task-due"
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                </div>

                <div className="modal-actions">
                    <button type="button" className="btn" onClick={onCancel}>Cancel</button>
                    <button type="submit" className="btn btn-green" disabled={title.trim() === ""}>
                        Add task
                    </button>
                </div>
            </form>
        </Modal>
    );
}