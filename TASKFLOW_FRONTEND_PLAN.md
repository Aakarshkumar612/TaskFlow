# TASKFLOW Frontend Implementation Plan

## Architecture Decisions

### Design System Synthesis
We'll combine the best of Linear, Notion, and Vercel:

**From Linear (Primary Inspiration):**
- Dark-mode-first interface (`#08090a` canvas)
- Inter Variable with `cv01`, `ss03` OpenType features
- Signature weight 510 for UI text
- Indigo-violet accent (`#7170ff`)
- Semi-transparent white borders (`rgba(255,255,255,0.08)`)
- Luminance-based elevation system

**From Vercel (Component Architecture):**
- Shadow-as-border technique
- Multi-layer shadow stacks
- Geist-inspired spacing precision
- Focus ring system

**From Notion (Onboarding/Light Pages):**
- Warm neutral palette for login/register
- Whisper borders (`1px solid rgba(0,0,0,0.1)`)
- Approachable minimalism

### Code Quality Standards
- **TypeScript strict mode** with no `any` types
- **Custom hooks** for all shared logic (useToast, useAuth, useApi)
- **Error boundary** wrappers with recovery
- **AbortController** for all API calls (race condition prevention)
- **Optimistic updates** with rollback on failure
- **Unique error codes** per feature (e.g., `AUTH-001`, `TASK-003`)
- **JSDoc comments** on all public APIs
- **React.memo** where measurable performance benefit
- **useCallback/useMemo** to prevent unnecessary re-renders

## Project Structure

```
frontend/
├── public/
│   └── favicon.svg
├── src/
│   ├── assets/
│   │   ├── fonts/
│   │   └── icons/
│   ├── components/
│   │   ├── ui/                    # Primitive UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   ├── Skeleton.tsx
│   │   │   └── Toast.tsx
│   │   └── layout/
│   │       ├── AppLayout.tsx
│   │       ├── Sidebar.tsx
│   │       ├── Header.tsx
│   │       └── TaskDetailPanel.tsx
│   ├── features/
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── ForgotPasswordForm.tsx
│   │   │   ├── hooks/
│   │   │   │   └── useAuth.ts
│   │   │   └── pages/
│   │   │       ├── LoginPage.tsx
│   │   │       └── RegisterPage.tsx
│   │   ├── teams/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── pages/
│   │   ├── projects/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   └── pages/
│   │   └── tasks/
│   │       ├── components/
│   │       ├── hooks/
│   │       └── pages/
│   ├── hooks/
│   │   ├── useToast.ts
│   │   ├── useApi.ts
│   │   ├── useLocalStorage.ts
│   │   └── useDebounce.ts
│   ├── services/
│   │   ├── api.ts                 # Axios instance
│   │   ├── authService.ts
│   │   ├── teamService.ts
│   │   ├── projectService.ts
│   │   └── taskService.ts
│   ├── store/
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── uiSlice.ts
│   │   │   └── toastSlice.ts
│   │   └── store.ts
│   ├── types/
│   │   ├── auth.types.ts
│   │   ├── team.types.ts
│   │   ├── project.types.ts
│   │   ├── task.types.ts
│   │   └── api.types.ts
│   ├── routes/
│   │   ├── AppRoutes.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── PublicRoute.tsx
│   ├── utils/
│   │   ├── errorCodes.ts
│   │   ├── formatters.ts
│   │   └── validators.ts
│   ├── styles/
│   │   ├── globals.css
│   │   ├── theme.ts
│   │   └── tokens.css
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
└── .env.example
```

## Implementation Order

### Phase 1: Foundation (Week 1)
1. Vite + React + TypeScript setup
2. Design tokens (CSS variables)
3. UI primitive components (Button, Input, Modal, Toast)
4. Custom hooks (useToast, useApi, useAuth)
5. Auth forms (Login, Register)
6. Protected routes
7. Main app layout (Sidebar + Header)

### Phase 2: Teams & Projects (Week 2)
1. Team CRUD pages
2. Project CRUD pages
3. Member management UI
4. Error handling & loading states

### Phase 3: Tasks (Week 3)
1. Task list view
2. Task creation/editing
3. Task detail panel
4. Assignment & status updates

### Phase 4: Board View + Real-Time (Week 4)
1. Kanban board with drag-drop
2. Socket.IO integration
3. Real-time updates
4. Notifications

## Key Technical Decisions

### 1. Toast System with Error Codes
```typescript
// Every error has a unique code for debugging
const toast = useToast();

try {
  await login(email, password);
} catch (error) {
  toast.error('AUTH-001', error.message);
}
```

### 2. API Service with AbortController
```typescript
// Prevents race conditions on rapid navigation
const { data, abort } = useApi('/tasks', { projectId });

useEffect(() => {
  return () => abort(); // Cleanup on unmount
}, [projectId]);
```

### 3. Optimistic Updates
```typescript
// Update UI immediately, rollback on failure
const updateTask = async (id: string, data: TaskUpdate) => {
  const previous = queryClient.getQueryData(['task', id]);
  queryClient.setQueryData(['task', id], { ...previous, ...data });
  
  try {
    await api.updateTask(id, data);
  } catch (error) {
    queryClient.setQueryData(['task', id], previous); // Rollback
    toast.error('TASK-003', 'Failed to update task');
  }
};
```

### 4. Error Boundary
```typescript
// Catches rendering errors, shows recovery UI
<ErrorBoundary fallback={<ErrorRecovery />}>
  <TaskBoard />
</ErrorBoundary>
```

## Next Steps

Ready to implement. Which component should I build first?

1. **Design tokens + UI primitives** (Button, Input, Modal, Toast)
2. **Auth system** (Login/Register forms + hooks)
3. **Complete scaffolding** (All folders + TypeScript config)

Let me know and I'll start coding!
