import api from './api';

export const bookService = {
  getAll:   (params) => api.get('/books', { params }),
  getById:  (id)     => api.get(`/books/${id}`),
  create:   (data)   => api.post('/books', data),
  update:   (id, d)  => api.put(`/books/${id}`, d),
  delete:   (id)     => api.delete(`/books/${id}`),
  getCopies:(id)     => api.get(`/books/${id}/copies`),
  addCopy:  (id, d)  => api.post(`/books/${id}/copies`, d),
  updateCopyStatus: (copyId, status) => api.put(`/books/copies/${copyId}/status?status=${status}`),
};

export const categoryService = {
  getAll:  ()       => api.get('/categories'),
  create:  (data)   => api.post('/categories', data),
  update:  (id, d)  => api.put(`/categories/${id}`, d),
  delete:  (id)     => api.delete(`/categories/${id}`),
};

export const borrowService = {
  borrow:      (data)   => api.post('/borrow', data),
  returnBook:  (id)     => api.put(`/borrow/${id}/return`),
  myHistory:   (params) => api.get('/borrow/my-history', { params }),
  active:      (params) => api.get('/borrow/active', { params }),
  overdue:     (params) => api.get('/borrow/overdue', { params }),
  getById:     (id)     => api.get(`/borrow/${id}`),
};

export const fineService = {
  myFines: (params) => api.get('/fines/my-fines', { params }),
  getAll:  (params) => api.get('/fines', { params }),
  pay:     (id)     => api.put(`/fines/${id}/pay`),
  waive:   (id)     => api.put(`/fines/${id}/waive`),
};

export const reservationService = {
  reserve:  (data)   => api.post('/reservations', data),
  cancel:   (id)     => api.delete(`/reservations/${id}`),
  my:       (params) => api.get('/reservations/my', { params }),
  getAll:   (params) => api.get('/reservations', { params }),
};

export const userService = {
  getProfile:    ()       => api.get('/users/profile'),
  updateProfile: (data)   => api.put('/users/profile', data),
  getAll:        (params) => api.get('/users', { params }),
  getById:       (id)     => api.get(`/users/${id}`),
  update:        (id, d)  => api.put(`/users/${id}`, d),
  deactivate:    (id)     => api.delete(`/users/${id}`),
};

export const reportService = {
  summary:      ()           => api.get('/reports/summary'),
  borrowStats:  (from, to)   => api.get('/reports/borrow-stats', { params: { from, to } }),
  popularBooks: (limit = 10) => api.get('/reports/popular-books', { params: { limit } }),
};
