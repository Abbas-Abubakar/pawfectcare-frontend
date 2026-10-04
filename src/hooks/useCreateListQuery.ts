import { useQuery, type UseQueryOptions } from '@tanstack/react-query';

export function createListQuery<TParams, TResponse>(
  baseKey: readonly unknown[],
  fetchFn: (params: TParams) => Promise<TResponse>,
  getOptions?: (params: TParams) => Partial<UseQueryOptions<TResponse>>
) {
  return (params: TParams) =>
    useQuery({
      queryKey: [...baseKey, params] as const,
      queryFn: () => fetchFn(params),
      ...(getOptions ? getOptions(params) : {}),
    });
}