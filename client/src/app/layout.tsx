import type {Metadata} from "next";
import {AntdRegistry} from '@ant-design/nextjs-registry';

import {Inter} from "next/font/google";
import "./globals.css";
import 'animate.css';
import AppLayout from "@/components/Layout";

const inter = Inter({subsets: ["latin"]});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
                                     children,
                                   }: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={inter.className}>
      <AntdRegistry>
        <AppLayout>
          {children}
        </AppLayout>
      </AntdRegistry>
    </body>
    </html>
  );
}