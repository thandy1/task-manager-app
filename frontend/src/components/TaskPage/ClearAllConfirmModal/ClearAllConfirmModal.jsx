import Modal from "../Modal/Modal";

export default function ClearAllConfirmModal({ taskCount, onConfirm, onCancel }) {
    return (
        <Modal title="Clear All Tasks" onClose={onCancel}>
            <p>
                This will permanently delete all <strong>{taskCount}</strong> tasks. This cant be undone.
            </p>
            <div className="modal-actions">
                <button className="btn" onClick={onCancel}>Cancel</button>
                <button className="btn btn-red" onClick={onConfirm}>Clear All</button>
            </div>
        </Modal>
    );
}