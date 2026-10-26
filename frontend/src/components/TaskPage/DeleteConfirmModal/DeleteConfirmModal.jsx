import Modal from "../Modal/Modal";

// This component holds no state. It receives the task to show and two callbacks, 
// and it reports which button was pressed. 
// The decision about what to do lives in TaskPage.
export default function DeleteConfirmModal({ task, onConfirm, onCancel }) {
    return (
        <Modal title="Delete Task" onClose={onCancel}>
            <p>
                Are you sure you wan to delete <strong>{task.title}</strong>? This can't be undone.
            </p>
            <div className="modal-actions">
                <button className="btn" onClick={onCancel}>Cancel</button>
                <button className="btn btn-red" onClick={onConfirm}>Delete</button>
            </div>
        </Modal>
    );
}