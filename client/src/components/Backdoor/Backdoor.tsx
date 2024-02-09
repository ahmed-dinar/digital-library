'use client'

import React, {FC, useContext, useState} from "react";
import {Button, message, Spin} from "antd";
import {MinusOutlined, PlusOutlined} from "@ant-design/icons";
import {clearBookSeed, seedBook} from "@/actions/books.action";
import {LibraryContext, LibraryContextType} from "@/components/Library/LibraryContext/LibraryContext";

type PropType = {};

const Backdoor: FC<PropType> = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState<boolean>(false);
  const {fetchAuthors, fetchGenres} = useContext<LibraryContextType>(LibraryContext);

  async function seed() {
    setLoading(true);
    try {
      await seedBook();
      messageApi.open({
        type: 'success',
        content: 'Book seed done!',
      });
      fetchAuthors();
      fetchGenres();
    } catch (err: any) {
      console.log(err);
      messageApi.open({
        type: 'error',
        content: err?.response?.data?.message || 'Something went wrong seeding book!',
      });
    }
    setLoading(false);
  }

  async function clearSeed() {
    setLoading(true);
    try {
      await clearBookSeed();
      messageApi.open({
        type: 'success',
        content: 'Clear Book seed done!',
      });
      fetchAuthors();
      fetchGenres();
    } catch (err: any) {
      console.log(err);
      messageApi.open({
        type: 'error',
        content: err?.response?.data?.message || 'Something went wrong clear seeding book!',
      });
    }
    setLoading(false);
  }

  return (
    <>
      {contextHolder}
      <Spin spinning={loading} delay={500}>
        <div className="flex flex-row gap-3">
          <Button
            size={'large'}
            type="primary"
            icon={<PlusOutlined/>}
            onClick={seed}
            className="hover:bg-neutral-800 hover:text-slate-100"
          >
            Seed
          </Button>
          <Button
            size={'large'}
            type="default"
            icon={<MinusOutlined/>}
            onClick={clearSeed}
            className="hover:bg-neutral-800 hover:text-slate-100"
          >
            Clear Seed
          </Button>
        </div>
      </Spin>
    </>
  );
};

export default Backdoor;
