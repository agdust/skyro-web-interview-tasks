import { config } from '~shared/config';
import {
  isErrorResponse,
  ResponseError,
  ResponseSuccess,
} from '~shared/response';

import { skipToken, useQuery } from '@tanstack/react-query';

import { superheroKeys } from './keys';

import { Superhero } from '../superhero';

type ResponsePayload = {
  'results-for': string;
  results: Superhero[];
};

export type Params = {
  query: string;
};

export function useSearchSuperheros(params: Params) {
  const { query } = params;

  const queryExists = typeof query === 'string' && query.length > 0;

  // Method documentation: https://superheroapi.com/#name
  // Example call: GET https://superheroapi.com/api/${access-token}/search/${superhero-name}
  return useQuery({
    queryKey: superheroKeys.search(query),
    queryFn: queryExists
      ? async ({ signal }) => {
          const response = await fetch(
            `${config.apiHost}/api/${config.apiToken}/search/${encodeURIComponent(query)}`,
            {
              signal,
              headers: {
                Accept: 'application/json',
              },
            }
          );

          const responseJson: ResponseError | ResponseSuccess<ResponsePayload> =
            await response.json();

          if (isErrorResponse(responseJson)) {
            // NOTE: фиксим косяк бэкенда, который отдаёт error когда ничего не найдено.
            // Так как нет отдельного поля для errorCode, приходится завязываться на текст ошибки,
            // чтобы отличить NotFound от _реальных_ ошибок.
            if (responseJson.error === 'character with given name not found') {
              return [];
            }
            throw new Error(responseJson.error);
          }

          if (response.ok) {
            return responseJson.results;
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
