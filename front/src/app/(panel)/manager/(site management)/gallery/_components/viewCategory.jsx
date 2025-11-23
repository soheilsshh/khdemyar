"use client";
import React from "react";
import FilterCatgory from "./filterCategory";
import { useRouter } from "next/navigation";
import ButtonTypeOne from "@/components/ButtonTypeOne";

function ViewCategory() {
  const route = useRouter();
  return (
    <div className="mx-5 md:mx-30 my-10">
      <div className="flex justify-between items-center">
        <div className="my-10 text-xl">
          <h1>لیست دسته بندی</h1>
        </div>
        <ButtonTypeOne
          className="p-2 rounded-xl border-3 bg-green-500 shadow-lg hover:bg-green-600 hover:text-white transition-all cursor-pointer  border-green-700 w-[200px]"
          text=" اضافه کردن دسته بندی"
          onClick={() => {
            route.push("/manager/gallery/add");
          }}
        />
      </div>
      <FilterCatgory />
    </div>
  );
}

export default ViewCategory;
