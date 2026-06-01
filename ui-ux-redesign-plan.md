# 🎨 UI/UX Redesign Plan - Library Management System

## 1. PHÂN TÍCH HỆ THỐNG HIỆN TẠI

### Tech Stack Hiện Tại:
- **Frontend**: React 18 + Tailwind CSS
- **Backend**: Spring Boot + JWT
- **UI Style**: Bootstrap-like, functional but dated

### Các Màn Hình Hiện Có:
**Admin:**
- Dashboard (tổng quan)
- Quản lý sách (Books)
- Danh mục (Categories)
- Mượn/trả (Borrows)
- Quá hạn (Overdue)
- Tiền phạt (Fines)
- Đặt trước (Reservations)
- Người dùng (Users)

**Student:**
- Trang chủ (Home)
- Lịch sử mượn (My History)
- Tiền phạt (My Fines)
- Đặt trước (My Reservations)
- Hồ sơ (Profile)

**Công khai:**
- Login
- Register
- Book List
- Book Detail

---

## 2. THIẾT KẾ UI/UX MỚI

### 🎯 Phong Cách Thiết Kế
Modern SaaS Dashboard giống: **Notion, Linear, Jira, GitHub, Figma, Vercel**

### 2.1 Color Palette

#### Light Mode:
```css
/* Primary - Royal Blue */
--color-primary-50: #eff6ff
--color-primary-100: #dbeafe
--color-primary-200: #bfdbfe
--color-primary-300: #93c5fd
--color-primary-400: #60a5fa
--color-primary-500: #3b82f6
--color-primary-600: #2563eb
--color-primary-700: #1d4ed8
--color-primary-800: #1e40af
--color-primary-900: #1e3a8a

/* Neutral - Slate */
--color-neutral-50: #f8fafc
--color-neutral-100: #f1f5f9
--color-neutral-200: #e2e8f0
--color-neutral-300: #cbd5e1
--color-neutral-400: #94a3b8
--color-neutral-500: #64748b
--color-neutral-600: #475569
--color-neutral-700: #334155
--color-neutral-800: #1e293b
--color-neutral-900: #0f172a

/* Accent Colors */
--color-success: #10b981      /* Emerald */
--color-warning: #f59e0b      /* Amber */
--color-error: #ef4444        /* Red */
--color-info: #06b6d4         /* Cyan */
```

#### Dark Mode:
```css
/* Dark Mode - Slate Deep */
--color-dark-bg: #0f172a
--color-dark-surface: #1e293b
--color-dark-surface-hover: #334155
--color-dark-border: #334155
--color-dark-text: #f1f5f9
--color-dark-text-muted: #94a3b8
```

### 2.2 Typography

```css
/* Font Family */
--font-display: 'Plus Jakarta Sans', sans-serif
--font-body: 'Inter', system-ui, sans-serif
--font-mono: 'JetBrains Mono', monospace

/* Font Sizes */
--text-xs: 0.75rem      /* 12px */
--text-sm: 0.875rem     /* 14px */
--text-base: 1rem        /* 16px */
--text-lg: 1.125rem     /* 18px */
--text-xl: 1.25rem      /* 20px */
--text-2xl: 1.5rem      /* 24px */
--text-3xl: 1.875rem    /* 30px */
--text-4xl: 2.25rem     /* 36px */

/* Font Weights */
--font-normal: 400
--font-medium: 500
--font-semibold: 600
--font-bold: 700
```

### 2.3 Spacing System
```css
--space-1: 0.25rem   /* 4px */
--space-2: 0.5rem    /* 8px */
--space-3: 0.75rem   /* 12px */
--space-4: 1rem      /* 16px */
--space-5: 1.25rem   /* 20px */
--space-6: 1.5rem    /* 24px */
--space-8: 2rem      /* 32px */
--space-10: 2.5rem   /* 40px */
--space-12: 3rem     /* 48px */
```

