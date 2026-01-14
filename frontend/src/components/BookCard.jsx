import { useState } from 'react';
import { bookService } from '../services/api';

export default function BookCard({ book, onUpdate, onDelete }) {
  const [showActions, setShowActions] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleBorrow = async () => {
    setLoading(true);
    try {
      const result = await bookService.borrowBook(book.id);
      if (result.success) {
        onUpdate();
      }
    } catch (error) {
      console.error('借书失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReturn = async () => {
    setLoading(true);
    try {
      const result = await bookService.returnBook(book.id);
      if (result.success) {
        onUpdate();
      }
    } catch (error) {
      console.error('还书失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('确定要删除该书籍吗?')) {
      setLoading(true);
      try {
        const result = await bookService.deleteBook(book.id);
        if (result.success) {
          onDelete();
        }
      } catch (error) {
        console.error('删除失败:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  const getStatusColor = () => {
    switch (book.status) {
      case 'available':
        return 'status-available';
      case 'borrowed':
        return 'status-borrowed';
      case 'damaged':
        return 'status-damaged';
      default:
        return 'status-available';
    }
  };

  const getStatusText = () => {
    switch (book.status) {
      case 'available':
        return '可借用';
      case 'borrowed':
        return '已借出';
      case 'damaged':
        return '已损坏';
      default:
        return book.status;
    }
  };

  return (
    <div className="book-card">
      <div className="book-cover">
        {book.coverUrl ? (
          <img src={book.coverUrl} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📖</div>
            <div>{book.title}</div>
          </div>
        )}
      </div>
      <div className="book-info">
        <div className="book-title">{book.title}</div>
        <div className="book-author">作者: {book.author}</div>
        <div className="book-year">{book.publishYear}年出版</div>
        <div className={`status-badge ${getStatusColor()}`}>{getStatusText()}</div>
        <div className="book-price">¥{book.price.toFixed(2)}</div>
        <div className="book-actions">
          {book.status === 'available' && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={handleBorrow}
              disabled={loading}
            >
              📥 借书
            </button>
          )}
          {book.status === 'borrowed' && (
            <button
              className="btn btn-warning btn-sm"
              onClick={handleReturn}
              disabled={loading}
            >
              📤 还书
            </button>
          )}
          <button
            className="btn btn-danger btn-sm"
            onClick={handleDelete}
            disabled={loading}
          >
            🗑️ 删除
          </button>
        </div>
      </div>
    </div>
  );
}
