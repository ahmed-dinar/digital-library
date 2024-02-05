import {AuthorDto, CreateAuthorDto} from "@/types/author.types";
import {coreAxios} from "@/api/axios";
import {ItemListDto, PageQueryDto} from "@/types/common.types";

/**
 * Search author
 */
export const createAuthor = async (author: CreateAuthorDto): Promise<AuthorDto> => {
  try {
    return (await coreAxios.post('/authors', author)).data;
  } catch (ex: any) {
    throw new ex;
  }
};

/**
 * Search author
 */
export const searchAuthor = async (term: string): Promise<AuthorDto[]> => {
  try {
    return (await coreAxios.get('/authors/search', {
      params: {
        text: term
      }
    })).data;
  } catch (ex: any) {
    throw new ex;
  }
};

/**
 * Get author list
 */
export const getAuthors = async (pageQuery: PageQueryDto): Promise<ItemListDto<AuthorDto>> => {
  try {
    return (await coreAxios.get('/authors/list', {
      params: {
        ...pageQuery
      }
    })).data;
  } catch (ex: any) {
    throw new ex;
  }
};
