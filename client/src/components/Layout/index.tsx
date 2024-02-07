'use client'

import React, {FC, ReactNode} from 'react';
import {Layout} from 'antd';
import FooterLayout from "@/components/Layout/FooterLayout";
import HeaderLayout from "@/components/Layout/HeaderLayout";

const {Content} = Layout;

const AppLayout: FC<{
  children: ReactNode;
}> = ({children}) => {
  return (
    <Layout className="min-h-screen">
      <HeaderLayout/>
      <Content className="w-3/5 mx-auto pb-8">
        <div className="p-6 min-h-96 bg-transparent rounded-none">
          {children}
        </div>
      </Content>
      <FooterLayout/>
    </Layout>
  );
};

export default AppLayout;