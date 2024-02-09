'use client'

import React, {Suspense} from "react";

import HomeComponent from "@/components/Home";

export default function Home() {
  return (
    <>
      <Suspense>
        <HomeComponent/>
      </Suspense>
    </>
  );
}
