import { memo } from 'react';
import { Header } from './Header.jsx';

export const AppShell = memo(({ headerProps, children }) => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,#fff7ed_0,#f8f6f0_28rem,#eef2f0_100%)] text-zinc-950">
    <Header {...headerProps} />
    <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
      {children}
    </main>
  </div>
));

AppShell.displayName = 'AppShell';
