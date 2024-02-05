export interface PageQueryDto {
  page: number,
  limit: number,
}

export interface PaginationDto {
  page: number;
  limit: number;
  totalItems: number;
  hasPrevious: boolean;
  hasNext: boolean;
}

export interface ItemListDto<T> {
  pagination: PaginationDto;
  items: T[];
}

export interface SortOptionDto {
  property: string;
  direction: string;
}