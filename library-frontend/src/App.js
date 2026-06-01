import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import Login        from './pages/Login';
import Register     from './pages/Register';
import BookList     from './pages/BookList';
import BookDetail   from './pages/BookDetail';
import { MyHistory, MyFines, MyReservations, Profile, Home } from './pages/StudentPages';

import AdminDashboard from './pages/admin/Dashboard';
import ManageBooks    from './pages/admin/ManageBooks';
import {
  ManageBorrows, ManageOverdue, ManageFines,
  ManageReservations, ManageUsers, ManageCategories
} from './pages/admin/AdminPages';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/books"    element={<BookList />} />
          <Route path="/books/:id" element={<BookDetail />} />

          {/* Default to login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Student */}
          <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
          <Route path="/profile"      element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route path="/my-history"   element={<ProtectedRoute><MyHistory /></ProtectedRoute>} />
          <Route path="/my-fines"     element={<ProtectedRoute><MyFines /></ProtectedRoute>} />
          <Route path="/my-reservations" element={<ProtectedRoute><MyReservations /></ProtectedRoute>} />

          {/* Admin/Librarian */}
          <Route path="/admin" element={<ProtectedRoute roles={['ADMIN','LIBRARIAN']}><AdminDashboard /></ProtectedRoute>} />
          <Route path="/admin/books"        element={<ProtectedRoute roles={['ADMIN','LIBRARIAN']}><ManageBooks /></ProtectedRoute>} />
          <Route path="/admin/categories"   element={<ProtectedRoute roles={['ADMIN','LIBRARIAN']}><ManageCategories /></ProtectedRoute>} />
          <Route path="/admin/borrows"      element={<ProtectedRoute roles={['ADMIN','LIBRARIAN']}><ManageBorrows /></ProtectedRoute>} />
          <Route path="/admin/overdue"      element={<ProtectedRoute roles={['ADMIN','LIBRARIAN']}><ManageOverdue /></ProtectedRoute>} />
          <Route path="/admin/fines"        element={<ProtectedRoute roles={['ADMIN','LIBRARIAN']}><ManageFines /></ProtectedRoute>} />
          <Route path="/admin/reservations" element={<ProtectedRoute roles={['ADMIN','LIBRARIAN']}><ManageReservations /></ProtectedRoute>} />
          <Route path="/admin/users"        element={<ProtectedRoute roles={['ADMIN']}><ManageUsers /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
