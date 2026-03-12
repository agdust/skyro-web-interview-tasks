import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { SuperheroPage } from '~pages/superhero/superhero-page';

import { Search } from '~widgets/search';

import { Layout } from './app/layout/layout';
import { Providers } from './app/providers';
import './root.css';

function App() {
  return (
    <Providers>
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route
              path="/"
              element={
                <>
                  <h1 className="font-display text-center text-4xl">
                    Superhero Directory
                  </h1>
                  <p className="mt-2">
                    Welcome to the Superhero Directory! Here you can find
                    information about your favorite superheroes.
                  </p>

                  <Search />
                </>
              }
            />
            <Route path=":id" element={<SuperheroPage />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </Providers>
  );
}

export default App;

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Root element with id 'root' not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
