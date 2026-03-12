import { useParams } from 'react-router-dom';

import { useFavorites } from '~features/favorites';

import { superheroApi } from '~entities/superhero';

export function SuperheroPage() {
  const { id } = useParams();
  const favorites = useFavorites();
  const {
    data: superhero,
    isLoading,
    error,
  } = superheroApi.useSuperhero({ id });

  if (isLoading) {
    return <p className="text-center text-gray-500">Loading...</p>;
  }

  if (error || !superhero) {
    return (
      <p className="text-center text-red-500">Failed to load superhero data.</p>
    );
  }

  return (
    <article className="mx-auto rounded-md bg-white p-6 shadow-md">
      <header className="mb-6">
        <img
          src={superhero.image.url}
          alt={superhero.name}
          className="mx-auto mb-4 block rounded-md shadow-md"
        />

        <div className="mb-2 flex justify-center">
          <h1 className="text-center text-4xl font-bold">{superhero.name}</h1>

          <button
            type="button"
            className="ml-3 cursor-pointer text-3xl text-yellow-600"
            onClick={() => favorites.toggle(superhero.id)}
            aria-label={
              favorites.items[superhero.id]
                ? 'Remove from favorites'
                : 'Add to favorites'
            }
          >
            {favorites.items[superhero.id] ? '★' : '☆'}
          </button>
        </div>
        <p className="text-center text-gray-600">
          {superhero.biography['full-name']}
        </p>
      </header>
      <section className="mb-6">
        <h2 className="mb-2 text-2xl font-semibold">Powerstats</h2>
        <ul className="grid grid-cols-2 gap-4">
          {Object.entries(superhero.powerstats).map(([key, value]) => (
            <li key={key} className="flex justify-between">
              <span className="font-medium capitalize">{key}:</span>
              <span>{value}</span>
            </li>
          ))}
        </ul>
      </section>
      <section className="mb-6">
        <h2 className="mb-2 text-2xl font-semibold">Biography</h2>
        <p>
          <strong>Place of Birth:</strong>{' '}
          {superhero.biography['place-of-birth']}
        </p>
        <p>
          <strong>First Appearance:</strong>{' '}
          {superhero.biography['first-appearance']}
        </p>
        <p>
          <strong>Publisher:</strong> {superhero.biography.publisher}
        </p>
        <p>
          <strong>Alignment:</strong> {superhero.biography.alignment}
        </p>
      </section>
      <section className="mb-6">
        <h2 className="mb-2 text-2xl font-semibold">Appearance</h2>
        <p>
          <strong>Gender:</strong> {superhero.appearance.gender}
        </p>
        <p>
          <strong>Race:</strong> {superhero.appearance.race}
        </p>
        <p>
          <strong>Height:</strong> {superhero.appearance.height.join(' / ')}
        </p>
        <p>
          <strong>Weight:</strong> {superhero.appearance.weight.join(' / ')}
        </p>
        <p>
          <strong>Eye Color:</strong> {superhero.appearance['eye-color']}
        </p>
        <p>
          <strong>Hair Color:</strong> {superhero.appearance['hair-color']}
        </p>
      </section>
      <section className="mb-6">
        <h2 className="mb-2 text-2xl font-semibold">Work</h2>
        <p>
          <strong>Occupation:</strong> {superhero.work.occupation}
        </p>
        <p>
          <strong>Base:</strong> {superhero.work.base}
        </p>
      </section>
      <section className="mb-6">
        <h2 className="mb-2 text-2xl font-semibold">Connections</h2>
        <p>
          <strong>Group Affiliation:</strong>{' '}
          {superhero.connections['group-affiliation']}
        </p>
        <p>
          <strong>Relatives:</strong> {superhero.connections.relatives}
        </p>
      </section>
    </article>
  );
}
