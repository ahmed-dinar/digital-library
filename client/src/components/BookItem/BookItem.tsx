'use client'

import React, {FC, useEffect, useState} from "react";
import {getBookById} from "@/actions/books.action";
import {BookDto} from "@/types/book.types";
import {Divider, Image, message, Tag} from "antd";
import LeftSideBar from "@/components/Home/LeftSideBar/LeftSideBar";
import {FallbackImageBase64} from "@/lib/fallback.image";

type PropType = {
  bookId: string
};

const BookItem: FC<PropType> = ({bookId}) => {
  const [book, setBook] = useState<BookDto | null>(null);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    async function getBook() {
      try {
        const book = await getBookById(bookId);
        setBook(book);
      } catch (err: any) {
        messageApi.open({
          type: 'error',
          content: err?.response?.data?.message || 'Something went wrong getting book!',
        });
      }
    }

    getBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {contextHolder}
      <div className="flex flex-row">
        {book ? (
          <>
            <div className="flex shrink-0 w-64 bg-transparent flex-col border-0">
              <div className="">
                <Image
                  height={260}
                  width={200}
                  className="object-cover rounded-xl"
                  // src="/book1.png"
                  src="error"
                  fallback={FallbackImageBase64}
                  alt={'Book image'}
                />
              </div>
            </div>

            <div className="flex flex-auto px-5 flex-col">
              <h1 className="text-4xl font-bold text-gray-600 mb-1 mt-1 cursor-pointer">
                {book?.title}
              </h1>

              {book.authors.length > 0 ? (
                <div className="mt-5">
                  <p className="font-semibold text-gray-400 text-lg">
                    {book.authors.map((author, index) => (
                      <span key={author.id}
                            className="cursor-pointer hover:bg-gray-200 py-0 px-1 ml-1 rounded-l hover:text-orange-700">
                                    {index > 0 ? ', ' : ''}{author.name}
                                  </span>
                    ))}
                  </p>
                </div>
              ) : null}

              <div className="pt-4">
                <p className="text-base font-semibold text-gray-500">
                  {book.summary}
                </p>

                <p className="text-base font-semibold text-gray-500 pt-3">
                  Bryce Quinlan and Hunt Athalar are trying to get back to normal―they may have saved Crescent City,
                  but with so much upheaval in their lives lately, they mostly want a chance to relax. Slow down.
                  Figure out what the future holds.
                </p>

                <p className="text-base font-semibold text-gray-500 pt-3">
                  The Asteri have kept their word so far, leaving Bryce and Hunt alone. But with the rebels chipping
                  away at the Asteri’s power, the threat the rulers pose is growing. As Bryce, Hunt, and their friends
                  get pulled into the rebels’ plans, the choice becomes clear: stay silent while others are oppressed,
                  or fight for what’s right. And they’ve never been very good at staying silent.
                </p>

                <p className="text-base font-semibold text-gray-500 pt-3">
                  In this sexy, action-packed sequel to the #1 bestseller House of Earth and Blood, Sarah J. Maas
                  weaves a captivating story of a world about to explode―and the people who will do anything to save
                  it.
                </p>
              </div>

              {book.genres.length > 0 ? (
                <div className="mt-4">
                  {book.genres.map(genre => (
                    <Tag key={genre.id} className="text-xs font-normal cursor-pointer hover:underline">
                      {genre.name}
                    </Tag>
                  ))}
                </div>
              ) : null}

              <Divider className="my-7 w-full"/>

              <h3 className="text-lg font-semibold text-gray-500">Comments</h3>

              <Divider className="my-7 w-full"/>

              <div>

              </div>
            </div>
          </>
        ) : (<div></div>)}
      </div>
    </>
  );
};

export default BookItem;