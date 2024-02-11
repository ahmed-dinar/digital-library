'use client'

import React, {FC, useState} from "react";
import {Button, Layout} from 'antd';
import {PlusCircleOutlined} from "@ant-design/icons";
import UpsertBook from "@/components/UpsertBook/UpsertBook";
import Link from "next/link";
import SearchBook from "@/components/SearchBook/SearchBook";
import {antonFont} from "@/app/fonts";
import {FiBookOpen} from "react-icons/fi";

const {Header} = Layout;

const HeaderLayout: FC = () => {
  const [isBookModalOpen, setIsBookModalOpen] = useState(false);

  return (
    <Header className="bg-white sticky top-0 z-50 w-full flex border-b border-solid border-gray-200 h-20 leading-none">
      <div className="container px-40 border-0 mx-auto h-full flex items-center">

        <div className="flex shrink-0 w-56 border-0 justify-start pl-2">
          <Link href="/" scroll={false}>
            <div className="flex flex-row">
              <FiBookOpen size={32} className="text-gray-900 mr-1"/>
              <h2
                className={'text-xl align-middle inline-block pb-2 cursor-pointer text-gray-800 ' + antonFont.className}>
                Bibliotheca
              </h2>
            </div>
          </Link>
        </div>

        <div className="flex flex-auto border-0 justify-center">
          <SearchBook/>
        </div>

        <div className="w-72 flex shrink-0 justify-end">
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