'use client'

import React, {FC, ReactNode} from 'react';
import {Layout, theme, ConfigProvider} from 'antd';
import FooterLayout from "@/components/Layout/FooterLayout";
import HeaderLayout from "@/components/Layout/HeaderLayout";

const {Content} = Layout;

const AppLayout: FC<{
  children: ReactNode;
}> = ({children}) => {
  const { defaultAlgorithm } = theme;

  const {
    token: {colorBgContainer, borderRadiusLG},
  } = theme.useToken();

  return (
    <ConfigProvider
      theme={{
        algorithm: defaultAlgorithm
      }}
    >
      <Layout style={{
        minHeight: '100vh'
      }}>
        <HeaderLayout/>
        <Content style={{width: '60%', margin: '0 auto', paddingBottom: '30px'}}>
          <div
            style={{
              padding: 24,
              minHeight: 380,
              background: 'transparent',
              borderRadius: '0',
              // border: '1px solid grey'
            }}
          >
            {children}
          </div>
        </Content>
        <FooterLayout/>
      </Layout>
    </ConfigProvider>
  );
};

export default AppLayout;