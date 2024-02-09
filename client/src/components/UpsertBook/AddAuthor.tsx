'use client'

import React, {FC, useContext, useRef, useState} from "react";
import {AuthorDto} from "@/types/author.types";
import DebounceSelect, {SelectValue} from "@/components/DebounceSelect/DebounceSelect";
import {Button, Divider, Input, InputRef, message, Space} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {createAuthor} from "@/actions/authors.actions";
import {LibraryContext, LibraryContextType} from "@/components/Library/LibraryContext/LibraryContext";

type PropType = {
  authors: AuthorDto[],
  value: SelectValue[],
  setValue: (value: SelectValue[]) => void,
};

const AddAuthor: FC<PropType> = ({authors, value, setValue}) => {
  const {fetchAuthors} = useContext<LibraryContextType>(LibraryContext);
  const inputRef = useRef<InputRef>(null);
  const [name, setName] = useState('');
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);

  const onNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const addItem = async (e: React.MouseEvent<HTMLButtonElement | HTMLAnchorElement>) => {
    e.preventDefault();

    if (!name) {
      return;
    }

    setLoading(true);

    try {
      await createAuthor({name});
      messageApi.open({
        type: 'success',
        content: 'Author added!',
      });
      setName('');
      fetchAuthors();
    } catch (err: any) {
      console.log(err);
      messageApi.open({
        type: 'error',
        content: err?.response?.data?.message || 'Something went wrong creating book!',
      });
    }

    setLoading(false);
  };

  async function fetchAuthorList(authorName: string): Promise<SelectValue[]> {
    return authors.filter(author => author.name.toLowerCase().startsWith(authorName.toLowerCase())).map(author => ({
      label: author.name,
      value: author.id,
    }));
  }

  return (
    <>
      {contextHolder}
      <DebounceSelect
        mode="multiple"
        value={value}
        placeholder="Type author name to add"
        fetchOptions={fetchAuthorList}
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
                placeholder="Author name"
                ref={inputRef}
                value={name}
                onChange={onNameChange}
                onKeyDown={(e) => e.stopPropagation()}
              />
              <Button
                type="text"
                icon={<PlusOutlined/>}
                onClick={addItem}
                className="hover:bg-neutral-800 hover:text-slate-100"
                loading={loading}
              >
                Add new author
              </Button>
            </Space>
          </>
        )}
      />
    </>
  );
};

export default AddAuthor;