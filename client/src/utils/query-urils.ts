import {BookQueryDto} from "@/types/book.types";

export const toQueryParams = (queryParams?: BookQueryDto[]): string | null => {
  if (!queryParams || queryParams.length == 0) {
    return null;
  }
  return queryParams
    .map((q) => `${encodeURIComponent(q.key)}=${encodeURIComponent(q.value)}`)
    .join('&');
};
