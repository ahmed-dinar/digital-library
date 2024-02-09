'use client'

import React, {FC, useEffect, useState} from "react";
import {getBookById} from "@/actions/books.action";
import {BookDto} from "@/types/book.types";
import {Divider, Empty, Image, message, Skeleton, Tag} from "antd";
import {FallbackImageBase64} from "@/lib/fallback.image";
import {useRouter} from "next/navigation";

type PropType = {
  bookId: string
};

const BookItem: FC<PropType> = ({bookId}) => {
  const router = useRouter();
  const [book, setBook] = useState<BookDto | null>(null);
  const [messageApi, contextHolder] = message.useMessage();
  const [bookLoading, setBookLoading] = useState<boolean>(true);

  useEffect(() => {
    async function getBook() {
      setBookLoading(true);
      try {
        const book = await getBookById(bookId);
        setBook(book);
      } catch (err: any) {
        messageApi.open({
          type: 'error',
          content: err?.response?.data?.message || 'Something went wrong getting book!',
        });
      }
      setBookLoading(false);
    }

    getBook();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {contextHolder}
      <div className="flex flex-row">
        {bookLoading ? (
          <>
            <Skeleton active avatar paragraph={{rows: 4}}/>
          </>
        ) : (
          <>
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
                          <span
                            key={author.id}
                            className="cursor-pointer hover:bg-gray-200 py-0 px-1 ml-1 rounded-l hover:text-orange-700"
                            onClick={() => router.push(`/?authorId=${author.id}`)}
                          >
                        {index > 0 ? ', ' : ''}{author.name}
                      </span>
                        ))}
                      </p>
                    </div>
                  ) : null}

                  <div className="pt-4 font-normal">
                    <p className="text-base text-gray-500">
                      {book.summary}
                    </p>

                    <p className="text-base text-gray-500 pt-3">
                      {"It tells the story from the point of view of a narrator of a plague sweeping the French Algerian city\n" +
                        "                  of Oran. The narrator remains unknown until the start of the last chapter, chapter 5 of part 5. The\n" +
                        "                  novel presents a snapshot of life in Oran as seen through the author's distinctive absurdist point of\n" +
                        "                  view."}
                    </p>

                    <p className="text-base text-gray-500 pt-3">
                      {"The book tells a gripping tale of human unrelieved horror, of survival and resilience, and of the ways\n" +
                        "                  in which humankind confronts death, The Plague is at once a masterfully crafted novel, eloquently\n" +
                        "                  understated and epic in scope, and a parable of ageless moral resonance, profoundly relevant to our\n" +
                        "                  times. In Oran, a coastal town in North Africa, the plague begins as a series of portents, unheeded by\n" +
                        "                  the people. It gradually becomes an omnipresent reality, obliterating all traces of the past and\n" +
                        "                  driving its victims to almost unearthly extremes of suffering, madness, and compassion."}
                    </p>

                    <p className="text-base text-gray-500 pt-3">
                      {"The Plague is considered an existentialist classic despite Camus' objection to the label. The novel\n" +
                        "                  stresses the powerlessness of the individual characters to affect their destinies. The narrative tone\n" +
                        "                  is similar to Kafka's, especially in The Trial, whose individual sentences potentially have multiple\n" +
                        "                  meanings; the material often pointedly resonating as stark allegory of phenomenal consciousness and\n" +
                        "                  the human condition."}
                    </p>
                  </div>

                  {book.genres.length > 0 ? (
                    <div className="mt-4">
                      <span className="text-normal text-gray-700">Genres: </span>
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

                  <Divider className="my-5 w-full"/>

                  <h3 className="text-lg font-semibold text-gray-500">Comments</h3>

                  <Divider className="my-5 w-full"/>

                  <div>

                  </div>
                </div>
              </>
            ) : (
              <div>
                <Empty/>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
};

export default BookItem;