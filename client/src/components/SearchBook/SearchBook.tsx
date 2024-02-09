'use client'

import React, {FC, useState} from "react";
import {AutoComplete, Button, Input, SelectProps} from "antd";
import {getBooks} from "@/actions/books.action";
import {debounce} from 'lodash';
import {useRouter} from "next/navigation";

const {Search} = Input;

type PropType = {};

const SearchBook: FC<PropType> = ({}) => {
  const router = useRouter();
  const [searchOptions, setSearchOptions] = useState<SelectProps<object>['options']>([]);
  const [searchValue, setSearchValue] = useState('');

  const searchResult = async (query: string) => {
    try {
      const books = await getBooks({
        page: {page: 1, limit: 10},
        queryParams: `title=${query}`
      });
      return books.items.map((book, index) => ({
        value: book.id,
        label: book.title
      }));
    } catch (err: any) {
      console.log();
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
    console.log('onSelect', value);
    router.push(`/books/${value}`);
    setSearchOptions([]);
    setSearchValue('');
  };

  const onClear = () => {
    setSearchOptions([]);
    setSearchValue('');
  };

  function searchBooks() {
    router.push(`/?title=${searchValue}`);
    onClear();
  }

  return (
    <>
      <AutoComplete
        value={searchValue}
        popupMatchSelectWidth={252}
        style={{width: 300}}
        options={searchOptions}
        onSelect={onSelect}
        onSearch={handleSearch}
        size="large"
        onChange={setSearchValue}
        onClear={onClear}
      >
      </AutoComplete>
      <Button
        type="primary"
        onClick={searchBooks}
        disabled={!searchValue}
        size={'large'}
      >
        Search
      </Button>
    </>
  );
};

export default SearchBook;