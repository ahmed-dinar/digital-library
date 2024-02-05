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
    <Header
      style={{
        background: '#ffffff',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        width: '100%',
        display: 'flex',
        boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03), 0 1px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px 0 rgba(0, 0, 0, 0.02)'
      }}
    >
      <div style={{width: '60%', margin: '0 auto'}}>
        <h2 style={{fontSize: '20px', fontWeight: '700'}}>Bibliotheca</h2>
      </div>
    </Header>
  );
};

export default HeaderLayout;