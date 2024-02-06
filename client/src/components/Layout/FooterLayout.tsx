'use client'

import React, {FC, ReactNode} from "react";
import {Layout, Menu, theme} from 'antd';

const {Footer} = Layout;

const FooterLayout: FC = () => {

  return (
    <Footer style={{textAlign: 'center', background: '#F6F9FE', padding: '50px 20px 15px 20px', borderTop: '1px solid #eaeaea'}}>
      <div>
        Ahmed ©{new Date().getFullYear()}
      </div>
    </Footer>
  );
};

export default FooterLayout;