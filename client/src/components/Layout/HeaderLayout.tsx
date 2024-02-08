'use client'

import React, {FC, useState} from "react";
import {Button, Layout} from 'antd';
import {PlusCircleOutlined} from "@ant-design/icons";
import UpsertBook from "@/components/UpsertBook/UpsertBook";
import {useRouter} from "next/navigation";
import Link from "next/link";
import SearchBook from "@/components/SearchBook/SearchBook";

const {Header} = Layout;

const HeaderLayout: FC = () => {
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);
  const router = useRouter();

  return (
    <Header className="bg-white sticky top-0 z-50 w-full flex border-b border-solid border-gray-200 h-20">
      <div className="w-3/4 border-0 mx-auto h-full flex items-center justify-between">

        <div className="flex shrink-0 w-56 border-0 justify-center">
          <Link href="/" scroll={false}>
            <h2 className="text-xl font-bold align-middle inline-block pb-2 cursor-pointer text-gray-800">
              Bibliotheca
            </h2>
          </Link>
        </div>

        <div className="flex flex-auto border-0 justify-center">
          <div className="w-96">
            <SearchBook/>
          </div>
        </div>

        <div className="w-72 flex shrink-0 justify-center">
          <Button
            type="default"
            icon={<PlusCircleOutlined/>}
            size={'large'}
            className="rounded-xl hover:bg-gray-900 hover:text-slate-100"
            onClick={() => setIsBookModalOpen(!isBookModalOpen)}
          >
            Add Book
          </Button>
        </div>

      </div>

      <UpsertBook isBookModalOpen={isBookModalOpen} setIsBookModalOpen={setIsBookModalOpen}/>
    </Header>
  );
};

export default HeaderLayout;