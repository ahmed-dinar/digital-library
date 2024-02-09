'use client'

import React, {FC, useContext, useEffect, useState} from "react";
import {getBooks} from "@/actions/books.action";
import {PaginationDto} from "@/types/common.types";
import {BookDto} from "@/types/book.types";

import LeftSideBar from "@/components/Home/LeftSideBar/LeftSideBar";
import RightSideBar from "@/components/Home/RightSideBar/RightSideBar";
import BookList from "@/components/Home/BookList/BookList";
import {LibraryContext, LibraryContextType} from "@/components/Library/LibraryContext/LibraryContext";
import {message, Skeleton} from "antd";

const HomeComponent: FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [booksLoading, setBooksLoading] = useState<boolean>(true);
  const [books, setBooks] = useState<BookDto[]>([]);
  const {authors, genres, authorsLoading, genresLoading, bookQuery} = useContext<LibraryContextType>(LibraryContext);
  const [pagination, setPagination,] = useState<PaginationDto>({
    hasNext: false,
    hasPrevious: false,
    totalItems: 0,
    page: 1,
    limit: 10
  });

  async function fetchBooks(page: number, limit: number) {
    setBooksLoading(true);

    try {
      const bookList = await getBooks({
        page: {page, limit},
        queryParams: bookQuery
      });
      setBooks(bookList.items);
      setPagination(bookList.pagination);
    } catch (err: any) {
      console.log(err);
      messageApi.open({
        type: 'error',
        content: err?.response?.data?.message || 'Something went wrong fetching books!',
      });
    }

    setBooksLoading(false);
  }

  useEffect(() => {
    setPagination({...pagination, page: 1});
    fetchBooks(1, pagination.limit);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookQuery]);

  function onPaginationChange(page: number, pageSize: number) {
    setPagination({...pagination, page, limit: pageSize});
    fetchBooks(page, pageSize);
  }

  return (
    <>
      {contextHolder}
      <div className="flex flex-row">

        <div className="flex shrink-0 w-56 bg-transparent flex-col border-r border-solid border-gray-100">
          {authorsLoading ? (
            <Skeleton active/>
          ) : (
            <LeftSideBar authors={authors}/>
          )}
        </div>

        <div className="flex flex-auto px-5">
          {booksLoading ? (
            <Skeleton active avatar paragraph={{rows: 4}}/>
          ) : (
            <BookList authors={authors} genres={genres} books={books} pagination={pagination}
                      onPaginationChange={onPaginationChange}/>
          )}
        </div>

        <div className="bg-transparent w-72 flex shrink-0 flex-col">
          {genresLoading ? (
            <Skeleton active/>
          ) : (
            <RightSideBar authors={authors} genres={genres}/>
          )}
        </div>

      </div>
    </>
  );
};

export default HomeComponent;