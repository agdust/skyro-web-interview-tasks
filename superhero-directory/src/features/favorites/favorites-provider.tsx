import { createContext, useContext, useEffect, useState } from 'react';

const FAVORITES_LS_KEY = 'superheroes_favorites';

type FavoritesState = {
  items: Record<string, boolean>;
  toggle: (id: string) => void;
};

const FavoritesContext = createContext<FavoritesState | null>(null);

const readFromLs = (): Record<string, boolean> => {
  try {
    const dataString = localStorage.getItem(FAVORITES_LS_KEY);
    return dataString === null ? {} : JSON.parse(dataString);
  } catch {
    return {};
  }
};

const writeToLs = (data: Record<string, boolean>): void => {
  localStorage.setItem(FAVORITES_LS_KEY, JSON.stringify(data));
};

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favorites, setFavorites] = useState<Record<string, boolean>>(readFromLs);

  useEffect(() => {
    writeToLs(favorites);
  }, [favorites]);

  const toggle = (id: string) => {
    setFavorites((prev) => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = true;
      }
      return next;
    });
  };

  return (
    <FavoritesContext.Provider value={{ items: favorites, toggle }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites(): FavoritesState {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
}
