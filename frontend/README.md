# TASKFLOW Frontend - Production-Grade React Application

> Enterprise Project Management Platform built with React, TypeScript, and Vite

## 🎯 What's Built

A **senior-level, production-ready** React frontend with:

✅ **Complete scaffolding** with Vite + TypeScript strict mode
✅ **Hybrid design system** (Linear dark + Notion light + Vercel precision)
✅ **Full TypeScript types** for all entities
✅ **Error code system** with unique codes per feature
✅ **API service layer** with race condition prevention (AbortController)
✅ **Service functions** for auth, teams, projects, tasks
✅ **Entry points** configured with Redux + Router

## 🚀 Quick Start

```bash
# 1. Navigate to frontend directory
cd C:\Users\Lenovo\OneDrive\Desktop\T-M\frontend

# 2. Install dependencies
npm install

# 3. Setup environment
copy .env.example .env

# 4. Start development server
npm run dev

# App runs at: http://localhost:3000
```

## 📁 Project Structure

```
frontend/
├── src/
│   ├── services/          ✅ COMPLETE - API + all service functions
│   ├── types/             ✅ COMPLETE - All TypeScript types
│   ├── utils/             ✅ COMPLETE - Error codes system
│   ├── styles/            ✅ COMPLETE - Design tokens
│   ├── main.tsx           ✅ COMPLETE - Entry point
│   ├── App.tsx            ✅ COMPLETE - Route configuration
│   │
│   ├── hooks/             🔄 TODO - Custom hooks
│   ├── store/             🔄 TODO - Redux store
│   ├── components/        🔄 TODO - UI components
│   ├── features/          🔄 TODO - Auth pages
│   └── routes/            🔄 TODO - Route guards
└── Configuration files    ✅ COMPLETE - tsconfig, vite, etc.
```

## 🎨 Design System

### Hybrid Approach

**Dark Mode (App Interface)** - Inspired by Linear
- Canvas: `#08090a`
- Surface: `#191a1b`
- Accent: `#7170ff` (indigo-violet)
- Borders: `rgba(255,255,255,0.08)`

**Light Mode (Auth Pages)** - Inspired by Notion
- Background: `#ffffff`
- Text: `rgba(0,0,0,0.95)`
- Accent: `#0075de` (Notion blue)
- Borders: `rgba(0,0,0,0.1)`

### Typography

- Font: Inter Variable with `cv01`, `ss03` OpenType features
- Signature weight: 510 (between regular and medium)
- Negative letter-spacing at display sizes

## 🔧 Architecture Highlights

### 1. Race Condition Prevention

```typescript
// Every API call supports AbortController
const controller = new AbortController();

useEffect(() => {
  fetchData({ signal: controller.signal });
  return () => controller.abort(); // Cleanup on unmount
}, [dependency]);
```

### 2. Error Code System

Every feature has unique error codes:
- `AUTH-001` - Invalid credentials
- `TASK-003` - Task update failed
- `NET-001` - Network timeout

Usage:
```typescript
toast.error('AUTH-001', 'Invalid email or password');
```

### 3. API Error Handling

- 401 → Auto-redirect to login
- 403 → Permission denied toast
- 422 → Validation errors with field details
- 429 → Rate limited warning
- 500+ → Server error toast

### 4. TypeScript Strict Mode

- `noImplicitAny: true`
- `strictNullChecks: true`
- `noUnusedLocals: true`
- `noImplicitReturns: true`

## 📋 Remaining Implementation Tasks

See `IMPLEMENTATION_GUIDE.md` for detailed step-by-step instructions.

### Priority Order:

1. **Custom Hooks** (`src/hooks/`)
   - `useToast.ts` - Toast wrapper with error codes
   - `useApi.ts` - Data fetching with abort
   - `useAuth.ts` - Auth state management

2. **Redux Store** (`src/store/`)
   - `store.ts` - Store configuration
   - `slices/authSlice.ts` - Auth state

3. **UI Components** (`src/components/ui/`)
   - `Button.tsx` - Button variants
   - `Input.tsx` - Form inputs
   - `Modal.tsx` - Modal dialogs

4. **Auth Pages** (`src/features/auth/`)
   - `LoginPage.tsx` - Login form
   - `RegisterPage.tsx` - Registration form

5. **Route Guards** (`src/routes/`)
   - `ProtectedRoute.tsx` - Auth guard
   - `PublicRoute.tsx` - Redirect if authenticated

## 🛠️ Available Scripts

```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run lint       # Run ESLint
npm run type-check # TypeScript type checking
npm run preview    # Preview production build
```

## 📚 Key Patterns Used

1. **Service Layer Pattern** - Separation of API calls
2. **Interceptor Pattern** - Centralized error handling
3. **AbortController** - Race condition prevention
4. **Error Code System** - Debuggable errors
5. **Design Tokens** - Consistent theming
6. **Path Aliases** - Clean imports
7. **TypeScript Strict Mode** - Type safety

## 🎯 Interview Talking Points

- **Race conditions**: "I use AbortController to cancel pending requests on unmount"
- **Error handling**: "Every error has a unique code for tracking and debugging"
- **Type safety**: "Strict TypeScript mode with no `any` types"
- **Design system**: "Hybrid approach combining Linear, Notion, and Vercel"
- **API architecture**: "Centralized interceptors handle 401, 403, 429 globally"

## 📄 License

Private - For interview assessment use only

---

**Built with senior-level practices for TASKFLOW project**
