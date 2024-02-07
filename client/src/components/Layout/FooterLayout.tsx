'use client'

import React, {FC} from "react";
import {Layout} from 'antd';

const {Footer} = Layout;

const FooterLayout: FC = () => {

  return (
    <Footer className="text-center bg-white pt-11 border-t border-solid border-gray-200">
      <div>
        <p className="text-sm font-bold text-gray-400">Ahmed ©{new Date().getFullYear()}</p>
      </div>
    </Footer>
  );
};

export default FooterLayout;