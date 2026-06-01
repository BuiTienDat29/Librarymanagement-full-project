import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Navbar, LoadingSpinner, StatusBadge, Alert } from '../components';
import { bookService, borrowService, reservationService } from '../services';
import { useAuth } from '../context/AuthContext';

export default function BookDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [book, setBook]     = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]       = useState({ type:'', text:'' });
  const [actionLoading, setActionLoading] = useState(false);

  const flash = (type, text) => setMsg({ type, text });

  useEffect(() => {
    bookService.getById(id).then(r => setBook(r.data))
      .catch(() => navigate('/books'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleBorrow = async () => {
    if (!user) { navigate('/login'); return; }
    setActionLoading(true);
    try {
      await borrowService.borrow({ bookId: Number(id) });
      flash('success', '✅ Mượn sách thành công! Vui lòng đến thư viện nhận sách.');
      bookService.getById(id).then(r => setBook(r.data));
    } catch (err) { flash('error', err.response?.data?.message || 'Không thể mượn sách.'); }
    finally { setActionLoading(false); }
  };

  const handleReserve = async () => {
    if (!user) { navigate('/login'); return; }
    setActionLoading(true);
    try {
      await reservationService.reserve({ bookId: Number(id) });
      flash('success', '🔖 Đặt trước thành công! Chúng tôi sẽ thông báo khi sách có sẵn.');
    } catch (err) { flash('error', err.response?.data?.message || 'Không thể đặt trước.'); }
    finally { setActionLoading(false); }
  };

  if (loading) return <div className="min-h-screen bg-gray-50"><Navbar /><LoadingSpinner /></div>;
  if (!book)   return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to="/books" className="text-blue-600 hover:underline text-sm mb-6 inline-block">← Quay lại danh sách</Link>
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="md:flex">
            {/* Cover */}
            <div className="md:w-56 flex-shrink-0 bg-gradient-to-br from-blue-100 to-blue-50 flex items-center justify-center p-8 min-h-48">
              {book.coverImageUrl ? (
                <img src={book.coverImageUrl} alt={book.title} className="w-full object-cover rounded shadow" />
              ) : (
                <div className="text-6xl">📖</div>
              )}
            </div>

            {/* Info */}
            <div className="p-6 flex-1">
              <div className="flex items-start justify-between gap-4 flex-wrap">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 leading-tight">{book.title}</h1>
                  <p className="text-gray-600 mt-1">{book.author}</p>
                  {book.categoryName && (
                    <span className="inline-block mt-2 bg-blue-50 text-blue-700 text-xs px-2.5 py-1 rounded-full font-medium">
                      {book.categoryName}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${book.availableCopies > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {book.availableCopies}/{book.totalCopies}
                  </div>
                  <p className="text-xs text-gray-400">bản có sẵn</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-2 text-sm text-gray-600">
                {book.isbn        && <div><span className="font-medium">ISBN:</span> {book.isbn}</div>}
                {book.publisher   && <div><span className="font-medium">NXB:</span> {book.publisher}</div>}
                {book.publishedYear && <div><span className="font-medium">Năm:</span> {book.publishedYear}</div>}
              </div>

              {book.description && (
                <p className="mt-4 text-sm text-gray-600 leading-relaxed">{book.description}</p>
              )}

              <div className="mt-6">
                {msg.text && (
                  <div className={`mb-3 text-sm px-4 py-2.5 rounded-lg border ${
                    msg.type === 'success' ? 'bg-green-50 border-green-200 text-green-700' : 'bg-red-50 border-red-200 text-red-700'
                  }`}>{msg.text}</div>
                )}
                <div className="flex gap-3 flex-wrap">
                  {book.availableCopies > 0 ? (
                    <button onClick={handleBorrow} disabled={actionLoading || !user}
                      className="btn-primary disabled:opacity-60">
                      {actionLoading ? 'Đang xử lý...' : '📖 Mượn sách'}
                    </button>
                  ) : (
                    <button onClick={handleReserve} disabled={actionLoading || !user}
                      className="bg-purple-600 hover:bg-purple-700 text-white font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-60">
                      {actionLoading ? 'Đang xử lý...' : '🔖 Đặt trước'}
                    </button>
                  )}
                  {!user && (
                    <Link to="/login" className="btn-secondary">Đăng nhập để mượn</Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
