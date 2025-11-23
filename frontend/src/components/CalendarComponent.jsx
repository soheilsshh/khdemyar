"use client";
import React, { useState } from "react";
import Calendar from "@/components/Calendar";
import { toJalaali } from "jalaali-js";

function CalendarComponent({selectedDate , setSelectedDate}) {
  const [monthlyEvents, setMonthlyEvents] = useState([]);

  return (
    <div className="w-fit pb-5 bg-white rounded-2xl">
      <Calendar
        selectedYear={selectedDate.year}
        selectedMonth={selectedDate.month}
        selectedDay={selectedDate.day}
        onChangeDate={({ year, month, day }) =>
          setSelectedDate({ year, month, day })
        }
        monthlyEvents={monthlyEvents}
        setMonthlyEvents={setMonthlyEvents}
      />
      <div className="px-5 text-sm">
        {monthlyEvents.map((item, index) => {
          // console.log(item)
          return (
            <div className="flex items-center justify-start gap-2" key={index}>
              <div className="rounded-full bg-red-300 w-2 h-2"> </div>
              <div className="flex gap-2">
                <div>{item.jDay} </div>
                <div>{item.name}</div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  )
}

export default CalendarComponent