import { ChangeEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useFavorites } from '~features/favorites';

import { superheroApi } from '~entities/superhero';

import { debounce } from '~shared/debounce';

import SearchCard from './search-card';

const searchParamId = 'search';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get(searchParamId) ?? '';

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

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    debouncedSetQuery(event.target.value.trim());
  };

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
          onChange={onChange}
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

      {Array.isArray(searchResult) && searchResult.length > 0 && (
        <ul className="mt-4 grid grid-cols-4 justify-between gap-4">
          {searchResult.map((superhero) => (
            <SearchCard
              key={superhero.id}
              superhero={superhero}
              isFavorite={favorites.items[superhero.id]}
              onToggle={() => {
                favorites.toggle(superhero.id);
              }}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

export default Search;
