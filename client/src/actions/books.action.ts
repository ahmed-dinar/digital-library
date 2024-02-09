import {coreAxios} from "@/api/axios";
import {ItemListDto, PageQueryDto} from "@/types/common.types";
import {BookDto, BookQueryDto, CreateBookDto} from "@/types/book.types";
import {toQueryParams} from "@/utils/query-urils";

/**
 * Get book list
 */
export const getBooks = async ({page, queryParams}: {
  page: PageQueryDto,
  queryParams?: BookQueryDto[]
}): Promise<ItemListDto<BookDto>> => {
  let params = toQueryParams(queryParams, true);

  try {
    return (await coreAxios.get(`/books/list?page=${page.page}&limit=${page.limit}${params ? ('&' + params) : ''}`, {})).data;
  } catch (ex: any) {
    throw ex;
  }
};

/**
 *
 * @param book
 */
export const createBook = async (book: CreateBookDto): Promise<BookDto> => {
  try {
    return (await coreAxios.post('/books', book)).data;
  } catch (ex: any) {
    throw ex;
  }
};

/**
 *
 * @param bookId
 */
export const getBookById = async (bookId: string): Promise<BookDto> => {
  try {
    return (await coreAxios.get(`/books/${bookId}`)).data;
  } catch (ex: any) {
    throw ex;
  }
};

/**
 *
 * @param id
 * @param book
 */
export const updateBook = async (id: number, book: Partial<CreateBookDto>): Promise<BookDto> => {
  try {
    return (await coreAxios.patch(`/books/${id}`, book)).data;
  } catch (ex: any) {
    throw ex;
  }
};

/**
 *
 * @param id
 */
export const deleteBook = async (id: number): Promise<void> => {
  try {
    await coreAxios.delete(`/books/${id}`);
  } catch (ex: any) {
    throw ex;
  }
};

/**
 *
 * @param id
 */
export const seedBook = async (): Promise<void> => {
  try {
    await coreAxios.post(`/books/seed`, {});
  } catch (ex: any) {
    throw ex;
  }
};


/**
 *
 * @param id
 */
export const clearBookSeed = async (): Promise<void> => {
  try {
    await coreAxios.post(`/books/seed/clear`, {});
  } catch (ex: any) {
    throw ex;
  }
};
