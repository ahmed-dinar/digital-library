'use client'

import React, {FC, useEffect, useState} from "react";
import {Button, Divider, Pagination, Space, Typography, Image, Tag, Checkbox, GetProp} from "antd";
import {PlusCircleOutlined} from "@ant-design/icons";
import {getBooks} from "@/actions/books.action";
import {ItemListDto, PaginationDto} from "@/types/common.types";
import {BookDto} from "@/types/book.types";
import {FallbackImageBase64} from "@/lib/fallback.image";
import {getAuthors} from "@/actions/authors.actions";
import {getGenres} from "@/actions/genres.action";
import {AuthorDto} from "@/types/author.types";
import {GenreDto} from "@/types/genre.types";

const {Title, Text} = Typography;
const {Group} = Checkbox;

const HomeComponent: FC = () => {
  const [books, setBooks] = useState<BookDto[]>([]);
  const [authors, setAuthors] = useState<AuthorDto[]>([]);
  const [genres, setGenres] = useState<GenreDto[]>([]);
  const [pagination, setPagination,] = useState<PaginationDto>({
    hasNext: false,
    hasPrevious: false,
    totalItems: 0,
    page: 1,
    limit: 10
  });

  function fetchBooks(page: number, limit: number) {
    getBooks({
      page: {page, limit}
    })
      .then(books => {
        console.log(books);
        setBooks(books.items);
        setPagination(books.pagination);
      })
      .catch(err => {
        console.log(err);
      });
  }

  useEffect(() => {
    fetchBooks(pagination.page, pagination.limit);

    getAuthors({page: 1, limit: 100})
      .then(authors => {
        console.log(authors);
        setAuthors(authors.items);
      })
      .catch(err => {
        console.log(err);
      });

    getGenres({page: 1, limit: 100})
      .then(genres => {
        console.log(genres);
        setGenres(genres.items);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);

  // useEffect(() => {
  //   fetchBooks();
  // }, [pagination]);

  function onPaginationChange(page: number, pageSize: number) {
    setPagination({...pagination, page, limit: pageSize});
    fetchBooks(page, pageSize);
  }

  const onChange: GetProp<typeof Checkbox.Group, 'onChange'> = (checkedValues) => {
    console.log('checked = ', checkedValues);
  };


  return (
    <>
      <div className="flex flex-row">
        <div className="flex flex-1 pr-6">
          <div className="flex flex-col">

            <div>
              <Text className="text-xl font-bold">
                Add book <Button type="text" shape="circle" icon={<PlusCircleOutlined/>} size={'middle'}/>
              </Text>
            </div>

            <Divider className="my-4"/>

            <div>
              <Space direction="vertical" size={16}>
                {books.map((book, index) => (
                  <div key={book.id} className={'animate__animated animate__fadeIn'}>
                    <div
                      className="bg-white rounded-lg pt-3 pb-4 px-5 text-gray-700 border border-solid border-gray-100">

                      <div className="flex flex-row">

                        <div>
                          <Image
                            height={150}
                            width={110}
                            className="h-120 w-150 object-cover rounded-xl"
                            // src="/book1.png"
                            src="error"
                            fallback={FallbackImageBase64}
                          />
                        </div>

                        <div className="flex-1 pl-3 pb-2">
                          <div className="flex flex-col h-full">
                            <h3 className="text-lg font-bold text-gray-600 mb-1 mt-1">{book.title}</h3>

                            {book.authors.length > 0 ? (
                              <div>
                                <p className="font-semibold text-gray-400">
                                  by
                                  {book.authors.map((author, index) => (
                                    <span key={author.id}
                                          className="cursor-pointer hover:bg-gray-200 py-0 px-1 ml-1 rounded-l hover:text-orange-700">
                                    {index > 0 ? ' | ' : ''}{author.name}
                                  </span>
                                  ))}
                                </p>
                              </div>
                            ) : null}

                            <div className="pt-2.5">
                              <p className="text-sm font-semibold text-gray-500">{book.summary}</p>
                            </div>

                            {book.genres.length > 0 ? (
                              <div className="mt-auto">
                                {book.genres.map(genre => (
                                  <Tag key={genre.id} className="text-xs font-normal cursor-pointer hover:underline">
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

            <div className="pt-11">
              {pagination.totalItems > 0 ? (
                <Pagination
                  showSizeChanger
                  // onShowSizeChange={(current, size) => }
                  defaultCurrent={1}
                  total={pagination.totalItems}
                  pageSize={pagination.limit}
                  size={'small'}
                  onChange={onPaginationChange}
                />
              ) : null}
            </div>
          </div>
        </div>

        <div className="bg-transparent w-72">
          <div className="w-full bg-white rounded-2xl min-h-96 text-gray-700 border border-solid border-gray-100">
            <div className="flex flex-col p-4">
              <h3 className="text-lg font-bold text-gray-500">
                Filters
              </h3>

              {authors.length > 0 ? (
                <div>
                  <Divider className="my-4"/>
                  <h3 className="text-base font-bold text-gray-500 mb-2">
                    Author
                  </h3>

                  <div className="max-h-96 overflow-auto">
                    <Group style={{width: '100%'}} onChange={onChange}>
                      {authors.map(author => (
                        <div className="w-full mt-1">
                          <Checkbox value={author.id}>{author.name}</Checkbox>
                        </div>
                      ))}
                    </Group>
                  </div>

                </div>
              ) : null}

              {genres.length > 0 ? (
                <div>
                  <Divider className="my-4"/>
                  <h3 className="text-base font-bold text-gray-500 mb-2">
                    Genre
                  </h3>

                  <div className="max-h-96 overflow-auto">
                    <Group style={{width: '100%'}} onChange={onChange}>
                      {genres.map(genre => (
                        <div className="w-full mt-1">
                          <Checkbox value={genre.id}>{genre.name}</Checkbox>
                        </div>
                      ))}
                    </Group>
                  </div>

                </div>
              ) : null}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeComponent;