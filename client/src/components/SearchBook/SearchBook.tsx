'use client'

import React, {FC, useState} from "react";
import {AutoComplete, Button, Input, Radio, RadioChangeEvent, SelectProps} from "antd";
import {getBooks} from "@/actions/books.action";
import {useRouter} from "next/navigation";
import {BookQueryDto, BookQueryType} from "@/types/book.types";
import {toQueryParams} from "@/utils/query-urils";

const {Search} = Input;

type PropType = {};

const SearchBook: FC<PropType> = ({}) => {
  const router = useRouter();
  const [searchOptions, setSearchOptions] = useState<SelectProps<object>['options']>([]);
  const [searchValue, setSearchValue] = useState('');
  const [searchBy, setSearchBy] = useState<string>('title');

  const onChange = (e: RadioChangeEvent) => {
    console.log('setSearchBy checked', e.target.value);
    setSearchBy(e.target.value);
  };

  function getSearchParams(query: string): BookQueryDto[]  {
    const params: BookQueryDto[] = [];

    if (searchBy == 'all') {
      params.push({
        key: 'title',
        value: query,
        type: BookQueryType.FILTER
      });
      params.push({
        key: 'author',
        value: query,
        type: BookQueryType.FILTER
      });
    } else if (searchBy == 'title') {
      params.push({
        key: 'title',
        value: query,
        type: BookQueryType.FILTER
      });
    } else if (searchBy == 'author') {
      params.push({
        key: 'author',
        value: query,
        type: BookQueryType.FILTER
      });
    }

    return params;
  }

  const searchResult = async (query: string) => {
    try {
      const books = await getBooks({
        page: {page: 1, limit: 10},
        queryParams: getSearchParams(query)
      });
      return books.items.map((book, index) => ({
        value: book.id,
        label: (
          <div className="flex flex-col">
            <p className="text-sm">
              {book.title}
            </p>
            {book.authors?.length > 0 && book.authors.map((author, index) => (
              <p key={author.id} className="text-xs text-gray-400">
                {index > 0 ? ', ' : ''}{author.name}
              </p>
            ))}
          </div>
        )
      }));
    } catch (err: any) {
      console.log(err);
    }
    return [];
  };

  const handleSearch = async (value: string) => {
    if (value && value.length > 1) {
      const results = await searchResult(value);
      setSearchOptions(results);
      return;
    }

    setSearchOptions([]);
  };

  const onSelect = (value: string) => {
    router.push(`/books/${value}`);
    setSearchOptions([]);
    setSearchValue('');
  };

  const onClear = () => {
    setSearchOptions([]);
    setSearchValue('');
  };

  function searchBooks() {
    router.push(`/?${toQueryParams(getSearchParams(searchValue))}`);
    onClear();
  }

  function getSearchPlaceholder() {
    if (searchBy == 'all') {
      return 'Type book title or author name';
    }
    if (searchBy == 'title') {
      return 'Type book title';
    }
    if (searchBy == 'author') {
      return 'Type author name';
    }
    return '';
  }

  return (
    <div className="flex flex-col justify-center align-middle">
      <div>
        <AutoComplete
          value={searchValue}
          popupMatchSelectWidth={252}
          style={{width: 300}}
          options={searchOptions}
          onSelect={onSelect}
          onSearch={handleSearch}
          size="middle"
          onChange={setSearchValue}
          onClear={onClear}
          placeholder={getSearchPlaceholder()}
        >
        </AutoComplete>
        <Button
          type="primary"
          onClick={searchBooks}
          disabled={!searchValue}
          size={'middle'}
        >
          Search
        </Button>
      </div>
      <div className="pt-1">
        <Radio.Group
          name="radiogroup"
          defaultValue={'title'}
          onChange={onChange}
        >
          <Radio value={'all'} className="font-normal text-xs">All</Radio>
          <Radio value={'title'} className="font-normal text-xs">Title</Radio>
          <Radio value={'author'} className="font-normal text-xs">Author</Radio>
          <Radio value={'summary'} className="font-normal text-xs" disabled>Summary</Radio>
        </Radio.Group>
      </div>
    </div>
  );
};

export default SearchBook;