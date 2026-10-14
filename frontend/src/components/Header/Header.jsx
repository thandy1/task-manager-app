import { Bell, Settings, CheckSquare } from 'lucide-react';
import './Header.css';

export default function Header() {
    return(
        <header className="header">
            <div className="header-left">
                <CheckSquare size={24} color="#22c55e"></CheckSquare>
                <h1 className="header-title">Task Manager</h1>
            </div>

            <div className="header-right">
                <button className="icon-btn" aria-label="Notifications">
                    <Bell size={20} />
                    <span className="badge-dot"></span>
                </button>
                <button className="icon-btn" aria-label="Settings">
                    <Settings size={20} />
                </button>
            </div>
        </header>
    );
}
