export interface PaginationParams {
  page: number;
  limit: number;
  offset: number;
}

export function getPagination(query: any): PaginationParams {
  const page = Math.max(Number(query.page) || 1, 1);
  const limit = Math.max(Number(query.limit) || 10, 1);
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

export function buildPaginationResponse<T>(
  data: T[],
  total: number,
  page: number,
  limit: number
) {
  return {
    page,
    limit,
    total,
    totalPages: Math.ceil(total / limit),
    data,
  };
}