import React, {createContext, useState, FC, useEffect} from 'react';
import {getAuthors} from "@/actions/authors.actions";
import {getGenres} from "@/actions/genres.action";
import {AuthorDto} from "@/types/author.types";
import {GenreDto} from "@/types/genre.types";
import {useRouter, useSearchParams} from "next/navigation";
import {BookQueryDto, BookQueryKey} from "@/types/book.types";
import {router} from "next/client";
import {toQueryParams} from "@/utils/query-urils";

export type LibraryContextType = {
  authors: AuthorDto[];
  genres: GenreDto[];
  fetchAuthors: () => void;
  fetchGenres: () => void;
  authorsLoading?: boolean;
  genresLoading?: boolean;
  titleSort?: string;
  setTitleSort: (sort?: string) => void;
  bookQuery: BookQueryDto[],
  setBookQueryList: (query: BookQueryDto[]) => void,
};

export const LibraryContext = createContext<LibraryContextType>({
  bookQuery: [],
  setBookQueryList(query: BookQueryDto[]) {
  },
  fetchAuthors(): void {
  },
  fetchGenres(): void {
  },
  authors: [],
  genres: [],
  setTitleSort: (): void => {
  }
});

type PropType = {
  children: any
};

export const LibraryProvider: FC<PropType> = ({children}) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [authorsLoading, setAuthorsLoading] = useState<boolean>(true);
  const [genresLoading, setGenresLoading] = useState<boolean>(true);
  const [authors, setAuthors] = useState<AuthorDto[]>([]);
  const [genres, setGenres] = useState<GenreDto[]>([]);
  const [titleSort, setTitleSort] = useState<string | undefined>(undefined);
  const [bookQuery, setBookQuery] = useState<BookQueryDto[]>([]);

  async function fetchAuthors() {
    setAuthorsLoading(true);
    getAuthors({page: 1, limit: 5000})
      .then(authors => {
        console.log(authors);
        setAuthors(authors.items);
      })
      .catch(err => {
        console.log(err);
      }).finally(() => setAuthorsLoading(false));
  }

  async function fetchGenres() {
    setGenresLoading(true);
    getGenres({page: 1, limit: 5000})
      .then(genres => {
        console.log(genres);
        setGenres(genres.items);
      })
      .catch(err => {
        console.log(err);
      }).finally(() => setGenresLoading(false));
  }

  useEffect(() => {
    fetchAuthors();
    fetchGenres();
  }, []);

  function parseFilters() {
    console.log('parseFilters...');
    const queries: BookQueryDto[] = [];

    searchParams.forEach((value, key) => {
      if (key in BookQueryKey) {
        queries.push({
          key, value, type: BookQueryKey[key]
        });
      }
    });

    console.log('params ', queries);
    setBookQuery(queries);
  }

  useEffect(() => {
    parseFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function setBookQueryList(query: BookQueryDto[]) {
    if (!query || query.length == 0) {
      setBookQuery([]);
      router.push(`/`);
    } else {
      setBookQuery(query);
      const params = toQueryParams(query);
      router.push(`/?${params}`);
    }
  }

  const value = {authors, fetchAuthors, genres, fetchGenres, authorsLoading, genresLoading, titleSort, setTitleSort, bookQuery, setBookQueryList};

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
};

export default LibraryProvider;