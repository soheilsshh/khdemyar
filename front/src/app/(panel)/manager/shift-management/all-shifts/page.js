"use client"
import React, { useState } from "react";
import AllShiftsTable from "../_components/AllShiftsTable";
import DropdownCalendar from "@/components/DropdownCalendar";
import { toJalaali } from "jalaali-js";

function Page() {
  const today = toJalaali(new Date());
  const [date, setDate] = useState({
    year: today.jy,
    month: today.jm,
    day: today.jd,
  });

  const [activeDate , setActiveDate] = useState(false)

  const requests = [
    {
      date: "1404/05/01",
      from: "08:00",
      to: "12:00",
      all: 25,
      man: 15,
      woman: 10,
      status: 0,
      suitable: "جشن فارغ‌التحصیلی دانشگاه",
    },
    {
      date: "1404/05/02",
      from: "09:00",
      to: "13:00",
      all: 30,
      man: 18,
      woman: 12,
      status: 1,
      suitable: "جلسه کاری شرکت",
    },
    {
      date: "1404/05/03",
      from: "10:00",
      to: "14:00",
      all: 22,
      man: 11,
      woman: 11,
      status: 2,
      suitable: "برگزاری کارگاه آموزشی تخصصی",
    },
    {
      date: "1404/05/04",
      from: "08:30",
      to: "12:30",
      all: 28,
      man: 16,
      woman: 12,
      status: 0,
      suitable: "جشن تولد",
    },
    {
      date: "1404/05/05",
      from: "09:30",
      to: "13:30",
      all: 35,
      man: 20,
      woman: 15,
      status: 1,
      suitable: "همایش علمی پژوهشی بین‌المللی",
    },
    {
      date: "1404/05/06",
      from: "08:00",
      to: "12:00",
      all: 18,
      man: 9,
      woman: 9,
      status: 2,
      suitable: "مراسم تقدیر از کارکنان",
    },
    {
      date: "1404/05/07",
      from: "10:00",
      to: "14:00",
      all: 26,
      man: 14,
      woman: 12,
      status: 0,
      suitable: "نمایشگاه فرهنگی هنری",
    },
    {
      date: "1404/05/08",
      from: "09:00",
      to: "13:00",
      all: 32,
      man: 17,
      woman: 15,
      status: 1,
      suitable: "جلسه عمومی هیئت مدیره",
    },
    {
      date: "1404/05/09",
      from: "08:30",
      to: "12:30",
      all: 20,
      man: 10,
      woman: 10,
      status: 2,
      suitable: "کارگاه مهارت‌های نرم",
    },
    {
      date: "1404/05/10",
      from: "09:30",
      to: "13:30",
      all: 27,
      man: 13,
      woman: 14,
      status: 0,
      suitable: "مراسم خیریه کمک به دانش‌آموزان",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center px-5">
        <div className="text-xl font-iranianSansDemiBold">همه شیفت ها</div>
        <div className="flex justify-center items-center gap-2">
          <DropdownCalendar
            value={date}
            onChange={(newDate) => setDate(newDate)}
            disabled={activeDate} 
          />
          <div onClick={()=>setActiveDate(prev => !prev)} className="border-2 w-5 h-5 p-1 rounded-full cursor-pointer">
            <div className= {`${activeDate ? "hidden" : "block"} bg-black h-full w-full rounded-full`}></div>
          </div>
        </div>
      </div>
      <AllShiftsTable requests={requests} />
    </div>
  );
}

export default Page;
