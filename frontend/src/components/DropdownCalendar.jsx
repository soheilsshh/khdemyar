"use client";
import React, { useState, useRef, useEffect } from "react";
import Calendar from "@/components/Calendar";

function DropdownCalendar({ value, onChange, disabled = false , className="" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [monthlyEvents, setMonthlyEvents] = useState([]);
    const dropdownRef = useRef(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleDateChange = ({ year, month, day, isDayClick }) => {
        if (onChange) {
            onChange({ year, month, day });
        }
        if (isDayClick) {
            setIsOpen(false);
        }
    };

    return (
        <div className="relative inline-block" ref={dropdownRef}>
            {/* Date display box */}
            <div
                onClick={() => {
                    if (!disabled) setIsOpen((prev) => !prev);
                }}
                className={` rounded-lg pr-4 py-2 cursor-pointer transition  translate-y-px
                    ${disabled ? " text-gray-400 cursor-not-allowed" : "border-gray-400 hover:border-blue-500"}
                `}
            >
                {`${value.year}/${value.month.toString().padStart(2, "0")}/${value.day
                    .toString()
                    .padStart(2, "0")}`}
            </div>

            {/* Dropdown calendar */}
            {!disabled && (
                <div
                    className={`absolute mt-2 origin-top transition-transform duration-200 z-50 -left-9 md:left-[100%] ${
                        isOpen
                            ? "scale-100 opacity-100"
                            : "scale-95 opacity-0 pointer-events-none"
                    }`}
                >
                    <div className="bg-white p-3 rounded-2xl shadow-lg">
                        <Calendar
                            modal
                            selectedYear={value.year}
                            selectedMonth={value.month}
                            selectedDay={value.day}
                            onChangeDate={handleDateChange}
                            monthlyEvents={monthlyEvents}
                            setMonthlyEvents={setMonthlyEvents}
                            className="scale-95"
                        />
                    </div>
                </div>
            )}
        </div>
    );
}

export default DropdownCalendar;
