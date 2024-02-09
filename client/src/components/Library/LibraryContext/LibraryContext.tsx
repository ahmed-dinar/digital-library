import React, {createContext, useState, FC, useEffect} from 'react';
import {getAuthors} from "@/actions/authors.actions";
import {getGenres} from "@/actions/genres.action";
import {AuthorDto} from "@/types/author.types";
import {GenreDto} from "@/types/genre.types";

export type LibraryContextType = {
  authors: AuthorDto[];
  genres: GenreDto[];
  fetchAuthors: () => void;
  fetchGenres: () => void;
  authorsLoading?: boolean;
  genresLoading?: boolean;
  titleSort?: string;
  setTitleSort: (sort?: string) => void;
};

export const LibraryContext = createContext<LibraryContextType>({
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
  const [authorsLoading, setAuthorsLoading] = useState<boolean>(true);
  const [genresLoading, setGenresLoading] = useState<boolean>(true);
  const [authors, setAuthors] = useState<AuthorDto[]>([]);
  const [genres, setGenres] = useState<GenreDto[]>([]);
  const [titleSort, setTitleSort] = useState<string | undefined>(undefined);

  async function fetchAuthors() {
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

  const value = {authors, fetchAuthors, genres, fetchGenres, authorsLoading, genresLoading, titleSort, setTitleSort};

  return (
    <LibraryContext.Provider value={value}>
      {children}
    </LibraryContext.Provider>
  );
};

export default LibraryProvider;