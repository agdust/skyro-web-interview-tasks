import { Link } from 'react-router-dom';

import { ToggleFavorite } from '~features/toggle-favorite';

import type { Superhero } from '~entities/superhero';

type SearchCardProps = {
  superhero: Superhero;
};

export function SearchCard({ superhero }: SearchCardProps) {
  return (
    <li className="flex-col rounded-md border border-gray-500 p-6">
      <img
        src={superhero?.image?.url}
        alt={superhero?.name ?? ''}
        // NOTE: в апи супергероев много картинок из superherodb,
        // а там лимиты стоят, картинки часто не грузятся,
        // так что делаем фолбек покрасивее
        className="min-h-20 w-full bg-gray-100 p-4 text-center"
      />

      <div className="mt-4">
        <Link to={`/${superhero.id}`} className="text-2xl">
          {superhero.name}
        </Link>

        <ToggleFavorite superheroId={superhero.id} />
      </div>
    </li>
  );
}
