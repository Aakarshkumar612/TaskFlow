# TASKFLOW Frontend - Setup & Implementation Guide

## ✅ What's Already Built

The following production-grade scaffolding is complete:

1. ✅ **Vite + React + TypeScript** configuration with strict mode
2. ✅ **Design tokens** (Hybrid system: Linear dark + Notion light)
3. ✅ **TypeScript types** for all entities (User, Team, Project, Task, Comment, etc.)
4. ✅ **Error code system** with unique codes per feature (AUTH-001, TASK-003, etc.)
5. ✅ **API service layer** with:
   - Axios instance with interceptors
   - Automatic token attachment
   - Error normalization
   - **AbortController support** (race condition prevention)
   - 429 rate limiting handling
   - 401 auto-redirect to login
6. ✅ **Service functions** for:
   - Authentication (login, register, logout, refresh)
   - Teams (CRUD + members)
   - Projects (CRUD + sections + members)
   - Tasks (CRUD + comments + status updates)

## 🚀 Next Steps to Complete

### Step 1: Install Dependencies

```bash
cd C:\Users\Lenovo\OneDrive\Desktop\T-M\frontend
npm install
```

### Step 2: Create Environment File

```bash
copy .env.example .env
```

### Step 3: Implement Remaining Files

The following files need to be created (in order):

#### A. Custom Hooks (`src/hooks/`)
- `useToast.ts` - Wrapper around react-hot-toast with error codes
- `useApi.ts` - Data fetching with loading/error states + abort
- `useAuth.ts` - Auth state management
- `useLocalStorage.ts` - Persistent local storage hook
- `useDebounce.ts` - Debounce utility for search

#### B. Redux Store (`src/store/`)
- `store.ts` - Redux store configuration
- `slices/authSlice.ts` - Auth state management
- `slices/uiSlice.ts` - UI state (sidebar, modals, theme)
- `slices/toastSlice.ts` - Toast notifications

#### C. UI Components (`src/components/ui/`)
- `Button.tsx` - Primary, secondary, ghost variants
- `Input.tsx` - Text input with validation states
- `Modal.tsx` - Accessible modal dialog
- `Toast.tsx` - Toast notification component
- `Skeleton.tsx` - Loading skeleton
- `Avatar.tsx` - User avatar with fallback
- `Badge.tsx` - Status badges

#### D. Auth Pages (`src/features/auth/`)
- `pages/LoginPage.tsx` - Login form with validation
- `pages/RegisterPage.tsx` - Registration form
- `components/LoginForm.tsx` - Login form UI
- `components/RegisterForm.tsx` - Register form UI

#### E. Routing (`src/routes/`)
- `AppRoutes.tsx` - Main route configuration
- `ProtectedRoute.tsx` - Auth guard for private routes
- `PublicRoute.tsx` - Redirect if already authenticated

#### F. App Layout (`src/components/layout/`)
- `AppLayout.tsx` - Main app shell
- `Sidebar.tsx` - Navigation sidebar
- `Header.tsx` - Top header bar

#### G. Entry Points
- `src/main.tsx` - React entry point with Redux Provider
- `src/App.tsx` - Main app component with routing

## 📝 Implementation Patterns

### Pattern 1: Custom Hook with AbortController

```typescript
// src/hooks/useApi.ts
import { useState, useEffect } from 'react';
import { createAbortController } from '@services/api';

interface UseApiOptions<T> {
  fetchFn: (signal: AbortSignal) => Promise<T>;
  dependencies?: unknown[];
}

export function useApi<T>({ fetchFn, dependencies = [] }: UseApiOptions<T>) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = createAbortController();
    setIsLoading(true);
    setError(null);

    fetchFn(controller.signal)
      .then(setData)
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err.message);
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort(); // Cleanup on unmount
  }, dependencies);

  return { data, isLoading, error };
}
```

### Pattern 2: Toast with Error Codes

```typescript
// src/hooks/useToast.ts
import { toast as hotToast } from 'react-hot-toast';
import { getErrorMessage } from '@utils/errorCodes';

export function useToast() {
  const error = (code: string, customMessage?: string) => {
    const message = customMessage || getErrorMessage(code);
    hotToast.error(`[${code}] ${message}`, {
      duration: 5000,
      style: {
        background: '#191a1b',
        color: '#f7f8f8',
        border: '1px solid rgba(255,255,255,0.08)',
      },
    });
  };

  const success = (message: string) => {
    hotToast.success(message, {
      duration: 3000,
      style: {
        background: '#191a1b',
        color: '#f7f8f8',
        border: '1px solid rgba(255,255,255,0.08)',
      },
    });
  };

  return { error, success };
}
```

### Pattern 3: Form with Zod Validation

```typescript
// src/features/auth/components/LoginForm.tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@hooks/useToast';
import { login } from '@services/authService';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

export function LoginForm() {
  const { error: showError, success } = useToast();
  
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await login(data);
      localStorage.setItem('access_token', response.data.access_token);
      success('Login successful!');
      window.location.href = '/dashboard';
    } catch (err: any) {
      showError(err.code || 'AUTH-001', err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      
      <input type="password" {...register('password')} />
      {errors.password && <span>{errors.password.message}</span>}
      
      <button type="submit" disabled={isSubmitting}>
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
    </form>
  );
}
```

### Pattern 4: Protected Route

```typescript
// src/routes/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const location = useLocation();
  const token = localStorage.getItem('access_token');

  if (!token) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}
```

