import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

/**
 * Any API returns list with pagination, use this format
 */
export interface ItemListDto<T> {
  pagination: PaginationDto;
  items: T[];
}

export class PaginationDto {
  page: number;
  limit: number;
  totalItems: number;
  hasPrevious: boolean;
  hasNext: boolean;

  constructor(page: number, limit: number, totalItems: number) {
    this.page = page;
    this.limit = limit;
    this.totalItems = totalItems;
    this.hasPrevious = page > 1;
    this.hasNext = page * limit < totalItems;
  }

  static of(page: number, limit: number, totalItems: number): PaginationDto {
    return new PaginationDto(page, limit, totalItems);
  }

  static ofPage(pageDto: PageQueryDto, totalItems: number): PaginationDto {
    return this.of(pageDto.page, pageDto.limit, totalItems);
  }
}

/**
 * Query params of format: sort=title,desc&sort=date,asc
 * property=title, direction=desc
 */
export class SortOptionDto {
  @IsString()
  readonly property: string;

  @IsString()
  @IsIn(['asc', 'desc'])
  readonly direction: string;

  // Helper method to parse array into SortOptionDto array
  static parseFromArray(arr: string[]): SortOptionDto[] {
    return arr.map((item) => {
      const [property, direction] = item.split(',');
      return { property, direction };
    });
  }

  static parseFromString(param: string): SortOptionDto {
    const [property, direction] = param.split(',');
    return { property, direction };
  }
}

/**
 * Query params of format: sort=title,desc&sort=date,asc
 */
export class SortDto {
  @IsOptional()
  _sort: SortOptionDto[] = [];

  public get sort() {
    return this._sort;
  }

  // Transform the sort parameter into an array of SortOptionDto
  @IsOptional()
  set sort(sortArray: any) {
    this._sort = Array.isArray(sortArray)
      ? SortOptionDto.parseFromArray(sortArray as any)
      : [SortOptionDto.parseFromString(sortArray)];
  }
}

export class PageQueryDto {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @Type(() => Number)
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5000)
  limit: number = 10;
}
