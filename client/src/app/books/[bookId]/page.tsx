'use client'

import React from "react";

import BookItem from "@/components/BookItem/BookItem";

export default function BooKItemPage({params}: any) {
  return (
    <>
      <BookItem bookId={params.bookId}/>
    </>
  );
}
