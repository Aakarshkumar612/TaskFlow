/**
 * App Layout Component
 * 
 * Main app shell with:
 * - Sidebar navigation
 * - Top header bar
 * - Main content area
 * - Task detail panel (slide-out)
 */

import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import './AppLayout.css';

export function AppLayout(): JSX.Element {
  return (
    <div className="tf-layout">
      <Sidebar />
      <div className="tf-layout__main">
        <Header />
        <main className="tf-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
