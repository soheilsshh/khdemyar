'use client';
import { motion, AnimatePresence } from "framer-motion";

import { MdKeyboardDoubleArrowRight, MdKeyboardDoubleArrowLeft } from "react-icons/md";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import React, { useEffect } from 'react';
import moment from 'moment-jalaali';
import { toJalaali, toGregorian, jalaaliMonthLength } from 'jalaali-js';

const months = [
    "فروردین", "اردیبهشت", "خرداد", "تیر", "مرداد", "شهریور",
    "مهر", "آبان", "آذر", "دی", "بهمن", "اسفند"
];

const islamicEvents = [
    { "date": { "month": 1, "day": 1 }, "name": "آغاز سال هجری قمری" },
    { "date": { "month": 1, "day": 2 }, "name": "ورود امام حسین (ع) به کربلا" },
    { "date": { "month": 1, "day": 9 }, "name": "تاسوعا" },
    { "date": { "month": 1, "day": 10 }, "name": "عاشورا - شهادت امام حسین (ع)" },
    { "date": { "month": 1, "day": 25 }, "name": "شهادت امام سجاد (ع)" },

    { "date": { "month": 2, "day": 7 }, "name": "شهادت امام حسن مجتبی (ع)" },
    { "date": { "month": 2, "day": 20 }, "name": "اربعین حسینی" },
    { "date": { "month": 2, "day": 28 }, "name": "رحلت پیامبر اکرم (ص)" },
    { "date": { "month": 2, "day": 29 }, "name": "شهادت امام رضا (ع)" },

    { "date": { "month": 3, "day": 8 }, "name": "شهادت حضرت فاطمه زهرا (س) - روایت اول" },
    { "date": { "month": 3, "day": 17 }, "name": "ولادت پیامبر اکرم (ص)" },
    { "date": { "month": 3, "day": 17 }, "name": "ولادت امام جعفر صادق (ع)" },

    { "date": { "month": 4, "day": 5 }, "name": "شهادت حضرت فاطمه زهرا (س) - روایت دوم" },

    { "date": { "month": 6, "day": 3 }, "name": "شهادت امام موسی کاظم (ع)" },

    { "date": { "month": 7, "day": 13 }, "name": "ولادت امام علی (ع)" },
    { "date": { "month": 7, "day": 27 }, "name": "مبعث پیامبر اکرم (ص)" },

    { "date": { "month": 8, "day": 3 }, "name": "ولادت امام حسین (ع)" },
    { "date": { "month": 8, "day": 4 }, "name": "ولادت حضرت ابوالفضل (ع)" },
    { "date": { "month": 8, "day": 5 }, "name": "ولادت امام سجاد (ع)" },
    { "date": { "month": 8, "day": 11 }, "name": "ولادت علی‌اکبر (ع)" },
    { "date": { "month": 8, "day": 15 }, "name": "ولادت امام مهدی (عج)" },

    { "date": { "month": 9, "day": 10 }, "name": "ولادت امام حسن مجتبی (ع)" },
    { "date": { "month": 9, "day": 19 }, "name": "ضربت خوردن امام علی (ع)" },
    { "date": { "month": 9, "day": 21 }, "name": "شهادت امام علی (ع)" },

    { "date": { "month": 10, "day": 1 }, "name": "عید سعید فطر" },
    { "date": { "month": 10, "day": 25 }, "name": "شهادت امام جعفر صادق (ع)" },

    { "date": { "month": 11, "day": 7 }, "name": "ولادت امام رضا (ع)" },

    { "date": { "month": 12, "day": 7 }, "name": "شهادت امام محمد باقر (ع)" },
    { "date": { "month": 12, "day": 8 }, "name": "روز عرفه" },
    { "date": { "month": 12, "day": 9 }, "name": "عید قربان" },
    { "date": { "month": 12, "day": 18 }, "name": "عید غدیر خم" },
    { "date": { "month": 12, "day": 24 }, "name": "روز مباهله" }
];

