import { useState, useEffect } from 'react';
import { bookService } from '../services/api';
import BookCard from './BookCard';

export default function BookList() {
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [alert, setAlert] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const result = await bookService.getAllBooks();
      if (result.success) {
        setBooks(result.data);
        setFilteredBooks(result.data);
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: error.message || '加载书籍失败',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchKeyword.trim()) {
      setFilteredBooks(books);
      return;
    }

    setLoading(true);
    try {
      const result = await bookService.searchBooks(searchKeyword);
      if (result.success) {
        setFilteredBooks(result.data);
      }
    } catch (error) {
      setAlert({
        type: 'error',
        message: '搜索失败',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    if (status === 'all') {
      setFilteredBooks(books);
    } else {
      setFilteredBooks(books.filter((book) => book.status === status));
    }
  };

  const handleBookUpdate = () => {
    fetchBooks();
    setAlert({
      type: 'success',
      message: '操作成功',
    });
  };

  const handleBookDelete = () => {
    fetchBooks();
    setAlert({
      type: 'success',
      message: '书籍已删除',
    });
  };

  return (
    <div className="container">
      {alert && (
        <div className={`alert alert-${alert.type}`}>
          {alert.message}
        </div>
      )}

      <div className="search-container">
        <form style={{ display: 'flex', width: '100%', gap: '1rem' }} onSubmit={handleSearch}>
          <input
            type="text"
            className="search-input"
            placeholder="搜索书籍标题或作者..."
            value={searchKeyword}
            onChange={(e) => setSearchKeyword(e.target.value)}
          />
          <button type="submit" className="btn btn-primary">
            搜索
          </button>
        </form>
      </div>

      <div style={{ marginBottom: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <button
          className={`btn ${statusFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleStatusFilter('all')}
        >
          全部 ({books.length})
        </button>
        <button
          className={`btn ${statusFilter === 'available' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleStatusFilter('available')}
        >
          可借 ({books.filter((b) => b.status === 'available').length})
        </button>
        <button
          className={`btn ${statusFilter === 'borrowed' ? 'btn-primary' : 'btn-secondary'}`}
          onClick={() => handleStatusFilter('borrowed')}
        >
          已借 ({books.filter((b) => b.status === 'borrowed').length})
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <div className="loading" style={{ display: 'inline-block' }}></div>
        </div>
      ) : filteredBooks.length > 0 ? (
        <div className="books-grid">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onUpdate={handleBookUpdate}
              onDelete={handleBookDelete}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <p className="empty-state-text">暂无书籍</p>
        </div>
      )}
    </div>
  );
}
