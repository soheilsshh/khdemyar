"use client"
import AddImagesDynamic from "@/components/AddImageUploader";
import TextAreaTypeOne from "@/components/TextAreaTypeOne";
import React from "react";
import ButtonTypeOne from "@/components/ButtonTypeOne";

function page() {
  return (
    <div className="mx-5 md:mx-30 my-10">
      <div className="flex flex-col items-center" dir="rtl">
        <h1 className="w-full text-xl py-10">مطالب جدید</h1>
        <TextAreaTypeOne
          placeholder="متن خود را وارد کنید "
          className="h-[350px]"
        />
        <AddImagesDynamic />
      </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-5">
        <ButtonTypeOne
          className="p-2 rounded-xl border-3 bg-green-500 shadow-lg hover:bg-green-600 hover:text-white transition-all cursor-pointer  border-green-700 w-[250px]"
          text="ذخیره"
        />

        <ButtonTypeOne
          className="p-2 rounded-xl border-3 bg-green-100 shadow-lg hover:bg-green-600 hover:text-white transition-all cursor-pointer  border-green-700 w-[250px]"
          text="لغو"
        />
      </div>
    </div>
  );
}

export default page;