const hijriValue = {
    1: ["09/20", "09/29", "10/21"],
    2: ["10/22", "10/29", "11/23"],
    3: ["11/24", "11/29", "12/25"],
    4: ["12/26", "12/30", "01/26"],
    5: ["01/27", "01/29", "02/28"],
    6: ["02/29", "02/30", "03/29"],
    7: ["03/30", "03/30", "04/29"],
    8: ["05/01", "05/30"],
    9: ["06/01", "06/30"],
    10: ["07/01", "07/30"],
    11: ["08/01", "08/29", "09/01"],
    12: ["09/02", "09/30"],
}

const getWeekdayOfFirstOfMonth = (jy, jm) => {
    const { gy, gm, gd } = toGregorian(jy, jm, 1);
    const date = new Date(gy, gm - 1, gd);
    return date.getDay() === 6 ? 0 : date.getDay() + 1;
};

const getIslamicDate = (gy, gm, gd) => {
    try {
        const baseDate = new Date(gy, gm - 1, gd);
        baseDate.setDate(baseDate.getDate() - 1);

        const formatter = new Intl.DateTimeFormat('ar-TN-u-ca-islamic', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
        });

        const parts = formatter.formatToParts(baseDate);
        const day = +parts.find(p => p.type === 'day')?.value;
        const month = +parts.find(p => p.type === 'month')?.value;
        const year = +parts.find(p => p.type === 'year')?.value;
        return { day, month, year };
    } catch {
        return null;
    }
};

