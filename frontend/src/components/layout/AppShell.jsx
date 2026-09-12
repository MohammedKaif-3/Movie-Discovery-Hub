import { memo } from 'react';
import { Header } from './Header.jsx';

export const AppShell = memo(({ headerProps, children }) => (
  <div className="app-bg min-h-screen overflow-x-hidden">
    <div className="cinema-grid" />
    <div className="light-sweep" />
    <div className="relative">
      <Header {...headerProps} />
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  </div>
));

AppShell.displayName = 'AppShell';
