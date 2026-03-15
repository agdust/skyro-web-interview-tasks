import { useFavorites } from '~entities/favorites';

type Props = {
  superheroId: string;
};

export function ToggleFavorite({ superheroId }: Props) {
  const favorites = useFavorites();

  return (
    <button
      type="button"
      className="ml-3 cursor-pointer text-2xl text-yellow-600"
      onClick={() => favorites.toggle(superheroId)}
      aria-label={
        favorites.items[superheroId]
          ? 'Remove from favorites'
          : 'Add to favorites'
      }
    >
      {favorites.items[superheroId] ? '★' : '☆'}
    </button>
  );
}
