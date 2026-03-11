import { ChangeEvent, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { superheroApi } from '~entities/superhero';
import { useFavorites } from '~entities/superhero/favorites';

import { debounce } from '~shared/debounce';

import SearchCard from './search-card';

const searchParamId = 'search';

function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get(searchParamId) ?? '';

  const favorites = useFavorites();

  console.log('favorites', favorites.items, favorites);

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
          (prev) => {
            if (value) {
              prev.set(searchParamId, value);
            } else {
              prev.delete(searchParamId);
            }
            return prev;
          },
          { replace: true }
        );
      }),
    // NOTE: setSearchParams не обязательно трекать, это функция
    [] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const onChange = (event: ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    debouncedSetQuery(event.target.value);
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

      {/* NOTE: Тут дженерик внутренняя ошибка, саму её мы пользователю не показываем */}
      {error && (
        <div className="error color-red">
          Something went wrong, please try again later
        </div>
      )}

      {/* NOTE: А тут бизнесовая ошибка, её нужно вывести в интерфейс */}
      {typeof searchResult === 'string' && (
        <div className="color-gray-800 text-xl">{searchResult}</div>
      )}

      {isLoading && <div className="loader">Loading...</div>}

      {/* NOTE: Здесь мы полагаемся на логику бека что когда ничего не найдено то
            прилетает ошибка а не пустой массив, поэтому проверку на длину не делаем
      */}
      {Array.isArray(searchResult) && (
        <div className="mt-4">
          <div>Results</div>
          <ul className="mt-2">
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
        </div>
      )}
    </div>
  );
}

export default Search;
