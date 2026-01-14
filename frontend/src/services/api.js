import axios from 'axios';

const API_BASE_URL = '/api/books';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

export const bookService = {
  // 获取所有书籍
  getAllBooks: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: '获取书籍列表失败' };
    }
  },

  // 获取单本书籍
  getBookById: async (id) => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: '获取书籍信息失败' };
    }
  },

  // 搜索书籍
  searchBooks: async (keyword) => {
    try {
      const response = await api.get('/search', {
        params: { keyword },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: '搜索书籍失败' };
    }
  },

  // 按状态获取书籍
  getBooksByStatus: async (status) => {
    try {
      const response = await api.get(`/status/${status}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: '获取书籍失败' };
    }
  },

  // 创建书籍
  createBook: async (bookData) => {
    try {
      const response = await api.post('/', bookData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: '创建书籍失败' };
    }
  },

  // 更新书籍
  updateBook: async (id, bookData) => {
    try {
      const response = await api.put(`/${id}`, bookData);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: '更新书籍失败' };
    }
  },

  // 删除书籍
  deleteBook: async (id) => {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: '删除书籍失败' };
    }
  },

  // 借书
  borrowBook: async (id) => {
    try {
      const response = await api.post(`/${id}/borrow`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: '借书失败' };
    }
  },

  // 还书
  returnBook: async (id) => {
    try {
      const response = await api.post(`/${id}/return`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { success: false, message: '还书失败' };
    }
  },
};

export default api;
