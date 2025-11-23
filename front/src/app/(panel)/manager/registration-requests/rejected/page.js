"use client";
import React from "react";
import RegisterRequests from "../_components/RegisterRequests";

const requests = [
  {
    firstName: "علی",
    lastName: "احمدی",
    nationalCode: "1122334455",
    phone: "09131234567",
    criminalRecord: "ندارد",
    education: "کارشناسی ارشد",
    status: 0,
  },
  {
    firstName: "محمد",
    lastName: "علوی",
    nationalCode: "4455667788",
    phone: "09171234567",
    criminalRecord: "ندارد",
    education: "کارشناسی ارشد",
    status: 0,
  },
  {
    firstName: "نرگس",
    lastName: "صادقی",
    nationalCode: "8899001122",
    phone: "09201234567",
    criminalRecord: "ندارد",
    education: "کارشناسی",
    status: 0,
  },
  {
    firstName: "بهرام",
    lastName: "شریفی",
    nationalCode: "2020303040",
    phone: "09231234567",
    criminalRecord: "دارد",
    education: "دیپلم",
    status: 0,
  },
  {
    firstName: "شیما",
    lastName: "طاهری",
    nationalCode: "5050606070",
    phone: "09261234567",
    criminalRecord: "ندارد",
    education: "کارشناسی",
    status: 0,
  },
  {
    firstName: "مهدی",
    lastName: "قاسمی",
    nationalCode: "8080909000",
    phone: "09291234567",
    criminalRecord: "ندارد",
    education: "کارشناسی ارشد",
    status: 0,
  },
  {
    firstName: "امیرحسین",
    lastName: "مرادی",
    nationalCode: "1010101010",
    phone: "09381234567",
    criminalRecord: "دارد",
    education: "دیپلم",
    status: 0,
  },
  {
    firstName: "مهناز",
    lastName: "زارعی",
    nationalCode: "2020202020",
    phone: "09391234567",
    criminalRecord: "ندارد",
    education: "کارشناسی",
    status: 0,
  },
  {
    firstName: "هادی",
    lastName: "نظری",
    nationalCode: "3030303030",
    phone: "09401234567",
    criminalRecord: "دارد",
    education: "دیپلم",
    status: 0,
  },
  {
    firstName: "آرزو",
    lastName: "محمدیان",
    nationalCode: "4040404040",
    phone: "09411234567",
    criminalRecord: "ندارد",
    education: "کارشناسی",
    status: 0,
  },
  {
    firstName: "سینا",
    lastName: "قربانی",
    nationalCode: "5050505050",
    phone: "09421234567",
    criminalRecord: "ندارد",
    education: "کارشناسی ارشد",
    status: 0,
  },
  {
    firstName: "روحانه",
    lastName: "علیزاده",
    nationalCode: "6060606060",
    phone: "09431234567",
    criminalRecord: "دارد",
    education: "دیپلم",
    status: 0,
  }
];

function Page() {
  return (
    <div>
      <RegisterRequests title="درخواست های رد شده" requests={requests} />
    </div>
  );
}

export default Page;
