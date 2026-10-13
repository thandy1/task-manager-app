import './App.css'
import Header from './components/Header/Header';
import TaskPage from './components/Header/TaskPage/TaskPage';

export default function App() {
  return (
    <div className="app">
      <Header />
      <main style={{ paddingTop: "60px" }}> {/* stops the fixed header from covering content*/}
        <TaskPage />
      </main>
    </div>
  );
}

