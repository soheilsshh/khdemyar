'use client';
import React, { useState } from 'react';
import { FaEdit, FaSave, FaTimes, FaCalendarDay } from 'react-icons/fa';
import DateInput from './DateInput';

const MonthCard = ({ month, monthName, data, onSave }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        date1: data?.date1 || '',
        date2: data?.date2 || '',
        date3: data?.date3 || ''
    });

    const monthColors = [
        'from-red-400 to-pink-500',      // فروردین
        'from-orange-400 to-red-500',   // اردیبهشت
        'from-yellow-400 to-orange-500', // خرداد
        'from-green-400 to-yellow-500',  // تیر
        'from-teal-400 to-green-500',    // مرداد
        'from-blue-400 to-teal-500',     // شهریور
        'from-indigo-400 to-blue-500',   // مهر
        'from-purple-400 to-indigo-500', // آبان
        'from-pink-400 to-purple-500',   // آذر
        'from-red-400 to-pink-500',      // دی
        'from-blue-400 to-purple-500',   // بهمن
        'from-green-400 to-blue-500'     // اسفند
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSave = () => {
        onSave(month, formData);
        setIsEditing(false);
    };

    const handleCancel = () => {
        setFormData({
            date1: data?.date1 || '',
            date2: data?.date2 || '',
            date3: data?.date3 || ''
        });
        setIsEditing(false);
    };

    const hasData = data?.date1 || data?.date2 || data?.date3;

    return (
        <div className={`relative bg-gradient-to-br ${monthColors[month - 1]} rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 text-6xl font-bold text-white">
                    {month.toString().padStart(2, '0')}
                </div>
            </div>

            {/* Content */}
            <div className="relative p-6 text-white">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <FaCalendarDay className="text-2xl" />
                        <div>
                            <h3 className="text-xl font-bold">{monthName}</h3>
                            <p className="text-white/80 text-sm">ماه {month}</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-2">
                        {!isEditing ? (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 hover:scale-110"
                                title="ویرایش"
                            >
                                <FaEdit size={16} />
                            </button>
                        ) : (
                            <>
                                <button
                                    onClick={handleSave}
                                    className="p-2 bg-green-500/80 hover:bg-green-500 rounded-lg transition-all duration-200 hover:scale-110"
                                    title="ذخیره"
                                >
                                    <FaSave size={16} />
                                </button>
                                <button
                                    onClick={handleCancel}
                                    className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg transition-all duration-200 hover:scale-110"
                                    title="انصراف"
                                >
                                    <FaTimes size={16} />
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Date Inputs */}
                <div className="space-y-4">
                    {isEditing ? (
                        <>
                            <DateInput
                                label="تاریخ اول"
                                value={formData.date1}
                                onChange={(value) => handleInputChange('date1', value)}
                                placeholder="01/15"
                                color="blue"
                            />
                            <DateInput
                                label="تاریخ دوم"
                                value={formData.date2}
                                onChange={(value) => handleInputChange('date2', value)}
                                placeholder="02/20"
                                color="green"
                            />
                            <DateInput
                                label="تاریخ سوم"
                                value={formData.date3}
                                onChange={(value) => handleInputChange('date3', value)}
                                placeholder="03/25"
                                color="purple"
                            />
                        </>
                    ) : (
                        <div className="space-y-3">
                            {hasData ? (
                                <>
                                    {data.date1 && (
                                        <div className="flex items-center justify-between bg-white/20 rounded-lg p-3">
                                            <span className="text-sm font-medium">تاریخ اول:</span>
                                            <span className="font-bold">{data.date1}</span>
                                        </div>
                                    )}
                                    {data.date2 && (
                                        <div className="flex items-center justify-between bg-white/20 rounded-lg p-3">
                                            <span className="text-sm font-medium">تاریخ دوم:</span>
                                            <span className="font-bold">{data.date2}</span>
                                        </div>
                                    )}
                                    {data.date3 && (
                                        <div className="flex items-center justify-between bg-white/20 rounded-lg p-3">
                                            <span className="text-sm font-medium">تاریخ سوم:</span>
                                            <span className="font-bold">{data.date3}</span>
                                        </div>
                                    )}
                                </>
                            ) : (
                                <div className="text-center py-8 text-white/60">
                                    <FaCalendarDay className="mx-auto text-3xl mb-3" />
                                    <p className="text-sm">هنوز تاریخی تنظیم نشده</p>
                                    <p className="text-xs mt-1">برای تنظیم کلیک کنید</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Status Indicator */}
            {hasData && !isEditing && (
                <div className="absolute top-2 left-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                </div>
            )}
        </div>
    );
};

export default MonthCard;
