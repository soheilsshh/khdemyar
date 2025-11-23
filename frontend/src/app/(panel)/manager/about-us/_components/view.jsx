"use client";
import React from "react";
import { useRouter } from "next/navigation";
import ShowImageComponent from "./showImage";
import ShowText from "./showText";
import ButtonTypeOne from "@/components/ButtonTypeOne";

function ViewPage() {
  const router = useRouter();

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        {" "}
        <h1 className="text-xl">درباره ما</h1>
        <button
          className="p-2 rounded-xl border-3 bg-green-500 shadow-lg hover:bg-green-600 hover:text-white transition-all cursor-pointer  border-green-700 w-[200px]"
          onClick={() => {
            router.push("/manager/about-us/add");
          }}
        >
          اضافه کردن مطالب
        </button>
      </div>
      <ShowText />
      <div className="flex flex-col justify-center gap-5 my-16">
        <h1 className="text-xl">عکس ها</h1>
        <ShowImageComponent src="/images/about.png" />
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

export default ViewPage;
