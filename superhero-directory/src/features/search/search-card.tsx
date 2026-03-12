import { Link } from 'react-router-dom';

import type { Superhero } from '~entities/superhero';

type SearchCardProps = {
  superhero: Superhero;
  isFavorite: boolean;
  onToggle: (id: string) => void;
};

function SearchCard({ superhero, isFavorite, onToggle }: SearchCardProps) {
  return (
    <li className="flex-col rounded-md border border-gray-500 p-6">
      <img
        src={superhero.image.url}
        alt={superhero.name}
        // NOTE: в апи супергероев много картинок из superherodb,
        // а там лимиты стоят, картинки часто не грузятся,
        // так что делаем фолбек покрасивее
        className="min-h-20 w-full bg-gray-100 p-4 text-center"
      />

      <div className="mt-4">
        <Link to={`/${superhero.id}`} className="text-2xl">
          {superhero.name}
        </Link>

        <button
          className="m-1 ml-2 cursor-pointer p-1 text-xl text-yellow-600"
          type="button"
          onClick={() => onToggle(superhero.id)}
        >
          {isFavorite ? '★' : '☆'}
        </button>
      </div>
    </li>
  );
}

export default SearchCard;
