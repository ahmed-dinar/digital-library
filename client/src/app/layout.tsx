import type {Metadata} from "next";
import {AntdRegistry} from '@ant-design/nextjs-registry';

import '../lib/fonts/inter/inter.css';
import "./globals.css";
import 'animate.css';
import AppLayout from "@/components/Layout";
import {ConfigProvider} from "antd";
import {poppinsFont} from "@/app/fonts";

export const metadata: Metadata = {
  title: "Library",
  description: "An ocean of wisdom",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={poppinsFont.variable}>
    <AntdRegistry>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;",
          },
        }}
      >
        <AppLayout>
          {children}
        </AppLayout>
      </ConfigProvider>
    </AntdRegistry>
    </body>
    </html>
  );
}
