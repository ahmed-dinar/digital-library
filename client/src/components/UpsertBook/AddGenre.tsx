'use client'

import React, {FC, useContext, useRef, useState} from "react";
import DebounceSelect, {SelectValue} from "@/components/DebounceSelect/DebounceSelect";
import {GenreDto} from "@/types/genre.types";
import {Button, Divider, Input, InputRef, message, Space} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {createGenre} from "@/actions/genres.action";
import {LibraryContext, LibraryContextType} from "@/components/Library/LibraryContext/LibraryContext";

type PropType = {
  genres: GenreDto[],
  value: SelectValue[],
  setValue: (value: SelectValue[]) => void,
};

const AddGenre: FC<PropType> = ({genres, value, setValue}) => {
  const inputRef = useRef<InputRef>(null);
  const [name, setName] = useState('');
  const {fetchGenres} = useContext<LibraryContextType>(LibraryContext);
  const [messageApi, contextHolder] = message.useMessage();

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();

    if (!name) {
      return;
    }

    try {
      await createGenre({name});
      messageApi.open({
        type: 'success',
        content: 'Author added!',
      });
      setName('');
      fetchGenres();
    } catch (err: any) {
      console.log(err);
      console.log(err?.response);
      messageApi.open({
        type: 'error',
        content: err?.response?.data?.message || 'Something went wrong creating book!',
      });
    }
  };

  async function fetcGenreList(genreName: string): Promise<SelectValue[]> {
    console.log('fetching genre', genreName);

    return genres.filter(genre => genre.name.toLowerCase().startsWith(genreName.toLowerCase())).map(genre => ({
      label: genre.name,
      value: genre.id,
    }));
  }

  return (
    <>
      {contextHolder}
      <DebounceSelect
        mode="multiple"
        value={value}
        placeholder="Type genre name to add"
        fetchOptions={fetcGenreList}
        onChange={(newValue) => {
          setValue(newValue as SelectValue[]);
        }}
        style={{width: '100%'}}
        dropdownRender={(menu) => (
          <>
            {menu}
            <Divider style={{margin: '8px 0'}}/>
            <Space style={{padding: '0 8px 4px'}}>
              <Input
                placeholder="Genre name"
                ref={inputRef}
                value={name}
                onChange={onNameChange}
                onKeyDown={(e) => e.stopPropagation()}
              />
              <Button type="text" icon={<PlusOutlined/>} onClick={addItem}
                      className="hover:bg-neutral-800 hover:text-slate-100">
                Add new genre
              </Button>
            </Space>
          </>
        )}
      />
    </>
  );
};

export default AddGenre;