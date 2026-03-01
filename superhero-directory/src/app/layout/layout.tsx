import { ReactNode } from 'react';

export function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="bg-green-800 py-4 text-white">
        <h1 className="text-center text-2xl font-bold">Superhero Directory</h1>
      </header>

      <main className="container mx-auto flex-grow p-4">{children}</main>

      <footer className="bg-gray-800 py-2 text-center text-white">
        <p>&copy; 2025 Superhero Directory. All rights reserved.</p>
      </footer>
    </div>
  );
}
