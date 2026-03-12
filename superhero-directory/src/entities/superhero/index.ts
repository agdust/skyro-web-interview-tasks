import { useSuperhero } from './api/get-superhero';
import { useSearchSuperheros } from './api/search-superheros';

export type { Superhero } from './superhero';

export const superheroApi = {
  useSuperhero,
  useSearchSuperheros,
};
