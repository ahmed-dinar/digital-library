import {coreAxios} from "@/api/axios";
import {ItemListDto, PageQueryDto} from "@/types/common.types";
import {BookDto, CreateBookDto} from "@/types/book.types";

/**
 * Get book list
 */
export const getBooks = async ({page, queryParams}: {
  page: PageQueryDto,
  queryParams?: string
}): Promise<ItemListDto<BookDto>> => {
  try {
    return (await coreAxios.get(`/books/list?page=${page.page}&limit=${page.limit}${queryParams ? ('&' + queryParams) : ''}`, {})).data;
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
