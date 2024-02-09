'use client'

import React, {FC, useContext, useEffect, useState} from "react";
import {Button, DatePicker, DatePickerProps, Drawer, Form, Input, message, Space} from "antd";
import AddAuthor from "@/components/UpsertBook/AddAuthor";
import AddGenre from "@/components/UpsertBook/AddGenre";
import {SelectValue} from "@/components/DebounceSelect/DebounceSelect";
import {LibraryContext, LibraryContextType} from "@/components/Library/LibraryContext/LibraryContext";
import {createBook, updateBook} from "@/actions/books.action";
import {BookDto, CreateBookDto} from "@/types/book.types";
import dayjs from "dayjs";

const {TextArea} = Input;
const {useForm, Item} = Form;

type PropType = {
  isBookModalOpen: boolean;
  setIsBookModalOpen: (value: boolean) => void,
  bookItem?: BookDto,
  onBookChange?: () => void;
};

interface FormFields {
  title: string;
  year: string;
  authors: SelectValue[];
  genres?: SelectValue[];
  publisher?: string;
  summary: string;
}

const layout = {
  labelCol: {span: 8},
  wrapperCol: {span: 16},
};

const UpsertBook: FC<PropType> = ({isBookModalOpen, setIsBookModalOpen, bookItem, onBookChange}) => {
  const [form] = useForm<FormFields>();
  const {authors, genres} = useContext<LibraryContextType>(LibraryContext);
  const [selectedAuthors, setSelectedAuthors] = useState<SelectValue[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<SelectValue[]>([]);
  const [messageApi, contextHolder] = message.useMessage();

  const onYearChange: DatePickerProps['onChange'] = (date, dateString) => {
    console.log(date, dateString);
  };

  async function submitBook(booKData: CreateBookDto) {
    try {
      if (bookItem) {
        await updateBook(bookItem.id, booKData);
      } else {
        await createBook(booKData);
      }

      messageApi.open({
        type: 'success',
        content: `Book ${bookItem ? 'Updated' : 'Added'}!`,
      });
      setIsBookModalOpen(false);

      if (onBookChange) {
        onBookChange();
      }
    } catch (err: any) {
      console.log(err);
      messageApi.open({
        type: 'error',
        content: err?.response?.data?.message || `Something went wrong ${bookItem ? 'updating' : 'adding'} book!`,
      });
    }
  }

  const onFinish = async (formFields: FormFields) => {
    console.log(formFields);

    const data: CreateBookDto = {
      title: formFields.title,
      publicationYear: parseInt(dayjs(formFields.year).format('YYYY')),
      summary: formFields.summary,
      authorIds: formFields.authors.map(author => author.value),
      genreIds: formFields.genres?.map(genre => genre.value),
      isbns: [],
      publisher: formFields.publisher
    };

    console.log('Create book data ', data);

    await submitBook(data);
  };

  useEffect(() => {
    form.setFieldValue('authors', selectedAuthors);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAuthors]);

  useEffect(() => {
    form.setFieldValue('genres', selectedGenres);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenres]);

  useEffect(() => {
    if (bookItem) {
      form.setFields([
        {name: 'title', value: bookItem.title},
        {name: 'year', value: dayjs().year(bookItem.publicationYear)},
        {name: 'authors', value: bookItem.authors.map(author => ({label: author.name, value: author.id}))},
        {name: 'genres', value: bookItem.genres.map(genre => ({label: genre.name, value: genre.id}))},
        {name: 'publisher', value: bookItem.publisher},
        {name: 'summary', value: bookItem.summary},
      ]);
    } else {
      form.resetFields();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookItem]);

  return (
    <>
      {contextHolder}
      <Drawer
        title={bookItem ? 'Edit book' : 'Add a new book'}
        width={720}
        onClose={() => setIsBookModalOpen(false)}
        open={isBookModalOpen}
        styles={{
          body: {
            paddingBottom: 80,
          },
        }}
        extra={
          <Space>
            <Button>Cancel</Button>
          </Space>
        }
      >
        <Form
          {...layout}
          name={'book-form'}
          form={form}
          layout="vertical"
          requiredMark={'optional'}
          onFinish={onFinish}
          size={'middle'}
          validateMessages={{required: "'${name}' is required!"}}
          variant={'filled'}
        >
          <Item
            label="Title"
            name="title"
            rules={[{required: true}]}
            className="mb-9"
          >
            <Input placeholder="Book title"/>
          </Item>

          <Item
            label="Publication Year"
            name="year"
            rules={[{required: true}]}
            className="mb-9"
          >
            <DatePicker onChange={onYearChange} picker="year"/>
          </Item>

          <Item
            required
            label="Authors"
            name="authors"
            rules={[{required: true}]}
            className="mb-9"
          >
            <AddAuthor authors={authors} value={selectedAuthors} setValue={setSelectedAuthors}/>
          </Item>

          <Item
            label="Genres"
            name="genres"
            rules={[{required: false}]}
            className="mb-9"
          >
            <AddGenre genres={genres} value={selectedGenres} setValue={setSelectedGenres}/>
          </Item>

          <Item
            label="Publisher"
            name="publisher"
            rules={[{required: false}]}
            className="mb-9"
          >
            <Input placeholder="Publisher name"/>
          </Item>

          <Item
            label="Summary"
            tooltip="Short summary max 1000 chars"
            name="summary"
            rules={[{required: true}]}
            className="mb-9"
          >
            <TextArea rows={4} placeholder={'Book summary'}/>
          </Item>

          <Item>
            <Button
              type="primary"
              htmlType="submit"
              size={'large'}
            >
              {bookItem ? 'Update' : 'Add'}
            </Button>
          </Item>
        </Form>

      </Drawer>
    </>
  );
};

export default UpsertBook;
