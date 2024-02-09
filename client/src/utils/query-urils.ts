import {BookQueryDto, BookQueryType} from "@/types/book.types";

/**
 * From query params to query strin
 * only supported queries will be converted
 *
 * @param queryParams
 * @param forListApi Include default sort if only for list api calls. Other calls like search book, do not include
 */
export const toQueryParams = (queryParams?: BookQueryDto[], forListApi?: boolean): string | null => {
  if (!queryParams || queryParams.length == 0) {
    return getQueryParam([getDefaultSortParam()]);
  }

  const sortExists = queryParams.some(q => q.type == BookQueryType.SORT);
  if (!forListApi || sortExists) {
    return getQueryParam(queryParams);
  }

  const params = [
    ...queryParams,
    getDefaultSortParam()
  ];

  return getQueryParam(params);
};

/**
 * Always sort by book created date if no sort param is provided
 */
function getDefaultSortParam(): BookQueryDto {
  return {
    key: 'sort',
    value: 'createdAt,desc',
    type: BookQueryType.SORT
  };
}

/**
 * To query string
 *
 * @param queryParams
 */
function getQueryParam(queryParams: BookQueryDto[]) {
  return queryParams
    .map((q) => `${encodeURIComponent(q.key)}=${encodeURIComponent(q.value)}`)
    .join('&');
}