import { useState } from "react";
import { ChevronDown } from "lucide-react";

const VIEWS = ["Table", "Kanban", "Calendar", "Card"];

export default function ViewToggle() {
    const [view, setView] = useState("Table");
    const [isOpen, setIsOpen] = useState(false);

    function chooseView(name) {
        setView(name);
        setIsOpen(false);
    }

    return (
        <div className="dropdown">
            <button className="btn" onClick={() => setIsOpen(!isOpen)}>
                {view} <ChevronDown size={16} />
            </button>

            {isOpen && (
                <ul className="dropdown-menu">
                    {VIEWS.map((name) => (
                        <li key={name}>
                            <button onClick={() => chooseView(name)}>{name}</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
