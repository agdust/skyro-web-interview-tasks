import { ChangeEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useFavorites } from '~features/favorites';

import { superheroApi } from '~entities/superhero';

import { LS_PREFIX } from '~shared/consts';
import { debounce } from '~shared/debounce';

import { SearchCard } from './search-card';

const searchParamId = 'search';

// NOTE: пишем в LS а не в урл чтобы консистентно
// работало вне зависимости от навигации
const ONLY_FAVORITES_LS_KEY = `${LS_PREFIX}only-favorites`;

const writeOnlyFavoritesToLs = (newValue: boolean) => {
  localStorage.setItem(ONLY_FAVORITES_LS_KEY, newValue.toString());
};

const readOnlyFavoritesFromLs = (): boolean => {
  return localStorage.getItem(ONLY_FAVORITES_LS_KEY) === 'true';
};

export function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get(searchParamId) ?? '';

  const [onlyFavorites, setOnlyFavorites] = useState(readOnlyFavoritesFromLs);

  const favorites = useFavorites();

  const [inputValue, setInputValue] = useState<string>(initialQuery);
  const [query, setQuery] = useState<string>(initialQuery);

  const {
    data: searchResult,
    isLoading,
    error,
  } = superheroApi.useSearchSuperheros({ query });

  const debouncedSetQuery = useMemo(
    () =>
      debounce((value: string) => {
        setQuery(value);
        setSearchParams(
          (curParams) => {
            const newParams = new URLSearchParams(curParams);
            if (value) {
              newParams.set(searchParamId, value);
            } else {
              newParams.delete(searchParamId);
            }
            return newParams;
          },
          { replace: true }
        );
      }),
    // NOTE: setSearchParams не стабильна: https://github.com/remix-run/react-router/issues/9991
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const onSearchChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    debouncedSetQuery(event.target.value.trim());
  };

  const onOnlyFavoritesChange = (event: ChangeEvent<HTMLInputElement>) => {
    setOnlyFavorites(event.target.checked);
    writeOnlyFavoritesToLs(event.target.checked);
  };

  const heroesToShow = useMemo(() => {
    if (!Array.isArray(searchResult)) return searchResult;
    if (!onlyFavorites) return searchResult;

    return searchResult.filter((hero) => hero.id in favorites.items);
  }, [onlyFavorites, searchResult, favorites]);

  return (
    <div className="mt-6">
      <label>
        <div className="font-display text-2xl">Search for superheroes</div>
        <input
          type="text"
          role="search"
          name="search"
          value={inputValue}
          className="border-grey-700 mt-2 rounded-sm border-2"
          onChange={onSearchChange}
        />
      </label>

      {error && (
        <div className="error color-red">
          Something went wrong, please try again later
        </div>
      )}

      {isLoading && <div className="mt-4 text-2xl">Loading...</div>}

      {Array.isArray(searchResult) && searchResult.length === 0 && (
        <div className="mt-4 text-2xl text-red-900">
          No superheroes found :(
        </div>
      )}

      {Array.isArray(heroesToShow) &&
        Array.isArray(searchResult) &&
        searchResult.length > 0 && (
          <div className="mt-4">
            <label>
              <input
                type="checkbox"
                name="only-favorites"
                checked={onlyFavorites}
                onChange={onOnlyFavoritesChange}
              />
              <span className="ml-2">Only favorites</span>
            </label>

            {onlyFavorites && heroesToShow.length === 0 && (
              <div className="mt-4 text-2xl text-red-900">
                No favorite superheroes with this name found :(
              </div>
            )}

            {heroesToShow.length > 0 && (
              <ul className="mt-4 grid grid-cols-4 gap-4">
                {heroesToShow.map((superhero) => (
                  <SearchCard key={superhero.id} superhero={superhero} />
                ))}
              </ul>
            )}
          </div>
        )}
    </div>
  );
}
