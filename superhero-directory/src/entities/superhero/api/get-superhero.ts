import { config } from '~shared/config';
import {
  isErrorResponse,
  ResponseError,
  ResponseSuccess,
} from '~shared/response';

import { skipToken, useQuery } from '@tanstack/react-query';

import { superheroKeys } from './keys';

import { Superhero } from '../superhero';

export type Params = {
  id?: string;
};

export function useSuperhero(params: Params) {
  const { id } = params;

  return useQuery({
    queryKey: superheroKeys.superhero(id ?? ''),
    queryFn: id
      ? async ({ signal }) => {
          const response = await fetch(
            `${config.apiHost}/api/${config.apiToken}/${id}`,
            {
              signal,
              headers: {
                Accept: 'application/json',
              },
            }
          );

          const responseJson: ResponseError | ResponseSuccess<Superhero> =
            await response.json();

          if (isErrorResponse(responseJson)) {
            throw new Error(responseJson.error);
          }

          if (response.ok) {
            return responseJson;
          }

          const errorMessage =
            'error' in responseJson ? responseJson.error : response.statusText;
          throw new Error(
            `Error ${response.status}: ${response.statusText} - ${errorMessage}`
          );
        }
      : skipToken,
  });
}
