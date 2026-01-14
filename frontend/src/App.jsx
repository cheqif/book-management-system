import { useState } from 'react';
import BookList from './components/BookList';
import AddBookForm from './components/AddBookForm';
import './styles/index.css';

function App() {
  const [showModal, setShowModal] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleBookAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div>
      <nav>
        <div className="container">
          <a href="#" className="nav-brand">
            📚 图书管理系统
          </a>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            ➕ 添加书籍
          </button>
        </div>
      </nav>

      <main key={refreshKey}>
        <BookList />
      </main>

      {showModal && (
        <div className="modal active">
          <div className="modal-content">
            <AddBookForm
              onBookAdded={handleBookAdded}
              onClose={() => setShowModal(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
