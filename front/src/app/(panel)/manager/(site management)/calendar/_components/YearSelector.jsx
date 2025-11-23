'use client';
import React from 'react';
import { FaChevronLeft, FaChevronRight, FaCalendarAlt } from 'react-icons/fa';

const YearSelector = ({ currentYear, onYearChange }) => {
    const handlePrevYear = () => {
        onYearChange(currentYear - 1);
    };

    const handleNextYear = () => {
        onYearChange(currentYear + 1);
    };

    return (
        <div className="flex items-center justify-center mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-2xl p-6 flex items-center gap-6">

                <button
                    onClick={handleNextYear}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 text-white hover:scale-110"
                    title="سال بعد"
                >
                    <FaChevronRight size={20} />
                </button>


                <div className="flex items-center gap-4 px-6">
                    <FaCalendarAlt className="text-white text-2xl" />
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-white mb-1">
                            {currentYear}
                        </h2>
                        <p className="text-blue-100 text-sm">
                            سال انتخاب شده
                        </p>
                    </div>
                </div>
                <button
                    onClick={handlePrevYear}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-xl transition-all duration-300 text-white hover:scale-110"
                    title="سال قبل"
                >
                    <FaChevronLeft size={20} />
                </button>

            </div>
        </div>
    );
};

export default YearSelector;
