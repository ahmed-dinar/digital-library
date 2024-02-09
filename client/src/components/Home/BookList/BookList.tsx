'use client'

import React, {FC, useContext} from "react";
import {AuthorDto} from "@/types/author.types";
import {GenreDto} from "@/types/genre.types";
import {Button, Divider, Empty, Image, message, Pagination, Space, Tag, Typography} from "antd";

import {FallbackImageBase64} from "@/lib/fallback.image";
import {BookDto, BookQueryDto, BookQueryType} from "@/types/book.types";
import {PaginationDto} from "@/types/common.types";
import {useRouter} from "next/navigation";
import BookAction from "@/components/Home/BookList/BookAction";
import {CaretDownOutlined, CaretUpOutlined} from "@ant-design/icons";
import {LibraryContext, LibraryContextType} from "@/components/Library/LibraryContext/LibraryContext";

type PropType = {
  authors: AuthorDto[]
  genres: GenreDto[],
  books: BookDto[],
  pagination: PaginationDto,
  onPaginationChange: any
};

const {Text} = Typography;

const BookList: FC<PropType> = ({authors, genres, books, pagination, onPaginationChange}) => {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const {bookQuery, setBookQueryList} = useContext<LibraryContextType>(LibraryContext);

  function isTitleSort(query: BookQueryDto) {
    return query.type == BookQueryType.SORT && query.key == 'sort' && query.value.startsWith('title');
  }

  function sortByTitle() {
    const filters = [...bookQuery];
    let titleSort = filters.find(query => isTitleSort(query));

    console.log('bookQuery ', filters);
    console.log('titleSort ', titleSort);

    if (titleSort) {
      titleSort.value = `title,${titleSort.value.includes('asc') ? 'desc' : 'asc'}`;
    } else {
      filters.push({
        key: 'sort',
        value: 'title,asc',
        type: BookQueryType.SORT
      });
    }

    setBookQueryList(filters);
  }

  function removeFilters() {
    setBookQueryList([]);
  }

  function getTitleSortIcon() {
    let titleSort = bookQuery.find(query => isTitleSort(query));
    return titleSort && titleSort.value.includes('asc') ? <CaretDownOutlined/> : <CaretUpOutlined/>;
  }

  return (
    <>
      {contextHolder}
      <div className="flex flex-col min-w-full">
        <div className="flex flex-row">
          <div className="flex grow">
            {bookQuery && bookQuery.length > 0 && (
              <div>
                <Tag
                  closable={true}
                  onClose={removeFilters}
                >
                  Clear filters
                </Tag>
              </div>
            )}
          </div>
          <div className="flex flex-none">
            <Button.Group>
              <Button
                type="text"
                size={'small'}
                icon={getTitleSortIcon()}
                className="bg-gray-100 hover:bg-gray-200 text-xs rounded-xl font-semibold"
                onClick={sortByTitle}
                disabled={books?.length == 0}
              >
                A-Z
              </Button>
              {/*<Button type="default" size={'small'}>*/}
              {/*  Button 2*/}
              {/*</Button>*/}
            </Button.Group>
          </div>
        </div>

        <div className="mt-1">
          <p className="text-gray-700 text-xs">{pagination.totalItems} books found</p>
        </div>

        <Divider className="my-4"/>

        {books && books.length > 0 ? (
          <>
            <div>
              <Space direction="vertical" size={16} className="min-w-full">
                {books.map((book, index) => (
                  <div key={book.id} className={'animate__animated animate__fadeIn'}>
                    <div
                      className="bg-white rounded-lg pt-3 pb-4 px-5 text-gray-700 border-b border-dashed border-gray-300">

                      <div className="flex flex-row">
                        <div>
                          <Image
                            height={150}
                            width={110}
                            className="h-120 w-150 object-cover rounded-xl"
                            // src="/book1.png"
                            src="error"
                            fallback={FallbackImageBase64}
                            alt={'Book image'}
                          />
                        </div>

                        <div className="flex-1 pl-3 pb-2">
                          <div className="flex flex-col h-full">
                            <div className="flex flex-row">
                              <div className="flex flex-1">
                                <h3
                                  className={'text-lg font-semibold text-gray-700 mb-1 mt-1 cursor-pointer '}
                                  onClick={() => router.push(`/books/${book.id}`)}
                                >
                                  {book.title}
                                </h3>
                              </div>
                              <div className="flex w-1">
                                <BookAction book={book} onBookChange={() => onPaginationChange(1, pagination.limit)}/>
                              </div>
                            </div>

                            {book.authors.length > 0 ? (
                              <div>
                                <p className="font-semibold text-gray-400 text-sm">
                                  by
                                  {book.authors.map((author, index) => (
                                    <span
                                      key={author.id}
                                      className="cursor-pointer hover:bg-gray-200 py-0 px-1 ml-1 rounded-l hover:text-blue-600"
                                      onClick={() => router.push(`/?authorId=${author.id}`)}
                                    >
                                    {index > 0 ? ', ' : ''}{author.name}
                                </span>
                                  ))}
                                </p>
                              </div>
                            ) : null}

                            <div className="pt-2.5">
                              <p className="text-sm font-normal text-gray-500">{book.summary}</p>
                            </div>

                            {book.genres.length > 0 ? (
                              <div className="mt-auto">
                                {book.genres.map(genre => (
                                  <Tag
                                    key={genre.id}
                                    className="text-xs font-normal cursor-pointer hover:bg-gray-300 bg-gray-200 border-0"
                                    onClick={() => router.push(`/?genreId=${genre.id}`)}
                                  >
                                    {genre.name}
                                  </Tag>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                ))}
              </Space>
            </div>

            <div className="py-11 m-auto">
              {pagination.totalItems > 0 ? (
                <Pagination
                  showSizeChanger
                  // onShowSizeChange={(current, size) => }
                  defaultCurrent={1}
                  total={pagination.totalItems}
                  pageSize={pagination.limit}
                  size={'default'}
                  onChange={onPaginationChange}
                  pageSizeOptions={[10, 20, 50]}
                />
              ) : null}
            </div>
          </>
        ) : (
          <>
            <Empty />
          </>
        )}


      </div>
    </>
  );
};

export default BookList;