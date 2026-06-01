import React, { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from '../../components/Layout';
import { Pagination, LoadingSpinner, StatusBadge, Alert, EmptyState, Modal } from '../../components';
import { borrowService, fineService, reservationService, userService, categoryService } from '../../services';

// ══ Manage Borrows ═════════════════════════════════════════
export function ManageBorrows() {
  const [data, setData]     = useState([]);
  const [page, setPage]     = useState(0);
  const [total, setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]       = useState({ type:'', text:'' });

  const flash = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type:'', text:'' }), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await borrowService.active({ page, size:20 }); setData(r.data.content); setTotal(r.data.totalPages); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handleReturn = async (id) => {
    if (!window.confirm('Xác nhận trả sách này?')) return;
    try { await borrowService.returnBook(id); flash('success', 'Xác nhận trả sách thành công.'); load(); }
    catch (err) { flash('error', err.response?.data?.message || 'Lỗi.'); }
  };

  return (
    <AdminLayout title="Quản lý mượn trả" subtitle="Quản lý phiếu mượn và xác nhận trả sách">
      <Alert type={msg.type} message={msg.text} />
      {loading ? <LoadingSpinner /> : data.length === 0 ? <EmptyState icon="📭" title="Không có phiếu mượn nào" /> : (
        <>
          <div className="table-container">
            <table className="table-modern">
              <thead>
                <tr>{['Người mượn','Sách','Barcode','Ngày mượn','Hạn trả','Trạng thái','Hành động'].map(h =>
                  <th key={h} className="whitespace-nowrap">{h}</th>
                )}</tr>
              </thead>
              <tbody>
                {data.map(r => (
                  <tr key={r.id}>
                    <td>
                      <p className="font-medium text-surface-900 dark:text-white">{r.userFullName}</p>
                      <p className="text-xs text-surface-500">@{r.username}</p>
                    </td>
                    <td className="text-surface-700 dark:text-surface-300">{r.bookTitle}</td>
                    <td className="font-mono text-xs text-surface-500">{r.barcode}</td>
                    <td className="text-surface-500">{r.borrowDate}</td>
                    <td className={`font-medium ${r.overdue ? 'text-error' : 'text-surface-500'}`}>{r.dueDate}</td>
                    <td><StatusBadge status={r.status} /></td>
                    <td>
                      <button onClick={() => handleReturn(r.id)} className="btn btn-sm btn-success">
                        Xác nhận trả
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={total} onPageChange={setPage} />
        </>
      )}
    </AdminLayout>
  );
}

// ══ Manage Overdue ═════════════════════════════════════════
export function ManageOverdue() {
  const [data, setData]     = useState([]);
  const [page, setPage]     = useState(0);
  const [total, setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]       = useState({ type:'', text:'' });

  const flash = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type:'', text:'' }), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await borrowService.overdue({ page, size:20 }); setData(r.data.content); setTotal(r.data.totalPages); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handleReturn = async (id) => {
    if (!window.confirm('Xác nhận trả sách (sẽ tự tính tiền phạt)?')) return;
    try { await borrowService.returnBook(id); flash('success', 'Đã xử lý trả sách và tạo phiếu phạt.'); load(); }
    catch (err) { flash('error', err.response?.data?.message || 'Lỗi.'); }
  };

  return (
    <AdminLayout title="Sách quá hạn" subtitle="Quản lý sách trả trễ và xử lý phạt">
      <Alert type={msg.type} message={msg.text} />
      {loading ? <LoadingSpinner /> : data.length === 0 ? (
        <EmptyState icon="✅" title="Không có sách quá hạn" description="Tất cả sách đang được trả đúng hạn." />
      ) : (
        <>
          <div className="table-container">
            <table className="table-modern">
              <thead>
                <tr>{['Người mượn','Sách','Hạn trả','Số ngày trễ','Trạng thái','Hành động'].map(h =>
                  <th key={h} className="whitespace-nowrap">{h}</th>
                )}</tr>
              </thead>
              <tbody>
                {data.map(r => {
                  const daysLate = Math.max(0, Math.floor((Date.now() - new Date(r.dueDate)) / 86400000));
                  return (
                    <tr key={r.id} className="bg-red-50/30 dark:bg-red-900/10">
                      <td>
                        <p className="font-medium text-surface-900 dark:text-white">{r.userFullName}</p>
                        <p className="text-xs text-surface-500">@{r.username}</p>
                      </td>
                      <td className="text-surface-700 dark:text-surface-300">{r.bookTitle}</td>
                      <td className="text-error font-medium">{r.dueDate}</td>
                      <td className="text-error font-bold">{daysLate} ngày</td>
                      <td><StatusBadge status={r.status} /></td>
                      <td>
                        <button onClick={() => handleReturn(r.id)} className="btn btn-sm btn-danger">
                          Xử lý trả
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={total} onPageChange={setPage} />
        </>
      )}
    </AdminLayout>
  );
}

// ══ Manage Fines ══════════════════════════════════════════
export function ManageFines() {
  const [data, setData]     = useState([]);
  const [page, setPage]     = useState(0);
  const [total, setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]       = useState({ type:'', text:'' });

  const flash = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type:'', text:'' }), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await fineService.getAll({ page, size:20 }); setData(r.data.content); setTotal(r.data.totalPages); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  const handlePay = async (id) => {
    try { await fineService.pay(id); flash('success', 'Xác nhận thanh toán thành công.'); load(); }
    catch (err) { flash('error', err.response?.data?.message || 'Lỗi.'); }
  };

  const handleWaive = async (id) => {
    if (!window.confirm('Miễn phạt cho phiếu này?')) return;
    try { await fineService.waive(id); flash('success', 'Đã miễn phạt.'); load(); }
    catch (err) { flash('error', err.response?.data?.message || 'Lỗi.'); }
  };

  return (
    <AdminLayout title="Quản lý tiền phạt" subtitle="Quản lý các khoản phạt do quá hạn">
      <Alert type={msg.type} message={msg.text} />
      {loading ? <LoadingSpinner /> : data.length === 0 ? (
        <EmptyState icon="✅" title="Không có tiền phạt" />
      ) : (
        <>
          <div className="table-container">
            <table className="table-modern">
              <thead>
                <tr>{['Người dùng','Sách','Số ngày trễ','Số tiền','Trạng thái','Ngày tạo','Hành động'].map(h =>
                  <th key={h} className="whitespace-nowrap">{h}</th>
                )}</tr>
              </thead>
              <tbody>
                {data.map(f => (
                  <tr key={f.id}>
                    <td className="font-medium text-surface-900 dark:text-white">{f.userFullName}</td>
                    <td className="text-surface-700 dark:text-surface-300">{f.bookTitle}</td>
                    <td className="text-surface-500">{f.daysOverdue} ngày</td>
                    <td className="text-error font-semibold">{Number(f.amount).toLocaleString('vi')}đ</td>
                    <td><StatusBadge status={f.status} /></td>
                    <td className="text-surface-500">{f.createdAt?.slice(0,10)}</td>
                    <td className="flex gap-2">
                      {f.status === 'PENDING' && (
                        <>
                          <button onClick={() => handlePay(f.id)} className="btn btn-sm btn-success">Đã thanh toán</button>
                          <button onClick={() => handleWaive(f.id)} className="btn btn-sm btn-secondary">Miễn phạt</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={total} onPageChange={setPage} />
        </>
      )}
    </AdminLayout>
  );
}

// ══ Manage Reservations ════════════════════════════════════
export function ManageReservations() {
  const [data, setData]     = useState([]);
  const [page, setPage]     = useState(0);
  const [total, setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await reservationService.getAll({ page, size:20 }); setData(r.data.content); setTotal(r.data.totalPages); }
    finally { setLoading(false); }
  }, [page]);

  useEffect(() => { load(); }, [load]);

  return (
    <AdminLayout title="Quản lý đặt trước" subtitle="Quản lý đặt sách trước">
      {loading ? <LoadingSpinner /> : data.length === 0 ? (
        <EmptyState icon="🔖" title="Không có đặt trước nào" />
      ) : (
        <>
          <div className="table-container">
            <table className="table-modern">
              <thead>
                <tr>{['Người đặt','Sách','Ngày đặt','Hết hạn giữ','Trạng thái'].map(h =>
                  <th key={h} className="whitespace-nowrap">{h}</th>
                )}</tr>
              </thead>
              <tbody>
                {data.map(r => (
                  <tr key={r.id}>
                    <td className="font-medium text-surface-900 dark:text-white">{r.userFullName}</td>
                    <td className="text-surface-700 dark:text-surface-300">{r.bookTitle}</td>
                    <td className="text-surface-500">{r.reservedAt?.slice(0,10)}</td>
                    <td className="text-surface-500">{r.expiresAt?.slice(0,10) || '—'}</td>
                    <td><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={total} onPageChange={setPage} />
        </>
      )}
    </AdminLayout>
  );
}

// ══ Manage Users ══════════════════════════════════════════
export function ManageUsers() {
  const [data, setData]     = useState([]);
  const [page, setPage]     = useState(0);
  const [total, setTotal]   = useState(0);
  const [keyword, setKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]       = useState({ type:'', text:'' });
  const [editUser, setEditUser] = useState(null);

  const flash = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type:'', text:'' }), 3000); };

  const load = useCallback(async () => {
    setLoading(true);
    try { const r = await userService.getAll({ keyword, page, size:20 }); setData(r.data.content); setTotal(r.data.totalPages); }
    finally { setLoading(false); }
  }, [page, keyword]);

  useEffect(() => { load(); }, [load]);

  const handleDeactivate = async (id, active) => {
    if (!window.confirm(active ? 'Vô hiệu hóa tài khoản này?' : 'Kích hoạt lại tài khoản?')) return;
    try {
      await userService.update(id, { isActive: !active });
      flash('success', active ? 'Đã vô hiệu hóa.' : 'Đã kích hoạt lại.');
      load();
    } catch (err) { flash('error', err.response?.data?.message || 'Lỗi.'); }
  };

  const handleRoleChange = async (id, newRole) => {
    try { await userService.update(id, { roleName: newRole }); flash('success', 'Đã cập nhật role.'); load(); }
    catch (err) { flash('error', err.response?.data?.message || 'Lỗi.'); }
  };

  return (
    <AdminLayout title="Quản lý người dùng" subtitle="Quản lý tài khoản người dùng">
      <div className="flex gap-3 mb-4">
        <input className="input max-w-xs" placeholder="Tìm theo tên, username, email..."
          value={keyword} onChange={e => { setKeyword(e.target.value); setPage(0); }} />
      </div>
      <Alert type={msg.type} message={msg.text} />
      {loading ? <LoadingSpinner /> : data.length === 0 ? (
        <EmptyState icon="👥" title="Không tìm thấy người dùng" />
      ) : (
        <>
          <div className="table-container">
            <table className="table-modern">
              <thead>
                <tr>{['Họ tên','Username','Email','Mã SV','Role','Trạng thái','Ngày tạo','Hành động'].map(h =>
                  <th key={h} className="whitespace-nowrap">{h}</th>
                )}</tr>
              </thead>
              <tbody>
                {data.map(u => (
                  <tr key={u.id}>
                    <td className="font-medium text-surface-900 dark:text-white">{u.fullName}</td>
                    <td className="text-surface-500">@{u.username}</td>
                    <td className="text-surface-500">{u.email}</td>
                    <td className="text-surface-500">{u.studentId || '—'}</td>
                    <td>
                      <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)}
                        className="input py-1 px-2 text-xs">
                        {['STUDENT','LIBRARIAN','ADMIN'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                    </td>
                    <td>
                      <span className={`badge ${u.isActive ? 'badge-success' : 'badge-error'}`}>
                        {u.isActive ? 'Hoạt động' : 'Bị khóa'}
                      </span>
                    </td>
                    <td className="text-surface-500">{u.createdAt?.slice(0,10)}</td>
                    <td>
                      <button onClick={() => handleDeactivate(u.id, u.isActive)}
                        className={u.isActive ? 'text-error hover:text-red-700 text-xs font-medium' : 'text-success hover:text-emerald-700 text-xs font-medium'}>
                        {u.isActive ? 'Khóa' : 'Mở khóa'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={total} onPageChange={setPage} />
        </>
      )}
    </AdminLayout>
  );
}

// ══ Manage Categories ══════════════════════════════════════
export function ManageCategories() {
  const [data, setData]     = useState([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]       = useState({ type:'', text:'' });
  const [modal, setModal]   = useState(false);
  const [form, setForm]     = useState({ name:'', description:'' });
  const [editId, setEditId] = useState(null);

  const flash = (type, text) => { setMsg({ type, text }); setTimeout(() => setMsg({ type:'', text:'' }), 3000); };

  const load = async () => {
    setLoading(true);
    try { const r = await categoryService.getAll(); setData(r.data); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, []);

  const openAdd = () => { setEditId(null); setForm({ name:'', description:'' }); setModal(true); };
  const openEdit = (c) => { setEditId(c.id); setForm({ name: c.name, description: c.description || '' }); setModal(true); };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) await categoryService.update(editId, form);
      else        await categoryService.create(form);
      flash('success', editId ? 'Cập nhật danh mục thành công.' : 'Thêm danh mục thành công.');
      setModal(false);
      load();
    } catch (err) { flash('error', err.response?.data?.message || 'Lỗi.'); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Xóa danh mục này?')) return;
    try { await categoryService.delete(id); flash('success', 'Đã xóa.'); load(); }
    catch (err) { flash('error', err.response?.data?.message || 'Lỗi — có thể danh mục đang được dùng.'); }
  };

  return (
    <AdminLayout title="Quản lý danh mục" subtitle="Quản lý các danh mục sách">
      <div className="flex justify-between items-center mb-4">
        <Alert type={msg.type} message={msg.text} />
        <button onClick={openAdd} className="btn btn-primary">+ Thêm danh mục</button>
      </div>

      {loading ? <LoadingSpinner /> : (
        <div className="table-container">
          <table className="table-modern">
            <thead>
              <tr>{['ID','Tên danh mục','Mô tả','Hành động'].map(h =>
                <th key={h}>{h}</th>
              )}</tr>
            </thead>
            <tbody>
              {data.map(c => (
                <tr key={c.id}>
                  <td className="text-surface-400">#{c.id}</td>
                  <td className="font-medium text-surface-900 dark:text-white">{c.name}</td>
                  <td className="text-surface-500">{c.description || '—'}</td>
                  <td className="flex gap-3">
                    <button onClick={() => openEdit(c)} className="text-primary-600 hover:text-primary-700 text-xs font-medium">Sửa</button>
                    <button onClick={() => handleDelete(c.id)} className="text-error hover:text-red-700 text-xs font-medium">Xóa</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={modal} onClose={() => setModal(false)} title={editId ? 'Sửa danh mục' : 'Thêm danh mục'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label">Tên danh mục *</label>
            <input className="input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
          </div>
          <div>
            <label className="label">Mô tả</label>
            <textarea className="input" rows={3} value={form.description}
              onChange={e => setForm({...form, description: e.target.value})} />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={() => setModal(false)} className="btn btn-secondary">Hủy</button>
            <button type="submit" className="btn btn-primary">{editId ? 'Lưu' : 'Thêm'}</button>
          </div>
        </form>
      </Modal>
    </AdminLayout>
  );
}