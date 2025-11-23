'use client';
import React, { useState, useEffect } from 'react';
import { FaSave, FaTrash } from 'react-icons/fa';
import YearSelector from './YearSelector';
import MonthCard from './MonthCard';

const CalendarManager = () => {
    const [currentYear, setCurrentYear] = useState(1403);
    const [calendarData, setCalendarData] = useState({});
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

    const monthNames = [
        'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
        'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
    ];

    // Load data from localStorage on component mount
    useEffect(() => {
        const savedData = localStorage.getItem('calendarData');
        if (savedData) {
            try {
                setCalendarData(JSON.parse(savedData));
            } catch (error) {
                console.error('Error loading calendar data:', error);
            }
        }
    }, []);

    // Save data to localStorage
    const saveToLocalStorage = () => {
        localStorage.setItem('calendarData', JSON.stringify(calendarData));
        setHasUnsavedChanges(false);
    };

    // Handle month data save
    const handleMonthSave = (month, data) => {
        const yearKey = currentYear.toString();
        const monthKey = month.toString();
        
        setCalendarData(prev => ({
            ...prev,
            [yearKey]: {
                ...prev[yearKey],
                [monthKey]: data
            }
        }));
        setHasUnsavedChanges(true);
    };

    // Get data for specific month
    const getMonthData = (month) => {
        const yearKey = currentYear.toString();
        const monthKey = month.toString();
        return calendarData[yearKey]?.[monthKey] || {};
    };


    // Clear all data for current year
    const clearYearData = () => {
        if (confirm(`آیا مطمئن هستید که می‌خواهید تمام اطلاعات سال ${currentYear} را پاک کنید؟`)) {
            const yearKey = currentYear.toString();
            setCalendarData(prev => {
                const newData = { ...prev };
                delete newData[yearKey];
                return newData;
            });
            setHasUnsavedChanges(true);
        }
    };

    // Count filled months for current year
    const getFilledMonthsCount = () => {
        const yearKey = currentYear.toString();
        const yearData = calendarData[yearKey] || {};
        return Object.keys(yearData).filter(month => {
            const monthData = yearData[month];
            return monthData.date1 || monthData.date2 || monthData.date3;
        }).length;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-4 md:p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">
                        مدیریت تقویم سالانه
                    </h1>
                    <p className="text-gray-600 text-lg">
                        برای هر ماه تا سه تاریخ مهم تنظیم کنید
                    </p>
                </div>

                {/* Year Selector */}
                <YearSelector 
                    currentYear={currentYear} 
                    onYearChange={setCurrentYear} 
                />

                {/* Action Bar */}
                <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 w-full md:w-auto">
                            <div className="text-sm text-gray-600">
                                <span className="font-medium">{getFilledMonthsCount()}</span> از ۱۲ ماه تکمیل شده
                            </div>
                            {hasUnsavedChanges && (
                                <div className="flex items-center gap-2 text-orange-600 text-sm">
                                    <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                                    تغییرات ذخیره نشده
                                </div>
                            )}
                        </div>
                        
                        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                            <button
                                onClick={saveToLocalStorage}
                                disabled={!hasUnsavedChanges}
                                className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                                    hasUnsavedChanges 
                                        ? 'bg-green-500 hover:bg-green-600 text-white shadow-lg hover:shadow-xl' 
                                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                            >
                                <FaSave size={16} />
                                ذخیره
                            </button>
                            
                            <button
                                onClick={clearYearData}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
                            >
                                <FaTrash size={16} />
                                پاک کردن سال
                            </button>
                        </div>
                    </div>
                </div>

                {/* Month Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {monthNames.map((monthName, index) => (
                        <MonthCard
                            key={`${currentYear}-${index + 1}`}
                            month={index + 1}
                            monthName={monthName}
                            data={getMonthData(index + 1)}
                            onSave={handleMonthSave}
                        />
                    ))}
                </div>

                {/* Footer Stats */}
                <div className="mt-8 md:mt-12">
                    <div className="bg-white rounded-2xl shadow-lg p-4 md:p-6 mx-auto max-w-2xl">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">آمار سال {currentYear}</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 text-center">
                            <div className="p-4 bg-blue-50 rounded-xl">
                                <div className="text-2xl font-bold text-blue-600">{getFilledMonthsCount()}</div>
                                <div className="text-sm text-gray-600">ماه تکمیل شده</div>
                            </div>
                            <div className="p-4 bg-green-50 rounded-xl">
                                <div className="text-2xl font-bold text-green-600">{12 - getFilledMonthsCount()}</div>
                                <div className="text-sm text-gray-600">ماه باقی‌مانده</div>
                            </div>
                            <div className="p-4 bg-purple-50 rounded-xl">
                                <div className="text-2xl font-bold text-purple-600">
                                    {Math.round((getFilledMonthsCount() / 12) * 100)}%
                                </div>
                                <div className="text-sm text-gray-600">درصد تکمیل</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CalendarManager;
