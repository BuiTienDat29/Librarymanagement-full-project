import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Pagination, LoadingSpinner, EmptyState } from '../components';
import { bookService, categoryService } from '../services';

function BookCard({ book }) {
  return (
    <Link to={`/books/${book.id}`}
      className="bg-white rounded-xl border border-gray-200 hover:shadow-md hover:border-blue-300 transition-all overflow-hidden flex flex-col">
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 h-40 flex items-center justify-center">
        {book.coverImageUrl
          ? <img src={book.coverImageUrl} alt={book.title} className="h-full w-full object-cover" />
          : <span className="text-5xl">📖</span>}
      </div>
      <div className="p-4 flex flex-col flex-1">
        <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{book.title}</p>
        <p className="text-gray-500 text-xs mt-1">{book.author}</p>
        {book.categoryName && (
          <span className="mt-2 text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full w-fit">{book.categoryName}</span>
        )}
        <div className="mt-auto pt-3 flex items-center justify-between">
          <span className={`text-xs font-medium ${book.availableCopies > 0 ? 'text-green-600' : 'text-red-500'}`}>
            {book.availableCopies > 0 ? `✅ Còn ${book.availableCopies} bản` : '❌ Hết sách'}
          </span>
        </div>
      </div>
    </Link>
  );
}

export default function BookList() {
  const [books, setBooks]         = useState([]);
  const [categories, setCategories] = useState([]);
  const [keyword, setKeyword]     = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [page, setPage]           = useState(0);
  const [total, setTotal]         = useState(0);
  const [loading, setLoading]     = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const r = await bookService.getAll({ keyword: keyword || undefined, categoryId: categoryId || undefined, page, size:12 });
      setBooks(r.data.content);
      setTotal(r.data.totalPages);
    } finally { setLoading(false); }
  }, [keyword, categoryId, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { categoryService.getAll().then(r => setCategories(r.data)); }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">🔍 Tìm kiếm sách</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          <input className="input-field max-w-sm" placeholder="Tìm tên sách, tác giả, ISBN..."
            value={keyword}
            onChange={e => { setKeyword(e.target.value); setPage(0); }} />
          <select className="input-field w-44" value={categoryId}
            onChange={e => { setCategoryId(e.target.value); setPage(0); }}>
            <option value="">Tất cả danh mục</option>
            {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          {(keyword || categoryId) && (
            <button className="btn-secondary text-sm"
              onClick={() => { setKeyword(''); setCategoryId(''); setPage(0); }}>
              ✕ Xóa bộ lọc
            </button>
          )}
        </div>

        {loading ? <LoadingSpinner /> : books.length === 0 ? (
          <EmptyState icon="📚" title="Không tìm thấy sách nào" description="Thử tìm với từ khóa khác." />
        ) : (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {books.map(b => <BookCard key={b.id} book={b} />)}
            </div>
            <Pagination page={page} totalPages={total} onPageChange={setPage} />
          </>
        )}
      </div>
    </div>
  );
}
