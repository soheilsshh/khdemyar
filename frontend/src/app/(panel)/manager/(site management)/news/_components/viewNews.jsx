"use client";
import React from "react";
import FilterNews from "./filterNews";
import { useRouter } from "next/navigation";
import ButtonTypeOne from "@/components/ButtonTypeOne";

function ViewNews() {
  const router = useRouter();
  return (
    <div className="mx-5 my-10 md:mx-30">
      <div className="flex justify-between items-center">
        <div className="my-10 text-xl">
          <h1>لیست اخبار</h1>
        </div>
        <ButtonTypeOne
          className="p-2 rounded-xl border-3 bg-green-500 shadow-lg hover:bg-green-600 hover:text-white transition-all cursor-pointer  border-green-700 w-[200px]"
          text="اضافه کردن اخبار"
          onClick={() => {
            router.push("/manager/news/add");
          }}
        />
      </div>
      <FilterNews />
    </div>
  );
}

export default ViewNews;
