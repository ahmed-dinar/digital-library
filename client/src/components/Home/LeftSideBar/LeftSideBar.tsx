'use client'

import React, {FC} from "react";
import {Button, Divider} from "antd";
import {AuthorDto} from "@/types/author.types";
import {useRouter} from "next/navigation";

type PropType = {
  authors: AuthorDto[]
};

const LeftSideBar: FC<PropType> = ({authors}) => {
  const router = useRouter();

  return (
    <div className="w-full bg-white min-h-96 text-gray-700 border-0">
      <div className="overflow-hidden hover:overflow-auto h-screen hover:scrollbar-thumb-gray-700">
        <div className="flex flex-col p-4">
          <h3 className="text-base font-bold text-gray-400 mb-2">
            AUTHORS
          </h3>

          <Divider className="my-2"/>

          {authors.length > 0 ? (
            <div>
              {authors.map(author => (
                <div key={author.id} className="w-full mt-1">
                  <Button
                    type={'text'}
                    className="w-full text-left"
                    onClick={() => router.push(`/?authorId=${author.id}`)}
                  >
                    {author.name}
                  </Button>
                </div>
              ))}
            </div>
          ) : null}

        </div>
      </div>
    </div>
  );
};

export default LeftSideBar;