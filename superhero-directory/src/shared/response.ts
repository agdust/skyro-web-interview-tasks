export type ResponseError = {
  response: 'error';
  error: string;
};

export type ResponseSuccess<T> = {
  response: 'success';
} & T;

export function isErrorResponse<SuccessT = unknown>(
  res: ResponseError | ResponseSuccess<SuccessT>
): res is ResponseError {
  return (
    'error' in res && typeof res.error === 'string' && res.error.length > 0
  );
}
