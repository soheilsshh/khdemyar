"use client";
import React from "react";
import RegisterRequests from "../_components/RegisterRequests";

const requests = [
  {
    firstName: "مینا",
    lastName: "رحمانی",
    nationalCode: "1234567890",
    phone: "09121234567",
    criminalRecord: "ندارد",
    education: "کارشناسی",
    status: 2,
  },
  {
    firstName: "فاطمه",
    lastName: "محمدی",
    nationalCode: "5566778899",
    phone: "09141234567",
    criminalRecord: "ندارد",
    education: "کارشناسی",
    status: 2,
  },
  {
    firstName: "زهرا",
    lastName: "حسینی",
    nationalCode: "3344556677",
    phone: "09161234567",
    criminalRecord: "ندارد",
    education: "کارشناسی",
    status: 2,
  },
  {
    firstName: "رضا",
    lastName: "کریمی",
    nationalCode: "7788990011",
    phone: "09191234567",
    criminalRecord: "دارد",
    education: "دیپلم",
    status: 2,
  },
  {
    firstName: "امیر",
    lastName: "جعفری",
    nationalCode: "9900112233",
    phone: "09211234567",
    criminalRecord: "ندارد",
    education: "کارشناسی ارشد",
    status: 2,
  },
  {
    firstName: "سارا",
    lastName: "باقری",
    nationalCode: "3030404050",
    phone: "09241234567",
    criminalRecord: "ندارد",
    education: "کارشناسی",
    status: 2,
  },
  {
    firstName: "کامران",
    lastName: "نجفی",
    nationalCode: "6060707080",
    phone: "09271234567",
    criminalRecord: "دارد",
    education: "دیپلم",
    status: 2,
  },
  {
    firstName: "نسرین",
    lastName: "عباسی",
    nationalCode: "9090000111",
    phone: "09301234567",
    criminalRecord: "ندارد",
    education: "کارشناسی",
    status: 2,
  },
  {
    firstName: "علیرضا",
    lastName: "محمدزاده",
    nationalCode: "1111222233",
    phone: "09311234567",
    criminalRecord: "ندارد",
    education: "کارشناسی",
    status: 2,
  },
  {
    firstName: "مریم",
    lastName: "ابراهیمی",
    nationalCode: "2222333344",
    phone: "09321234567",
    criminalRecord: "ندارد",
    education: "کارشناسی ارشد",
    status: 2,
  },
  {
    firstName: "حمید",
    lastName: "رضازاده",
    nationalCode: "3333444455",
    phone: "09331234567",
    criminalRecord: "دارد",
    education: "دیپلم",
    status: 2,
  },
  {
    firstName: "شهرزاد",
    lastName: "مهدوی",
    nationalCode: "4444555566",
    phone: "09341234567",
    criminalRecord: "ندارد",
    education: "کارشناسی",
    status: 2,
  },
  {
    firstName: "نیلوفر",
    lastName: "عبدی",
    nationalCode: "5555666677",
    phone: "09351234567",
    criminalRecord: "ندارد",
    education: "کارشناسی",
    status: 2,
  },
  {
    firstName: "مجید",
    lastName: "عزیزی",
    nationalCode: "6666777788",
    phone: "09361234567",
    criminalRecord: "ندارد",
    education: "کارشناسی ارشد",
    status: 2,
  },
  {
    firstName: "رویا",
    lastName: "فریدی",
    nationalCode: "7777888899",
    phone: "09371234567",
    criminalRecord: "ندارد",
    education: "کارشناسی",
    status: 2,
  }
];

function Page() {
  return (
    <div>
      <RegisterRequests title="درخواست های بررسی نشده" requests={requests} />
    </div>
  );
}

export default Page;