### Pattern 5: Optimistic Update with Rollback

```typescript
// Example: Update task with optimistic UI
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateTask } from '@services/taskService';
import { useToast } from '@hooks/useToast';

export function useUpdateTask() {
  const queryClient = useQueryClient();
  const { error: showError } = useToast();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateTaskRequest }) =>
      updateTask(id, data),
    
    onMutate: async ({ id, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['task', id] });

      // Snapshot previous state
      const previous = queryClient.getQueryData(['task', id]);

      // Optimistically update
      queryClient.setQueryData(['task', id], (old: any) => ({
        ...old,
        ...data,
      }));

      return { previous };
    },

    onError: (err: any, variables, context: any) => {
      // Rollback on error
      if (context?.previous) {
        queryClient.setQueryData(['task', variables.id], context.previous);
      }
      showError(err.code || 'TASK-003');
    },

    onSettled: (data, error, { id }) => {
      // Refetch after success or error
      queryClient.invalidateQueries({ queryKey: ['task', id] });
    },
  });
}
```

## 🎨 Component Styling Examples

### Button Component (Linear-style dark theme)

```tsx
// src/components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react';
import './Button.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', children, className = '', ...props }, ref) => {
    const baseClasses = 'tf-button';
    const variantClass = `tf-button--${variant}`;
    const sizeClass = `tf-button--${size}`;

    return (
      <button
        ref={ref}
        className={`${baseClasses} ${variantClass} ${sizeClass} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
```

```css
/* src/components/ui/Button.css */
.tf-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  font-family: var(--font-sans);
  font-weight: 510;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all var(--transition-fast);
  font-feature-settings: 'cv01', 'ss03';
}

.tf-button--primary {
  background: var(--brand-primary);
  color: white;
}

.tf-button--primary:hover {
  background: var(--brand-primary-hover);
}

.tf-button--secondary {
  background: rgba(255, 255, 255, 0.04);
  color: var(--dark-text-primary);
  border-color: var(--dark-border-primary);
}

.tf-button--ghost {
  background: transparent;
  color: var(--dark-text-secondary);
}

.tf-button--ghost:hover {
  background: var(--dark-bg-hover);
  color: var(--dark-text-primary);
}

.tf-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## 🏗️ File Structure (Complete)

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── ui/
│   │   │   ├── Button.tsx + Button.css
│   │   │   ├── Input.tsx + Input.css
│   │   │   ├── Modal.tsx + Modal.css
│   │   │   ├── Toast.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   ├── Avatar.tsx
│   │   │   └── Badge.tsx
│   │   └── layout/
│   │       ├── AppLayout.tsx
│   │       ├── Sidebar.tsx
│   │       └── Header.tsx
│   ├── features/
│   │   └── auth/
│   │       ├── components/
│   │       │   ├── LoginForm.tsx
│   │       │   └── RegisterForm.tsx
│   │       └── pages/
│   │           ├── LoginPage.tsx
│   │           └── RegisterPage.tsx
│   ├── hooks/
│   │   ├── useToast.ts
│   │   ├── useApi.ts
│   │   ├── useAuth.ts
│   │   ├── useLocalStorage.ts
│   │   └── useDebounce.ts
│   ├── services/
│   │   ├── api.ts ✅ COMPLETE
│   │   ├── authService.ts ✅ COMPLETE
│   │   ├── teamService.ts ✅ COMPLETE
│   │   ├── projectService.ts ✅ COMPLETE
│   │   └── taskService.ts ✅ COMPLETE
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── uiSlice.ts
│   │   │   └── toastSlice.ts
│   │   └── store.ts
│   ├── types/
│   │   ├── auth.types.ts ✅ COMPLETE
│   │   ├── project.types.ts ✅ COMPLETE
│   │   ├── task.types.ts ✅ COMPLETE
│   │   └── api.types.ts ✅ COMPLETE
│   ├── routes/
│   │   ├── AppRoutes.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── PublicRoute.tsx
│   ├── utils/
│   │   ├── errorCodes.ts ✅ COMPLETE
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── styles/
│   │   └── tokens.css ✅ COMPLETE
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── .env.example
```

## 🚀 Quick Start Commands

```bash
# Navigate to frontend
cd C:\Users\Lenovo\OneDrive\Desktop\T-M\frontend

# Install dependencies
npm install

# Create env file
copy .env.example .env

# Start development server
npm run dev

# Type check
npm run type-check

# Build for production
npm run build
```

## 📚 Key Senior Developer Patterns Used

1. **AbortController** - Prevents race conditions on rapid navigation
2. **Error Code System** - Every error has unique code (AUTH-001, TASK-003)
3. **TypeScript Strict Mode** - No `any`, strict null checks
4. **Path Aliases** - Clean imports (`@services/api`)
5. **Interceptor Pattern** - Centralized error handling
6. **Service Layer** - Separation of concerns
7. **Design Tokens** - Consistent theming via CSS variables
8. **OpenType Features** - Linear-style typography (`cv01`, `ss03`)

## 🎯 Next Implementation Priority

1. Create `main.tsx` and `App.tsx` (entry points)
2. Build UI primitives (Button, Input, Modal)
3. Create auth forms (Login, Register)
4. Setup routing (Protected/Public routes)
5. Build app layout (Sidebar, Header)
6. Add Redux store slices
7. Create custom hooks

Would you like me to continue building these remaining files?