### 2.4 Border Radius
```css
--radius-sm: 0.375rem   /* 6px */
--radius-md: 0.5rem    /* 8px */
--radius-lg: 0.75rem   /* 12px */
--radius-xl: 1rem      /* 16px */
--radius-2xl: 1.5rem  /* 24px */
--radius-full: 9999px
```

### 2.5 Shadows
```css
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05)
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1)
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1)
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1)
--shadow-glow: 0 0 20px rgba(59, 130, 246, 0.3)
```

---

## 3. COMPONENT DESIGN SYSTEM

### 3.1 Sidebar (Fixed Left)
```
┌─────────────────────────────────────────────────────┐
│  LOGO                                              │
│  ─────────────────────────────────────────────────  │
│  📊 Tổng quan                                      │
│  📚 Quản lý sách                                   │
│  🗂️ Danh mục                                       │
│  📖 Mượn/trả                                       │
│  ⏰ Quá hạn                                        │
│  💰 Tiền phạt                                      │
│  🔖 Đặt trước                                      │
│  👥 Người dùng                                     │
│                                                     │
│  ─────────────────────────────────────────────────  │
│  ⚙️ Cài đặt                                        │
│  👤 Hồ sơ                                          │
└─────────────────────────────────────────────────────┘
  Width: 260px
  Background: Surface color
  Border: Right border 1px
```

### 3.2 Header
```
┌─────────────────────────────────────────────────────────────────┐
│  🔍 Search...                           🔔 👤 Admin ▼          │
└─────────────────────────────────────────────────────────────────┘
  Height: 64px
  Sticky top
  Search with cmd+k shortcut style
  Notifications bell
  User avatar dropdown
```

### 3.3 Stat Cards
```
┌──────────────┐  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│   📚         │  │   📋         │  │   ✅         │  │   👥         │
│   Đầu sách   │  │   Tổng bản   │  │   Có thể     │  │   Người      │
│              │  │   sao        │  │   mượn       │  │   dùng       │
│   1,234      │  │   5,678      │  │   3,421      │  │   890        │
│   ↑12%       │  │   ↑5%        │  │   ↓3%        │  │   ↑8%        │
└──────────────┘  └──────────────┘  └──────────────┘  └──────────────┘
  Style: Glassmorphism, gradient border, hover lift
```

### 3.4 Data Tables
```
┌─────────────────────────────────────────────────────────────────┐
│  Tìm kiếm...                      [+ Thêm mới]   [⋮] Export   │
├─────────────────────────────────────────────────────────────────┤
│  ☐  │ Tên sách          │ Tác giả    │ Số lượng │ Trạng thái  │
│─────────────────────────────────────────────────────────────────│
│  ☐  │ Clean Code        │ R.Martin   │    5     │  ✓ Còn sách │
│  ☐  │ Design Patterns    │ Gang of 4  │    3     │  ✓ Còn sách │
│  ☐  │ The Pragmatic...   │ D.Thomas   │    0     │  ⚠ Hết sách │
├─────────────────────────────────────────────────────────────────┤
│  Showing 1-10 of 234    〈 1 2 3 ... 24 〉                        │
└─────────────────────────────────────────────────────────────────┘
  Features: Checkbox, sort, filter, search, pagination
```

### 3.5 Buttons
```
Primary:    [  Button  ]     bg-primary-600, rounded-lg, shadow-md
Secondary:  [  Button  ]     bg-gray-100, hover:bg-gray-200
Danger:     [  Button  ]     bg-red-600, text white
Ghost:      [  Button  ]     transparent, hover:bg-gray-100
Icon:       [  +  ]          circle, 40px
```

### 3.6 Forms
```
┌──────────────────────────────────────────┐
│  Label *                                │
│  ┌────────────────────────────────────┐ │
│  │ Input placeholder                  │ │
│  └────────────────────────────────────┘ │
│  Helper text below                      │
└──────────────────────────────────────────┘

Input Style:
- Border: 1px solid neutral-300
- Focus: ring-2 ring-primary-500
- Error: border-red-500, red ring
- Rounded: lg (12px)
- Padding: 12px 16px
```

