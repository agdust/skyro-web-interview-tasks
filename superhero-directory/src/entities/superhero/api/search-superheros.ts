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
      ? async () => {
          const response = await fetch(
            `${config.apiHost}/api/${config.apiToken}/search/${encodeURIComponent(query)}`,
            {
              // FIXME: Как-будто гет запросу нужен Accept а не Content-Type?
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );

          // NOTE: я здесь убрал then, потому что смешивать его с async/await не оч хорошо.
          // Но в рамках этого МР не менял логику в get-superhero
          const responseJson: ResponseError | ResponseSuccess<ResponsePayload> =
            await response.json();

          if (response.ok) {
            // FIXME: здесь мы не бросаем исключение чтобы не триггерить ретраи, и вообще no found это не ошибка на самом деле.
            // Если мы можем повлиять на бэкенд то надо это изменить, не должно быть 200 и error: true
            //
            // Здесь мы считаем что строка это ошибка, а массив это успех. Фикс этого безобразия за рамками этого МР
            if (isErrorResponse(responseJson)) {
              return responseJson.error;
            }
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
