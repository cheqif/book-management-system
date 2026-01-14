import { useState } from 'react';
import { bookService } from '../services/api';

export default function AddBookForm({ onBookAdded, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    description: '',
    publishYear: new Date().getFullYear(),
    isbn: '',
    price: '',
    status: 'available',
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'publishYear' ? Number(value) : value,
    });
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = '标题不能为空';
    if (!formData.author.trim()) newErrors.author = '作者不能为空';
    if (!formData.isbn.trim()) newErrors.isbn = 'ISBN不能为空';
    if (!formData.price || formData.price <= 0) newErrors.price = '价格必须大于0';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      const result = await bookService.createBook(formData);
      if (result.success) {
        setMessage({ type: 'success', text: '书籍添加成功!' });
        setFormData({
          title: '',
          author: '',
          description: '',
          publishYear: new Date().getFullYear(),
          isbn: '',
          price: '',
          status: 'available',
        });
        setTimeout(() => {
          onBookAdded();
          onClose();
        }, 1000);
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message || '添加失败,请检查输入' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="modal-header">
        <h2 className="modal-title">添加新书籍</h2>
        <button type="button" className="modal-close" onClick={onClose}>
          ×
        </button>
      </div>

      {message && <div className={`alert alert-${message.type}`}>{message.text}</div>}

      <div className="form-group">
        <label htmlFor="title">书籍标题 *</label>
        <input
          type="text"
          id="title"
          name="title"
          className="form-control"
          value={formData.title}
          onChange={handleChange}
          placeholder="输入书籍标题"
        />
        {errors.title && <span style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.title}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="author">作者 *</label>
        <input
          type="text"
          id="author"
          name="author"
          className="form-control"
          value={formData.author}
          onChange={handleChange}
          placeholder="输入作者名字"
        />
        {errors.author && <span style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.author}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="description">描述</label>
        <textarea
          id="description"
          name="description"
          className="form-control"
          value={formData.description}
          onChange={handleChange}
          placeholder="输入书籍描述"
        ></textarea>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div className="form-group">
          <label htmlFor="publishYear">出版年份</label>
          <input
            type="number"
            id="publishYear"
            name="publishYear"
            className="form-control"
            value={formData.publishYear}
            onChange={handleChange}
            min="1900"
            max={new Date().getFullYear()}
          />
        </div>

        <div className="form-group">
          <label htmlFor="price">价格 *</label>
          <input
            type="number"
            id="price"
            name="price"
            className="form-control"
            value={formData.price}
            onChange={handleChange}
            placeholder="输入价格"
            step="0.01"
            min="0"
          />
          {errors.price && <span style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.price}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="isbn">ISBN *</label>
        <input
          type="text"
          id="isbn"
          name="isbn"
          className="form-control"
          value={formData.isbn}
          onChange={handleChange}
          placeholder="输入ISBN"
        />
        {errors.isbn && <span style={{ color: 'var(--danger)', fontSize: '0.85rem', marginTop: '0.25rem' }}>{errors.isbn}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="status">状态</label>
        <select name="status" id="status" className="form-control" value={formData.status} onChange={handleChange}>
          <option value="available">可借用</option>
          <option value="borrowed">已借出</option>
          <option value="damaged">已损坏</option>
        </select>
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
          取消
        </button>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '添加中...' : '添加书籍'}
        </button>
      </div>
    </form>
  );
}