const Calendar = ({
    selectedYear,
    selectedMonth,
    selectedDay,
    onChangeDate,
    monthlyEvents,
    modal = false,
    setMonthlyEvents
}) => {
    const today = new Date();
    const jToday = toJalaali(today.getFullYear(), today.getMonth() + 1, today.getDate());

    const getDaysInMonth = (month, year) => jalaaliMonthLength(year, month);

    const getGregorianDate = (jy, jm, jd) => toGregorian(jy, jm, jd);

    const isIslamicEvent = (gy, gm, gd) => {
        const hijri = getIslamicDate(gy, gm, gd);
        return hijri && islamicEvents.find(event => event.date.month === hijri.month && event.date.day === hijri.day);
    };

    const generateCalendarMatrix = (daysInMonth, startIndex, daysInPrevMonth) => {
        const totalCells = 42;
        const matrix = [];
        const startPrev = daysInPrevMonth - startIndex + 1;

        for (let i = startPrev; i <= daysInPrevMonth; i++) matrix.push({ day: i, from: 'prev' });
        for (let i = 1; i <= daysInMonth; i++) matrix.push({ day: i, from: 'current' });
        for (let i = 1; matrix.length < totalCells; i++) matrix.push({ day: i, from: 'next' });

        const result = [];
        for (let i = 0; i < 6; i++) result.push(matrix.slice(i * 7, i * 7 + 7));


        const lastRow = result[result.length - 1];
        const hasCurrentMonthDay = lastRow.some(cell => cell.from === 'current');
        if (!hasCurrentMonthDay) result.pop();

        return result;
    };

    const convertHijriValueToRanges = (hijriValue) => {
        const parseDate = str => {
            const [month, day] = str.split('/').map(s => parseInt(s, 10));
            return { month, day };
        };

        const hijriRanges = {};

        for (const [shamsiMonth, dateArray] of Object.entries(hijriValue)) {
            const monthIndex = parseInt(shamsiMonth, 10);
            hijriRanges[monthIndex] = [];

            for (let i = 0; i < dateArray.length; i += 2) {
                const from = parseDate(dateArray[i]);
                const to = dateArray[i + 1] ? parseDate(dateArray[i + 1]) : from;
                hijriRanges[monthIndex].push({ from, to });
            }
        }

        return hijriRanges;
    };

    // const hijriRanges = convertHijriValueToRanges(hijriValue);

    const hijriRanges = {
        1: [
            { from: { month: 9, day: 20 }, to: { month: 9, day: 29 } },
            { from: { month: 10, day: 1 }, to: { month: 10, day: 21 } },
        ],
        2: [
            { from: { month: 10, day: 22 }, to: { month: 10, day: 29 } },
            { from: { month: 11, day: 1 }, to: { month: 11, day: 23 } },
        ],
        3: [
            { from: { month: 11, day: 24 }, to: { month: 11, day: 29 } },
            { from: { month: 12, day: 1 }, to: { month: 12, day: 25 } },
        ],
        4: [
            { from: { month: 12, day: 26 }, to: { month: 12, day: 30 } },
            { from: { month: 1, day: 1 }, to: { month: 1, day: 26 } },
        ],
        5: [
            { from: { month: 1, day: 27 }, to: { month: 1, day: 29 } },
            { from: { month: 2, day: 1 }, to: { month: 2, day: 28 } },
        ],
        6: [
            { from: { month: 2, day: 29 }, to: { month: 2, day: 30 } },
            { from: { month: 3, day: 1 }, to: { month: 3, day: 29 } },
        ],
        7: [
            { from: { month: 3, day: 30 }, to: { month: 3, day: 30 } },
            { from: { month: 4, day: 1 }, to: { month: 4, day: 29 } },
        ],
        8: [
            { from: { month: 5, day: 1 }, to: { month: 5, day: 30 } },
        ],
        9: [
            { from: { month: 6, day: 1 }, to: { month: 6, day: 30 } },
        ],
        10: [
            { from: { month: 7, day: 1 }, to: { month: 7, day: 30 } },
        ],
        11: [
            { from: { month: 8, day: 1 }, to: { month: 8, day: 29 } },
            { from: { month: 9, day: 1 }, to: { month: 9, day: 1 } },
        ],
        12: [
            { from: { month: 9, day: 2 }, to: { month: 9, day: 30 } },
        ],
    };

    console.log(hijriRanges)

    const getDate = (hijriRanges, month, day) => {
        const targetMonth = hijriRanges[month];
        const arryLentgh = targetMonth.map((item, index) => {
            return item.to.day - item.from.day + 1
        })
        if (day <= arryLentgh[0]) {
            console.log("arryLentgh", arryLentgh)
            return { month: targetMonth[0].from.month, day: targetMonth[0].from.day + day - 1 }
        } else {
            return { month: targetMonth[1]?.from.month, day: day - arryLentgh[0] }
        }


    }
    const date = getDate(hijriRanges, 9, 1);
    console.log("date", date)

    const calendar = generateCalendarMatrix(
        getDaysInMonth(selectedMonth, selectedYear),
        getWeekdayOfFirstOfMonth(selectedYear, selectedMonth),
        getDaysInMonth(selectedMonth === 1 ? 12 : selectedMonth - 1, selectedMonth === 1 ? selectedYear - 1 : selectedYear)
    );

    const handleSelectDay = (day, from) => {
        if (from === "current") {
            onChangeDate({
                year: selectedYear,
                month: selectedMonth,
                day: day,
                isDayClick: true 
            });
        }
    };


    useEffect(() => {
        const events = [];
        const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);

        for (let d = 1; d <= daysInMonth; d++) {
            const { gy, gm, gd } = getGregorianDate(selectedYear, selectedMonth, d);
            const hijri = getIslamicDate(gy, gm, gd);

            if (hijri) {
                const found = islamicEvents.find(e => e.date.month === hijri.month && e.date.day === hijri.day);
                if (found) {
                    events.push({
                        name: found.name,
                        hijriDay: hijri.day,
                        hijriMonth: hijri.month,
                        hijriYear: hijri.year,
                        jDay: d,
                        jMonth: selectedMonth,
                        jYear: selectedYear,
                    });
                }
            }
        }

        setMonthlyEvents(events);
    }, [selectedMonth, selectedYear]);


    return (
        <div className={`${modal ? "p-2" : "p-5 mt-5 max-w-md"} flex flex-col  bg-white rounded-2xl  mx-auto`}>
            <div className='flex justify-between items-center pb-5'>
                <div className='flex gap-3 items-center'>
                    <button onClick={() => onChangeDate({ year: selectedYear + 0, month: selectedMonth === 12 ? 1 : selectedMonth + 1, day: 1 })} className='p-1 hover:bg-gray-100 rounded'>
                        <IoIosArrowForward size={20} />
                    </button>
                    <button onClick={() => onChangeDate({ year: selectedYear + 1, month: selectedMonth, day: 1 })} className='p-1 hover:bg-gray-100 rounded'>
                        <MdKeyboardDoubleArrowRight size={25} />
                    </button>
                </div>
                <div className='flex gap-2 text-lg font-medium'>
                    <span>{months[selectedMonth - 1]}</span>
                    <span>سال</span>
                    <span>{selectedYear}</span>
                </div>
                <div className='flex gap-3 items-center'>
                    <button onClick={() => onChangeDate({ year: selectedYear - 1, month: selectedMonth, day: 1 })} className='p-1 hover:bg-gray-100 rounded'>
                        <MdKeyboardDoubleArrowLeft size={25} />
                    </button>
                    <button onClick={() => onChangeDate({ year: selectedYear + 0, month: selectedMonth === 1 ? 12 : selectedMonth - 1, day: 1 })} className='p-1 hover:bg-gray-100 rounded'>
                        <IoIosArrowBack size={20} />
                    </button>
                </div>
            </div>

            <div className='flex justify-around text-xs font-medium text-gray-600 mb-2'>
                {["شنبه", "یک‌شنبه", "دوشنبه", "سه‌شنبه", "چهارشنبه", "پنج‌شنبه", "جمعه"].map((day, idx) => (
                    <span key={idx} className="w-12 text-center">{day}</span>
                ))}
            </div>

            <AnimatePresence mode="wait">
                <motion.div
                    key={`${selectedYear}-${selectedMonth}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className={`grid grid-cols-7 gap-1 ${modal ? "gap-x-1" : ""} `}
                >
                    {calendar.flat().map((cell, idx) => {
                        const { day: d, from } = cell;
                        const { gy, gm, gd } = getGregorianDate(selectedYear, selectedMonth, d);
                        // const hijri = getIslamicDate(gy, gm, gd);
                        const hijri = getDate(hijriRanges, selectedMonth, d);
                        const event = isIslamicEvent(gy, gm, gd);
                        // console.log("date month:" , selectedMonth)
                        // console.log("date day:" , gd)
                        // console.log("date gm gd :" , selectedMonth , gd ,  hijri.day)

                        const isToday = d === jToday.jd && selectedMonth === jToday.jm && selectedYear === jToday.jy;
                        const isSelected = d === selectedDay;

                        // console.log("miladi :", gy, gm, gd)
                        // console.log("hijri :", hijri.year, hijri.month, hijri.day)
                        // console.log(d , from , isSelected , event)
                        return (
                            <div
                                key={idx}
                                onClick={() => handleSelectDay(d, from)}
                                className={`
                                p-2 rounded text-center  mx-auto relative
                                ${modal ? "w-11 h-14" : "w-12 h-16"}
                                ${from === 'current' ? 'text-black bg-[#10ac84]/20 cursor-pointer' : 'text-gray-400'}
                                ${isToday && from === 'current' ? 'bg-dGreen text-white' : ''}
                                ${isSelected && from === 'current' ? 'bg-dMain text-white' : ''}
                            
                                ${event && !isSelected && from === 'current' ? 'bg-red-100 border border-red-400 ' : ''}
                                ${event && isSelected && from === 'current' ? 'bg-dMain border-2 border-red-300' : ''}
                            `}
                            >
                                <div className='text-sm'>{d}</div>
                                {from === 'current' && (
                                    <div className='absolute flex items-center bottom-0 right-0 left-0 mx-auto p-2 justify-between w-full text-[10px] text-gray-500'>
                                        <div className="font-sans -translate-y-[2px]">{`${gd}`}</div>
                                        {hijri && <div>{`${hijri.day}`}</div>}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </motion.div>
            </AnimatePresence>

        </div>
    );
};

export default Calendar;
