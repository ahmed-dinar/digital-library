'use client'

import React, {FC, useEffect, useState} from "react";
import {Button, Card, Divider, Flex, Pagination, Space, Typography} from "antd";
import {PlusCircleOutlined} from "@ant-design/icons";
import {getBooks} from "@/actions/books.action";
import {ItemListDto, PaginationDto} from "@/types/common.types";
import {BookDto} from "@/types/book.types";

const {Title, Text} = Typography;

const HomeComponent: FC = () => {
  const [books, setBooks] = useState<BookDto[]>([]);
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
  }, []);

  // useEffect(() => {
  //   fetchBooks();
  // }, [pagination]);

  function onPaginationChange(page: number, pageSize: number) {
    setPagination({...pagination, page, limit: pageSize});
    fetchBooks(page, pageSize);
  }

  return (
    <>
      <div style={{display: 'flex', flexDirection: 'row'}}>
        <div style={{display: 'flex', flex: '1', paddingRight: '20px'}}>
          <Flex gap="middle" vertical>
            <div>
              <Text style={{fontSize: '18px', fontWeight: '700'}}>
                Add book <Button type="text" shape="circle" icon={<PlusCircleOutlined/>} size={'middle'}/>
              </Text>
            </div>
            <Divider style={{margin: '2px'}}/>
            <div>
              <Space direction="vertical" size={16}>
                {books.map((book, index) => (
                  <div key={book.id} className={'animate__animated animate__fadeIn'}>
                    <Card title={book.title}>
                      <Text>{book.summary}</Text>
                    </Card>
                  </div>
                ))}
              </Space>
            </div>
            <div style={{marginTop: '20px'}}>
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
          </Flex>
        </div>

        <div style={{
          display: 'flex',
          borderRadius: '10px',
          background: '#ffffff',
          minHeight: '70%',
          width: '280px'
        }}>
          <Flex gap="middle" vertical>
            <div style={{textAlign: 'center'}}>
              <Text style={{fontSize: '16px', fontWeight: '700'}}>
                Filters
              </Text>
            </div>
          </Flex>
        </div>
      </div>
    </>
  );
};

export default HomeComponent;