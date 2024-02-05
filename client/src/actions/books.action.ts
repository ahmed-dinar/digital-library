import {coreAxios} from "@/api/axios";
import {ItemListDto, PageQueryDto, SortOptionDto} from "@/types/common.types";
import {BookDto, BookFilterDto, CreateBookDto} from "@/types/book.types";

/**
 * Get book list
 */
export const getBooks = async ({page, filters, sort}: {
  page: PageQueryDto,
  filters?: BookFilterDto,
  sort?: SortOptionDto[]
}): Promise<ItemListDto<BookDto>> => {
  const params = {
    ...page,
    ...(filters && Object.fromEntries(
      Object.entries(filters).filter(([_, value]) => !!value)
    )),
    ...(sort && sort.map(sortOption => ({sort: `${sortOption.property},${sortOption.direction}`})))
  };

  console.log(params);

  try {
    return (await coreAxios.get('/books/list', {params})).data;
  } catch (ex: any) {
    throw new ex;
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
    throw new ex;
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
    throw new ex;
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
    throw new ex;
  }
};
