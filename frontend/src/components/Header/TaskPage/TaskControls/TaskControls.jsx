import { Filter, Plus } from "lucide-react";
import ViewToggle from "./ViewToggle";
import FilterDropdown from "./FilterDropdown";
import "./TaskControls.css";

export default function TaskControls({ taskCount }) {
    return (
        <div className="task-controls">
            <div className="controls-left">
                <h2>All Tasks</h2>
                <span className="count-badge">{taskCount}</span>
            </div>

            <div className="controls-left">
                <FilterDropdown />
                <ViewToggle />
                <button className="btn btn-red-outline">Clear All</button>
                <button className="btn btn-green">
                    <Plus size={16} /> Add
                </button>
            </div>
        </div>
    );
}