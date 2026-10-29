import { Plus } from "lucide-react";
import ViewToggle from "./ViewToggle";
import FilterDropdown from "./FilterDropdown";
import "./TaskControls.css";

export default function TaskControls({ taskCount, selectedFilters, onFilterChange, onAddClick, onClearAllClick }) {
    return (
        <div className="task-controls">
            <div className="controls-left">
                <h2>All Tasks</h2>
                <span className="count-badge">{taskCount}</span>
            </div>

            <div className="controls-left">
                <FilterDropdown selected={selectedFilters} onChange={onFilterChange}/>
                <ViewToggle />
                <button className="btn btn-red-outline" onClick={onClearAllClick} disabled={taskCount === 0}>
                    Clear All
                </button>
                <button className="btn btn-green" onClick={onAddClick}>
                    <Plus size={16} /> Add
                </button>
            </div>
        </div>
    );
}