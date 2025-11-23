"use client";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

function Page({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isForgot = pathname.includes("forgotten-password")
  return (
    <div className="col-span-full gap-5 lg:h-100 lg:bg-green-50 rounded-4xl p-5 lg:p-10 w-full">
      <div className="w-full justify-center text-green-800 items-center text-2xl font-iranianSansHeavy text-center">
        {isForgot ? "بازیابی رمز عبور" : "ورود"}

      </div>
      <div className="flex flex-col mt-2 justify-between h-full py-5 pb-4">
        {children}
        <div className={`flex ${isForgot ? "items-end" : "items-center"}  justify-between`}>
          <div className="flex max-lg:mt-5 gap-2 text-sm">
            حساب کاربری ندارید؟
            <span
              onClick={() => router.push("/register")}
              className="text-green-700 font-iranianSansDemiBold cursor-pointer"
            >
              ثبت نام
            </span>
          </div>
          <div className="flex justify-end">
            {isForgot ? (
              <Link href="/login">
                <span className="text-green-700 text-sm font-iranianSansDemiBold">ورود</span>
              </Link>
            ) : (
              <Link href="/login/forgotten-password">
                <span className="text-green-700 text-sm font-iranianSansDemiBold"> فراموشی رمز عبور</span>
              </Link>
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

export default Page;
