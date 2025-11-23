"use client";
import React from "react";
import StepOne from "./_components/StepOne";
import { useRouter } from "next/navigation";

function Page() {
  const router = useRouter();

  return (
    <div className="col-span-full gap-5 lg:h-100 lg:bg-green-50 rounded-4xl p-5 lg:p-10 w-full">
      <div className="w-full justify-center text-green-800 items-center text-2xl font-iranianSansHeavy text-center">
        ثبت نام
      </div>
      <div className="flex flex-col mt-5 justify-between h-full py-5 pb-7">
        <StepOne />
        <div className="flex max-lg:mt-5 gap-2 text-sm">
          حساب کاربری دارید؟
          <span
            onClick={() => router.push("/login")}
            className="text-green-700 font-iranianSansDemiBold cursor-pointer"
          >
            ورود
          </span>
        </div>
      </div>
    </div>
  );
}

export default Page;
