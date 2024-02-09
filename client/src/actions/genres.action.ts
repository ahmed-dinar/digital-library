import {coreAxios} from "@/api/axios";
import {ItemListDto, PageQueryDto} from "@/types/common.types";
import {CreateGenreDto, GenreDto} from "@/types/genre.types";

/**
 * Search genre
 */
export const createGenre = async (genre: CreateGenreDto): Promise<GenreDto> => {
  try {
    return (await coreAxios.post('/genres', genre)).data;
  } catch (ex: any) {
    throw ex;
  }
};

/**
 * Search genre
 */
export const searchGenre = async (term: string): Promise<GenreDto[]> => {
  try {
    return (await coreAxios.get('/genres/search', {
      params: {
        text: term
      }
    })).data;
  } catch (ex: any) {
    throw ex;
  }
};

/**
 * Get genre list
 */
export const getGenres = async (pageQuery: PageQueryDto): Promise<ItemListDto<GenreDto>> => {
  try {
    return (await coreAxios.get('/genres/list', {
      params: {
        ...pageQuery
      }
    })).data;
  } catch (ex: any) {
    throw ex;
  }
};
