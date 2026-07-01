# HRMS Frontend

A responsive React frontend for the HR Management System with separate Employee and Admin portals.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 (Vite) |
| Routing | React Router DOM v6 |
| State Management | Zustand |
| Form Handling | React Hook Form |
| Validation | Zod |
| HTTP Client | Axios |
| Styling | Tailwind CSS |
| UI Components | Shadcn/ui |
| Icons | Lucide React |
| Toasts | Sonner |
| Date Formatting | date-fns |

---

## Project Structure

```
client/
├── src/
│   ├── api/
│   │   ├── axios.js                    # Axios instance + interceptors
│   │   ├── auth.api.js                 # login, logout, getMe
│   │   ├── employee.api.js             # CRUD + toggle + reset password
│   │   └── status.api.js               # status, EOD, admin stats
│   │
│   ├── components/
│   │   └── layout/
│   │       ├── EmployeeLayout.jsx      # Sidebar + outlet for employee portal
│   │       └── AdminLayout.jsx         # Sidebar + outlet for admin portal
│   │
│   ├── pages/
│   │   ├── auth/
│   │   │   └── LoginPage.jsx           # Single login page for both roles
│   │   ├── employee/
│   │   │   ├── EmployeeDashboard.jsx   # Profile card, status update, temp toggle
│   │   │   ├── StatusBoard.jsx         # Company-wide live status table
│   │   │   └── EODPage.jsx             # EOD submit form + timeline
│   │   ├── admin/
│   │   │   ├── AdminDashboard.jsx      # Stats overview cards
│   │   │   └── EmployeeManagement.jsx  # Full CRUD with search, filters, modals
│   │   ├── NotFound.jsx                # 404 page
│   │   └── Unauthorized.jsx            # 403 page
│   │
│   ├── routes/
│   │   ├── AppRouter.jsx               # All routes defined here
│   │   └── Guards.jsx                  # ProtectedRoute + PublicRoute
│   │
│   ├── schemas/
│   │   └── index.js                    # Zod schemas for all forms
│   │
│   ├── store/
│   │   └── authStore.js                # Zustand auth state
│   │
│   ├── App.jsx                         # Root — mounts router + toaster
│   └── main.jsx                        # React DOM root
│
├── .env
└── package.json
```

---

## Getting Started

### Prerequisites
- Node.js v18+
- Backend server running on `http://localhost:5000`

### Installation

```bash
cd client
npm install
```

### Environment Variables

Create a `.env` file in the root of the client folder:

```env
VITE_API_URL=http://localhost:5000/api
```

### Run the app

```bash
npm run dev
```

App runs at `http://localhost:5173`

---

## Dependencies

### Install all at once

```bash
npm install axios zustand react-router-dom react-hook-form @hookform/resolvers zod date-fns lucide-react sonner
```

### Shadcn setup

```bash
npx shadcn@latest init
```

When prompted:
- Style → **Default**
- Base color → **Slate**
- CSS variables → **Yes**

---

## Pages and Features

### Auth

**`/login`**
- Single login page for both admin and employee
- Redirects to `/admin/dashboard` or `/employee/dashboard` based on role
- Zod validation on email format and password length
- Error toast on invalid credentials

---

### Employee Portal

**`/employee/dashboard`**
- Displays employee profile — name, email, department, designation
- Current availability status badge
- Update status — Available, On Leave, Half Day Leave
- Temporary unavailability toggle (ON/OFF switch)
- Changes reflect immediately via `refreshUser`

**`/employee/status`**
- Company-wide status board table
- Shows all employees with name, status, temporary toggle, last updated time
- Auto-refreshes every 5 seconds
- Manual refresh button

**`/employee/eod`**
- EOD submission form — restricted to 6:00 PM – 9:00 PM
- Outside window — textarea and submit button are disabled with explanation message
- One submission per employee per day enforced by backend
- Full EOD timeline below the form in reverse chronological order

---

### Admin Portal

**`/admin/dashboard`**
- Stats cards showing:
  - Total Employees
  - Available
  - On Leave
  - Half Day
  - Temporarily Unavailable
  - EOD Submitted Today
  - EOD Pending

**`/admin/employees`**
- Full employee table with search and filters
- Search by name, email, or department
- Filter by status — Available, On Leave, Half Day
- Filter by account status — Active, Inactive
- Debounced search (300ms)
- Actions per row:
  - Edit employee details
  - Activate / Deactivate account
  - Reset password
  - Delete employee
- All actions use modal dialogs
- Confirmation modal before delete

---

## Auth Flow

```
App mounts
  → fetchMe() called once via useAuthStore.getState()
  → GET /api/auth/me
  → Success: user stored in Zustand, isAuthenticated = true
  → Fail (401): isAuthenticated = false, isLoading = false

Guards check isLoading first
  → If true: show spinner
  → If false and not authenticated: redirect to /login
  → If false and wrong role: redirect to /unauthorized
  → If false and correct role: render page
```

---

## Route Structure

| Path | Access | Page |
|---|---|---|
| `/login` | Public only | LoginPage |
| `/employee/dashboard` | Employee only | EmployeeDashboard |
| `/employee/status` | Employee only | StatusBoard |
| `/employee/eod` | Employee only | EODPage |
| `/admin/dashboard` | Admin only | AdminDashboard |
| `/admin/employees` | Admin only | EmployeeManagement |
| `/unauthorized` | Any | Unauthorized |
| `*` | Any | NotFound |

---

## State Management

Zustand store — `authStore.js`

| State | Type | Description |
|---|---|---|
| `user` | Object | Current logged in user |
| `isAuthenticated` | Boolean | Auth status |
| `isLoading` | Boolean | Initial auth check in progress |
| `hasInitialized` | Boolean | Prevents duplicate fetchMe calls |

| Action | Description |
|---|---|
| `login(credentials)` | POST /auth/login, stores user |
| `logout()` | POST /auth/logout, clears user |
| `fetchMe()` | GET /auth/me, runs once on app mount |
| `refreshUser()` | GET /auth/me, runs after status updates |

---

## Form Validation

All forms use React Hook Form + Zod resolvers.

| Schema | Used In |
|---|---|
| `loginSchema` | LoginPage |
| `createEmployeeSchema` | Create Employee Modal |
| `updateEmployeeSchema` | Edit Employee Modal |
| `resetPasswordSchema` | Reset Password Modal |
| `eodSchema` | EOD Submit Form |

---

## API Layer

All API calls go through a single Axios instance (`api/axios.js`) with:
- `baseURL` from `VITE_API_URL` env variable
- `withCredentials: true` — sends httpOnly cookies automatically
- Response interceptor — redirects to `/login` on 401, except for `/auth/me` which handles 401 silently

---

## Key Design Decisions

**Single login page** — one `/login` route handles both admin and employee. Role from JWT determines redirect target.

**httpOnly cookies** — auth token is never accessible to JavaScript. All requests include credentials automatically via `withCredentials: true`.

**Zustand over Redux** — simpler API, no boilerplate, sufficient for this app's state needs.

**No websockets** — status board uses polling every 5 seconds. Simple and sufficient for this use case.

**Route guards on both sides** — frontend guards prevent wrong-role access. Backend middleware enforces the same rules independently.

**EOD window enforced twice** — frontend disables the form outside 6-9 PM. Backend rejects requests outside the window regardless.
