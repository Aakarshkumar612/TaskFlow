/**
 * TASKFLOW Frontend Entry Point
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { AuthProvider } from '@components/auth/AuthProvider';
import { store } from '@store/store';
import '@styles/tokens.css';
import './index.css';

// Clerk publishable key
const clerkPublishableKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPublishableKey) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY environment variable');
}

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

// Auth initialization is handled by useAuth hook
// which reads from localStorage and auto-provisions demo user

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ClerkProvider publishableKey={clerkPublishableKey}>
      <AuthProvider>
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <BrowserRouter>
              <App />
              <Toaster
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#191a1b',
                  color: '#f7f8f8',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: 510,
                },
              }}
            />
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </AuthProvider>
    </ClerkProvider>
  </React.StrictMode>,
);
