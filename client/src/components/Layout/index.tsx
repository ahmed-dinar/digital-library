'use client'

import React, {FC, ReactNode} from 'react';
import {Layout} from 'antd';
import FooterLayout from "@/components/Layout/FooterLayout";
import HeaderLayout from "@/components/Layout/HeaderLayout";
import LibraryProvider from "@/components/Library/LibraryContext/LibraryContext";

const {Content} = Layout;


const AppLayout: FC<{
  children: ReactNode;
}> = ({children}) => {
  return (
    <LibraryProvider>
      <Layout className="min-h-screen bg-white">
        <HeaderLayout/>
        <Content className="max-w-7xl px-5 mx-auto py-6">
          <div className="min-h-96 bg-transparent rounded-none">
            {children}
          </div>
        </Content>
        <FooterLayout/>
      </Layout>
    </LibraryProvider>
  );
};

export default AppLayout;