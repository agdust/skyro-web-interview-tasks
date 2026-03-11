import { Link } from 'react-router-dom';

import { Superhero } from '~entities/superhero/superhero';

type SearchCardProps = {
  superhero: Superhero;
  isFavorite: boolean;
  onToggle: (id: string) => void;
};

function SearchCard({ superhero, isFavorite, onToggle }: SearchCardProps) {
  return (
    <li className="m-6 border border-gray-500">
      <img src={superhero.image.url} alt={superhero.name} />

      <Link to={`/${superhero.id}`} className="text-xl">
        {superhero.name}
      </Link>

      <button
        className="m-6"
        type="button"
        onClick={() => onToggle(superhero.id)}
      >
        {isFavorite ? 'Remove from favorites' : 'Add to favorites'}
      </button>
    </li>
  );
}

export default SearchCard;
