import { useState } from "react";
import { Filter } from "lucide-react";
import "./FilterDropdown.css";

// Available filter options. Each has a stable value for application
// logic and a separate label for display.
const FILTERS = [
    { value: "TODO", label: "Todo" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "DONE", label: "Done" },
];

export default function FilterDropdown() {
    const [isOpen, setIsOpen] = useState(false);
    // Stores the values of all currently selected filters.
    const [selected, setSelected] = useState([]); 

    function toggleFilter(value) {
        // Remove the filter if selected; otherwise, add it.
        if (selected.includes(value)) {
            setSelected(selected.filter((item) => item !== value))
        } else {
            setSelected([...selected, value])
        }
    }

    return (
        <div className="dropdown">
            <button className="btn" onClick={() => setIsOpen(!isOpen)}>
                <Filter size={16} /> Filter
                {selected.length > 0 && (
                    <span className="filter-count">{selected.length}</span>
                )}
            </button>

            {isOpen && (
                <ul className="dropdown-menu">
                    {FILTERS.map((filter) => (
                        <li key={filter.value}>
                            <label className="filter-options">
                                <input 
                                    type="checkbox" 
                                    checked={selected.includes(filter.value)}
                                    onChange={() => toggleFilter(filter.value)}/>
                                {filter.label}
                            </label>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}