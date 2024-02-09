'use client'

import React, {FC, ReactNode, Suspense} from 'react';
import {Layout} from 'antd';
import FooterLayout from "@/components/Layout/FooterLayout";
import HeaderLayout from "@/components/Layout/HeaderLayout";
import LibraryProvider from "@/components/Library/LibraryContext/LibraryContext";
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';

const AppLayout: FC<{
  children: ReactNode;
}> = ({children}) => {
  return (
    <Suspense>
      <ErrorBoundary>
        <LibraryProvider>
          <Layout className={'min-h-screen bg-white'}>
            <HeaderLayout/>
            <div className="container px-40 mx-auto pt-6">
              <div className="min-h-screen bg-transparent rounded-none">
                {children}
              </div>
            </div>
            <FooterLayout/>
          </Layout>
        </LibraryProvider>
      </ErrorBoundary>
    </Suspense>
  );
};

export default AppLayout;