### 3.7 Modals
```
┌─────────────────────────────────────────────────┐
│  Modal Title                        [×]       │
│  ───────────────────────────────────────────── │
│                                             │
│  Content goes here...                        │
│                                             │
│  ───────────────────────────────────────────── │
│  [Cancel]                      [Confirm]     │
└─────────────────────────────────────────────────┘
  Backdrop: bg-black/50, blur
  Modal: bg-white, rounded-2xl, shadow-2xl
  Animation: scale-in, fade-in
```

### 3.8 Status Badges
```
[Đang mượn]   bg-blue-100 text-blue-700 rounded-full
[Đã trả]      bg-green-100 text-green-700 rounded-full
[Quá hạn]     bg-red-100 text-red-700 rounded-full
[Chờ duyệt]   bg-yellow-100 text-yellow-700 rounded-full
```

---

## 4. WIREFRAME ASCII - TỪNG MÀN HÌNH

### 4.1 Admin Dashboard
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  ▓▓  📚 THƯ VIỆN ĐHCNĐA                    🔍 Search...  🔔  👤 Admin ▼      ▓▓  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
├────────────────────────┬───────────────────────────────────────────────────────────┤
│  ┌──────────────────┐  │  ┌─────────────────────────────────────────────────────┐  │
│  │ 📊 Tổng quan    │  │  │  Good morning, Admin 👋                              │  │
│  │ 📚 Quản lý sách  │  │  │  Here's what's happening today                      │  │
│  │ 🗂️ Danh mục      │  │  └─────────────────────────────────────────────────────┘  │
│  │ 📖 Mượn/trả      │  │                                                           │
│  │ ⏰ Quá hạn       │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│  │ 💰 Tiền phạt     │  │  │  📚     │ │  📋     │ │  ✅     │ │  👥     │        │
│  │ 🔖 Đặt trước     │  │  │ 1,234   │ │ 5,678   │ │ 3,421   │ │  890    │        │
│  │ 👥 Người dùng    │  │  │ Đầu sách│ │Bản sao  │ │Có thể   │ │Người    │        │
│  │                  │  │  │         │ │         │ │ mượn    │ │ dùng    │        │
│  │ ──────────────── │  │  │ +12%    │ │ +5%     │ │ -3%     │ │ +8%     │        │
│  │ ⚙️ Cài đặt       │  │  └─────────┘ └─────────┘ └─────────┘ └─────────┘        │
│  │ 👤 Hồ sơ        │  │                                                           │
│  └──────────────────┘  │  ┌──────────────────────────────────────────┐           │
│                        │  │ 📈 Thống kê mượn sách (30 ngày qua)        │           │
│                        │  │                                          │           │
│                        │  │  █                                        │           │
│                        │  │  █ █          █                          │           │
│                        │  │  █ █ █    █ █ █ █       █                 │           │
│                        │  │  █ █ █ █ █ █ █ █ █ █ █ █ █ █ █ █          │           │
│                        │  │  ─────────────────────────────────────    │           │
│                        │  │  T2   T4   T6   CN   T3   T5   T7        │           │
│                        │  └──────────────────────────────────────────┘           │
│                        │                                                           │
│                        │  ┌────────────────────┐ ┌────────────────────┐          │
│                        │  │ 📖 Mượn gần đây    │ │ ⏰ Quá hạn gần đây │          │
│                        │  ├────────────────────┤ ├────────────────────┤          │
│                        │  │ • Clean Code       │ │ • Design Patterns  │          │
│                        │  │   John Doe         │ │   Jane Smith       │          │
│                        │  │ • Clean Architecture│ │ • Refactoring    │          │
│                        │  │   Mike Ross        │ │   Rachel Green     │          │
│                        │  └────────────────────┘ └────────────────────┘          │
└────────────────────────┴───────────────────────────────────────────────────────────┘
```

### 4.2 Student Dashboard
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
│  ▓▓  📚 THƯ VIỆN ĐHCNĐA                    🔍 Search...  🔔  👤 Student ▼     ▓▓  │
│  ▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  │
├────────────────────────┤  ┌───────────────────────────────────────────────────────┐
│  ┌──────────────────┐   │  │  Welcome back, Nguyễn Văn A 👋                      │  │
│  │ 🏠 Trang chủ     │   │  │  You have 2 books due this week                    │  │
│  │ 🔍 Tìm sách      │   │  └─────────────────────────────────────────────────────┘  │
│  │ 📖 Lịch sử mượn  │   │                                                           │
│  │ 💰 Tiền phạt     │   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│  │ 🔖 Đặt trước     │   │  │  📖     │ │  ⏰     │ │  💰     │ │  🔖     │        │
│  │                  │   │  │   2     │ │   2     │ │  50,000đ│ │   1     │        │
│  │ ──────────────── │   │  │Đang mượn│ │Sắp đến hạn│ │Phạt chưa│ │Đặt trước │        │
│  │ 👤 Hồ sơ        │   │  │         │ │         │ │  thanh   │ │         │        │
│  └──────────────────┘   │  │         │ │ Due: T7 │ │  toán    │ │         │        │
│                        │  └─────────┘ └─────────┘ └─────────┘ └─────────┘        │
│                        │                                                           │
│                        │  ┌──────────────────────────────────────────┐            │
│                        │  │ 📚 Sách đang mượn                        │            │
│                        │  ├──────────────────────────────────────────┤            │
│                        │  │ Clean Code - R. Martin                   │            │
│                        │  │ Due: 05/06/2026 ⚠️ Quá hạn 2 ngày         │            │
│                        │  ├──────────────────────────────────────────┤            │
│                        │  │ Design Patterns - Gang of 4              │            │
│                        │  │ Due: 10/06/2026                          │            │
│                        │  └──────────────────────────────────────────┘            │
│                        │                                                           │
│                        │  ┌──────────────────────────────────────────┐            │
│                        │  │ 📢 Thông báo                             │            │
│                        │  ├──────────────────────────────────────────┤            │
│                        │  │ 🔔 Sách "Clean Architecture" sẵn sàng   │            │
│                        │  │    để nhận tại quầy. Hạn đến 01/06/2026  │            │
│                        │  └──────────────────────────────────────────┘            │
└────────────────────────┴───────────────────────────────────────────────────────────┘
```

