'use client'

import React, {FC, useContext, useEffect, useState} from "react";
import {getBooks} from "@/actions/books.action";
import {PaginationDto} from "@/types/common.types";
import {BookDto} from "@/types/book.types";

import LeftSideBar from "@/components/Home/LeftSideBar/LeftSideBar";
import RightSideBar from "@/components/Home/RightSideBar/RightSideBar";
import BookList from "@/components/Home/BookList/BookList";
import {LibraryContext, LibraryContextType} from "@/components/Library/LibraryContext/LibraryContext";
import {Skeleton} from "antd";
import {useSearchParams} from "next/navigation";

const HomeComponent: FC = () => {
  const searchParams = useSearchParams();
  const [booksLoading, setBooksLoading] = useState<boolean>(true);
  const [books, setBooks] = useState<BookDto[]>([]);
  const {authors, genres} = useContext<LibraryContextType>(LibraryContext);
  const [pagination, setPagination,] = useState<PaginationDto>({
    hasNext: false,
    hasPrevious: false,
    totalItems: 0,
    page: 1,
    limit: 10
  });

  function fetchBooks(page: number, limit: number) {
    const params: { key: string, value: string }[] = [];

    searchParams.forEach((value, key) => {
      // We are manging page and limit internally
      // lets just send all other query params to backend
      if (key != 'page' && key != 'limit') {
        params.push({key, value});
      }
    });

    const queryParams = params
      .map(({key, value}) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
      .join('&');

    getBooks({
      page: {page, limit},
      queryParams
    })
      .then(books => {
        console.log(books);
        setBooks(books.items);
        setPagination(books.pagination);
      })
      .catch(err => {
        console.log(err);
      }).finally(() => setBooksLoading(false));
  }

  useEffect(() => {
    fetchBooks(pagination.page, pagination.limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  function onPaginationChange(page: number, pageSize: number) {
    setPagination({...pagination, page, limit: pageSize});
    fetchBooks(page, pageSize);
  }

  return (
    <>
      <h1>{searchParams}</h1>
      <div className="flex flex-row">

        <div className="flex shrink-0 w-56 bg-transparent flex-col border-r border-solid border-gray-200">
          <LeftSideBar authors={authors}/>
        </div>

        <div className="flex flex-auto px-5">
          <BookList authors={authors} genres={genres} books={books} pagination={pagination}
                    onPaginationChange={onPaginationChange}/>
        </div>

        <div className="bg-transparent w-72 flex shrink-0 flex-col">
          <RightSideBar authors={authors} genres={genres}/>
        </div>

      </div>
    </>
  );
};

export default HomeComponent;