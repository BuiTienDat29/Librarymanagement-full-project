import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../../components/Layout';
import { Pagination, LoadingSpinner, StatusBadge, Alert, EmptyState, Modal } from '../../components';
import { bookService, categoryService } from '../../services';

export default function ManageBooks() {
  const [books, setBooks]     = useState([]);
  const [page, setPage]       = useState(0);
  const [total, setTotal]     = useState(0);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]         = useState({ type:'', text:'' });
  const [categories, setCategories] = useState([]);

  // Modals
  const [bookModal, setBookModal]   = useState(false);
  const [copyModal, setCopyModal]   = useState(false);
  const [copiesModal, setCopiesModal] = useState(false);
  const [editBook, setEditBook]     = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [copies, setCopies]         = useState([]);
  const [bookForm, setBookForm]     = useState(emptyBook());
  const [copyForm, setCopyForm]     = useState({ barcode:'', condition:'NEW' });

  function emptyBook() {
    return { title:'', isbn:'', author:'', publisher:'', publishedYear:'', categoryId:'', description:'', coverImageUrl:'' };
  }

  const flash = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type:'', text:'' }), 3500); };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await bookService.getAll({ keyword, page, size:12 });
      setBooks(r.data.content); setTotal(r.data.totalPages);
    } finally { setLoading(false); }
  }, [keyword, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { categoryService.getAll().then(r => setCategories(r.data)); }, []);

  const openAdd = () => { setEditBook(null); setBookForm(emptyBook()); setBookModal(true); };
  const openEdit = (b) => {
    setEditBook(b);
    setBookForm({ title:b.title, isbn:b.isbn||'', author:b.author, publisher:b.publisher||'',
      publishedYear:b.publishedYear||'', categoryId:b.categoryId||'',
      description:b.description||'', coverImageUrl:b.coverImageUrl||'' });
    setBookModal(true);
  };

  const handleBookSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...bookForm, publishedYear: bookForm.publishedYear||null, categoryId: bookForm.categoryId||null };
    try {
      if (editBook) await bookService.update(editBook.id, payload);
      else          await bookService.create(payload);
      flash('success', editBook ? 'Cập nhật sách thành công.' : 'Thêm sách thành công.');
      setBookModal(false); load();
    } catch (err) { flash('error', err.response?.data?.message || 'Lỗi.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa sách này? Chỉ xóa được nếu không có bản sao đang mượn.')) return;
    try { await bookService.delete(id); flash('success', 'Đã xóa sách.'); load(); }
    catch (err) { flash('error', err.response?.data?.message || 'Không thể xóa.'); }
  };

  const openCopies = async (book) => {
    setSelectedBook(book);
    const r = await bookService.getCopies(book.id);
    setCopies(r.data);
    setCopiesModal(true);
  };

  const openAddCopy = (book) => { setSelectedBook(book); setCopyForm({ barcode:'', condition:'NEW' }); setCopyModal(true); };

  const handleAddCopy = async (e) => {
    e.preventDefault();
    try {
      await bookService.addCopy(selectedBook.id, copyForm);
      flash('success', 'Đã thêm bản sao.');
      setCopyModal(false); load();
    } catch (err) { flash('error', err.response?.data?.message || 'Lỗi.'); }
  };

  return (
    <AdminLayout title="Quản lý sách" subtitle="Quản lý kho sách và bản sao">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <Alert type={msg.type} message={msg.text} />
        <button onClick={openAdd} className="btn btn-primary">+ Thêm sách</button>
      </div>

      <div className="flex gap-3 mb-4">
        <input className="input max-w-sm" placeholder="Tìm tên sách, tác giả, ISBN..."
          value={keyword} onChange={e => { setKeyword(e.target.value); setPage(0); }} />
      </div>

      {loading ? <LoadingSpinner /> : books.length === 0 ? (
        <EmptyState icon="📚" title="Không tìm thấy sách nào" />
      ) : (
        <>
          <div className="table-container">
            <table className="table-modern">
              <thead>
                <tr>{['Tên sách','Tác giả','ISBN','Danh mục','Tổng','Còn lại','Hành động'].map(h =>
                  <th key={h} className="whitespace-nowrap">{h}</th>
                )}</tr>
              </thead>
              <tbody>
                {books.map(b => (
                  <tr key={b.id}>
                    <td>
                      <p className="font-medium text-surface-900 dark:text-white max-w-xs truncate">{b.title}</p>
                      {b.publishedYear && <p className="text-xs text-surface-400">{b.publishedYear}</p>}
                    </td>
                    <td className="text-surface-600 dark:text-surface-400">{b.author}</td>
                    <td className="text-surface-400 font-mono text-xs">{b.isbn || '—'}</td>
                    <td className="text-surface-500">{b.categoryName || '—'}</td>
                    <td className="text-center font-medium">{b.totalCopies}</td>
                    <td className="text-center">
                      <span className={`font-medium ${b.availableCopies === 0 ? 'text-error' : 'text-success'}`}>
                        {b.availableCopies}
                      </span>
                    </td>
                    <td>
                      <div className="flex gap-2 flex-wrap">
                        <button onClick={() => openEdit(b)} className="text-primary-600 hover:text-primary-700 text-xs font-medium">Sửa</button>
                        <button onClick={() => openCopies(b)} className="text-accent-600 hover:text-accent-700 text-xs font-medium">Bản sao ({b.totalCopies})</button>
                        <button onClick={() => openAddCopy(b)} className="text-success hover:text-emerald-700 text-xs font-medium">+ Thêm bản</button>
                        <button onClick={() => handleDelete(b.id)} className="text-error hover:text-red-700 text-xs font-medium">Xóa</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={total} onPageChange={setPage} />
        </>
      )}

      {/* Add/Edit Book Modal */}
      <Modal open={bookModal} onClose={() => setBookModal(false)} title={editBook ? 'Sửa sách' : 'Thêm sách mới'}>
        <form onSubmit={handleBookSubmit} className="space-y-3">
          <div>
            <label className="label">Tên sách *</label>
            <input className="input" value={bookForm.title} onChange={e => setBookForm({...bookForm, title:e.target.value})} required />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Tác giả *</label>
              <input className="input" value={bookForm.author} onChange={e => setBookForm({...bookForm, author:e.target.value})} required />
            </div>
            <div>
              <label className="label">ISBN</label>
              <input className="input" value={bookForm.isbn} onChange={e => setBookForm({...bookForm, isbn:e.target.value})} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="label">Nhà xuất bản</label>
              <input className="input" value={bookForm.publisher} onChange={e => setBookForm({...bookForm, publisher:e.target.value})} />
            </div>
            <div>
              <label className="label">Năm xuất bản</label>
              <input type="number" className="input" value={bookForm.publishedYear} onChange={e => setBookForm({...bookForm, publishedYear:e.target.value})} />
            </div>
          </div>
          <div>
            <label className="label">Danh mục</label>
            <select className="input" value={bookForm.categoryId} onChange={e => setBookForm({...bookForm, categoryId:e.target.value})}>
              <option value="">— Chọn danh mục —</option>
              {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="label">Mô tả</label>
            <textarea className="input" rows={3} value={bookForm.description} onChange={e => setBookForm({...bookForm, description:e.target.value})} />
          </div>
          <div>
            <label className="label">URL ảnh bìa</label>
            <input className="input" value={bookForm.coverImageUrl} onChange={e => setBookForm({...bookForm, coverImageUrl:e.target.value})} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setBookModal(false)} className="btn btn-secondary">Hủy</button>
            <button type="submit" className="btn btn-primary">{editBook ? 'Lưu' : 'Thêm sách'}</button>
          </div>
        </form>
      </Modal>

      {/* Add Copy Modal */}
      <Modal open={copyModal} onClose={() => setCopyModal(false)} title={`Thêm bản sao — ${selectedBook?.title}`}>
        <form onSubmit={handleAddCopy} className="space-y-4">
          <div>
            <label className="label">Barcode *</label>
            <input className="input font-mono" placeholder="VD: LIB-2024-001"
              value={copyForm.barcode} onChange={e => setCopyForm({...copyForm, barcode:e.target.value})} required />
          </div>
          <div>
            <label className="label">Tình trạng</label>
            <select className="input" value={copyForm.condition} onChange={e => setCopyForm({...copyForm, condition:e.target.value})}>
              {['NEW','GOOD','DAMAGED'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setCopyModal(false)} className="btn btn-secondary">Hủy</button>
            <button type="submit" className="btn btn-primary">Thêm bản sao</button>
          </div>
        </form>
      </Modal>

      {/* View Copies Modal */}
      <Modal open={copiesModal} onClose={() => setCopiesModal(false)} title={`Bản sao — ${selectedBook?.title}`}>
        {copies.length === 0 ? (
          <p className="text-surface-500 text-sm text-center py-4">Chưa có bản sao nào.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-modern">
              <thead>
                <tr>{['Barcode','Tình trạng','Trạng thái'].map(h =>
                  <th key={h} className="whitespace-nowrap">{h}</th>
                )}</tr>
              </thead>
              <tbody>
                {copies.map(c => (
                  <tr key={c.id}>
                    <td className="font-mono text-xs">{c.barcode}</td>
                    <td className="text-surface-500">{c.condition}</td>
                    <td><StatusBadge status={c.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Modal>
    </AdminLayout>
  );
}