### 4.3 Login Page
```
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                                                                 │
│              ╔═══════════════════════════╗                     │
│              ║     📚                    ║                     │
│              ║  Thư viện ĐHCNĐA          ║                     │
│              ║                           ║                     │
│              ║  Welcome back             ║                     │
│              ║  Sign in to continue      ║                     │
│              ║                           ║                     │
│              ║  Username                 ║                     │
│              ║  ┌───────────────────┐   ║                     │
│              ║  │ admin             │   ║                     │
│              ║  └───────────────────┘   ║                     │
│              ║                           ║                     │
│              ║  Password                ║                     │
│              ║  ┌───────────────────┐   ║                     │
│              ║  │ ··············   │   ║                     │
│              ║  └───────────────────┘   ║                     │
│              ║                           ║                     │
│              ║  [  Sign In  ]            ║                     │
│              ║                           ║                     │
│              ║  Don't have an account?   ║                     │
│              ║  Register                 ║                     │
│              ╚═══════════════════════════╝                     │
│                                                                 │
│              Background: Gradient mesh with blur               │
└─────────────────────────────────────────────────────────────────┘
```

### 4.4 Books Management (Admin)
```
┌────────────────────────────────────────────────────────────────────────────────────┐
│  📚 THƯ VIỆN ...                                          🔔  👤 Admin ▼        │
├────────────────────────┬───────────────────────────────────────────────────────────┤
│  Dashboard            │  ┌─────────────────────────────────────────────────────┐  │
│  📚 Quản lý sách       │  │ Quản lý sách          [+ Thêm sách]  [Export]      │  │
│  🗂️ Danh mục           │  ├─────────────────────────────────────────────────────┤  │
│  📖 Mượn/trả           │  │ 🔍 Tìm theo tên, tác giả...     │ 📂 Lọc │ 📅 Sắp xếp│  │
│  ⏰ Quá hạn            │  ├─────────────────────────────────────────────────────┤  │
│  💰 Tiền phạt          │  │ ☐ │ Tên sách        │ Tác giả    │ SL   │ Danh mục │  │
│  🔖 Đặt trước          │  ├────┼─────────────────┼────────────┼──────┼──────────┤  │
│  👥 Người dùng         │  │ ☐ │ Clean Code      │ R.Martin   │  5   │ CS   ✓   │  │
│  ⚙️ Cài đặt            │  │ ☐ │ Design Patterns │ Gang of 4  │  3   │ CS   ✓   │  │
│  👤 Hồ sơ             │  │ ☐ │ The Pragmatic   │ D.Thomas   │  0   │ CS   ⚠️  │  │
│                        │  │ ☐ │ Clean Arch...   │ R.C.Martin │  2   │ CS   ✓   │  │
│                        │  ├────┴─────────────────┴────────────┴──────┴──────────┤  │
│                        │  │ Showing 1-10 of 234    〈 1 2 3 ... 24 〉            │  │
│                        │  └─────────────────────────────────────────────────────┘  │
└────────────────────────┴───────────────────────────────────────────────────────────┘
```

