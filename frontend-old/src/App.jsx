import Header from './components/Header/Header';
import TaskPage from './components/TaskPage/TaskPage';

export default function App() {
  return (
    <div className="app">
      <Header />
      <main style={{ paddingTop: "60px" }}> 
        <TaskPage />
      </main>
    </div>
  );
}

