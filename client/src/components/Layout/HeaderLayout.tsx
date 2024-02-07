'use client'

import React, {FC} from "react";
import {Layout} from 'antd';

const {Header} = Layout;

const items = new Array(3).fill(null).map((_, index) => ({
  key: String(index + 1),
  label: `nav ${index + 1}`,
}));

const HeaderLayout: FC = () => {
  return (
    <Header className="bg-white sticky top-0 z-50 w-full flex shadow-sm">
      <div className="w-8/12 mx-auto">
        <h2 className="text-xl font-bold align-middle inline-block pb-2">Bibliotheca</h2>
      </div>
    </Header>
  );
};

export default HeaderLayout;