---

## 5. ANIMATIONS & INTERACTIONS

### 5.1 Page Transitions
```css
/* Fade + Slide Up */
@keyframes pageIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.page-content {
  animation: pageIn 0.3s ease-out;
}
```

### 5.2 Hover Effects
```css
/* Card Hover Lift */
.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
}

/* Button Press */
.btn:active {
  transform: scale(0.98);
}

/* Sidebar Item Hover */
.sidebar-item:hover {
  background: rgba(59, 130, 246, 0.1);
  color: var(--color-primary-600);
}
```

### 5.3 Loading States
```css
/* Skeleton Loading */
.skeleton {
  background: linear-gradient(
    90deg,
    var(--neutral-200) 25%,
    var(--neutral-100) 50%,
    var(--neutral-200) 75%
  );
  background-size: 200% 100%;
  animation: skeleton-loading 1.5s infinite;
}

/* Spinner */
.spinner {
  border: 3px solid var(--neutral-200);
  border-top-color: var(--color-primary-600);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
```

---

## 6. RESPONSIVE BREAKPOINTS

```css
/* Mobile First */
--breakpoint-sm: 640px   /* Phones */
--breakpoint-md: 768px   /* Tablets */
--breakpoint-lg: 1024px  /* Laptops */
--breakpoint-xl: 1280px  /* Desktops */
--breakpoint-2xl: 1536px /* Large screens */

/* Responsive Behavior */
Mobile:
- Hidden sidebar (hamburger menu)
- Stacked cards (1 column)
- Collapsible sections
- Bottom navigation

Tablet:
- Collapsible sidebar (icon only)
- 2 column grid
- Swipeable tables

Desktop:
- Fixed sidebar (full)
- 4 column grid
- Full features
```

---

## 7. IMPLEMENTATION PRIORITY

### Phase 1: Core Components
1. Update Tailwind config with new design tokens
2. Create Layout component (Sidebar + Header)
3. Update Button, Input, Card components
4. Create StatCard component

### Phase 2: Admin Pages
1. Dashboard - Update with new stat cards + charts
2. Books Management - New table design
3. Other management pages

### Phase 3: Student Pages
1. Student Dashboard
2. Profile page
3. Other student pages

### Phase 4: Public Pages
1. Login/Register - New modern design
2. Book list/detail

### Phase 5: Polish
1. Dark mode toggle
2. Animations
3. Micro-interactions
4. Performance optimization