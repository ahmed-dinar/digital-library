import React, {FC, useState} from "react";
import {BookDto} from "@/types/book.types";
import {Button, Dropdown, MenuProps, message, Modal} from "antd";
import {DeleteOutlined, EditOutlined, ExclamationCircleOutlined, SmallDashOutlined} from "@ant-design/icons";
import {deleteBook} from "@/actions/books.action";
import UpsertBook from "@/components/UpsertBook/UpsertBook";

type PropType = {
  book: BookDto,
  onBookChange: () => void;
};

const bookActionItems: MenuProps['items'] = [
  {
    key: 'edit',
    label: 'Edit',
    icon: <EditOutlined/>,
  },
  {
    key: 'delete',
    label: 'Delete',
    icon: <DeleteOutlined/>
  }
];

const {confirm} = Modal;

const BookAction: FC<PropType> = ({book, onBookChange}) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  async function editABook(book: BookDto) {
    console.log(`Edit book: `, book);
  }

  async function doDeleteABook(book: BookDto) {
    try {
      await deleteBook(book.id);
      messageApi.open({
        type: 'success',
        content: 'Book deleted!',
      });
      onBookChange();
    } catch (err: any) {
      console.log(err);
      messageApi.open({
        type: 'error',
        content: err?.response?.data?.message || 'Something went wrong deleting book!',
      });
    }
  }

  async function deleteABook(book: BookDto) {
    console.log(`Delete book: `, book);

    confirm({
      icon: <ExclamationCircleOutlined/>,
      content: (
        <div>
          <h3 className="text-base font-bold text-rose-600">
            Confirm delete?
          </h3>
          <p className="text-normal font-normal text-gray-500">
            Once deleted, it cannot be undone.
          </p>
        </div>
      ),
      onOk() {
        doDeleteABook(book);
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  }

  const onBookActionClick = async (action: string, book: BookDto) => {
    console.log(`Click on item ${action} `, book);

    if (action == 'edit') {
      //  await editABook(book);
      setIsBookModalOpen(true);
      return;
    }

    if (action == 'delete') {
      await deleteABook(book);
      return;
    }
  };

  return (
    <>
      {contextHolder}
      <Dropdown
        menu={{items: bookActionItems, onClick: ({key}) => onBookActionClick(key, book)}}
        placement="bottomLeft"
        arrow
        className="cursor-pointer"
      >
        <SmallDashOutlined/>
      </Dropdown>
      <UpsertBook isBookModalOpen={isBookModalOpen} setIsBookModalOpen={setIsBookModalOpen} bookItem={book}
                  onBookChange={onBookChange}/>
    </>
  );
};

export default BookAction;