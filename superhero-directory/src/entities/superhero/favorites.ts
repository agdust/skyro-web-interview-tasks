import { useCallback, useEffect, useState } from 'react';

const FAVORITES_LS_KEY = 'superheroes_favorites';

type SuperheroFavoritesRecord = Record<string, boolean>;

const readFromLs = (): SuperheroFavoritesRecord => {
  let data: SuperheroFavoritesRecord;
  try {
    const dataString = localStorage.getItem(FAVORITES_LS_KEY);
    data = dataString === null ? {} : JSON.parse(dataString);
  } catch {
    return {};
  }

  return data;
};

const writeToLs = (data: SuperheroFavoritesRecord): void => {
  localStorage.setItem(FAVORITES_LS_KEY, JSON.stringify(data));
};

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<SuperheroFavoritesRecord>(() =>
    readFromLs()
  );

  useEffect(() => {
    writeToLs(favorites);
  }, [favorites]);

  const add = useCallback(
    (newFavorite: string) => {
      setFavorites((curFavorites) => {
        return {
          ...curFavorites,
          [newFavorite]: true,
        };
      });
    },
    [setFavorites]
  );

  const remove = useCallback(
    (favoriteToRemove: string) => {
      setFavorites((curFavorites) => {
        const newFavorites = { ...curFavorites };
        delete newFavorites[favoriteToRemove];
        return newFavorites;
      });
    },
    [setFavorites]
  );

  const toggle = useCallback(
    (favoriteToToggle: string) => {
      if (favorites[favoriteToToggle]) {
        remove(favoriteToToggle);
      } else {
        add(favoriteToToggle);
      }
    },
    [favorites, remove, add]
  );

  return {
    items: favorites,
    add,
    remove,
    toggle,
  };
};
