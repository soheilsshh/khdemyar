"use client";
import React, { useState } from 'react';
import { FaArrowLeft, FaCalendarAlt, FaChartLine, FaEdit, FaSave, FaTimes, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Pagination from '@/components/Pagination';
import VisitChart from '../../../(site management)/dashboard/_components/VisitChart';

const UserDetail = ({ userId }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const [isEditingShifts, setIsEditingShifts] = useState(false);
    const [shiftLimits, setShiftLimits] = useState({
        minShifts: 20,
        maxShifts: 60
    });

    // Sample user data
    const userData = {
        id: userId,
        firstName: 'علی',
        lastName: 'احمدی',
        phone: '09123456789',
        email: 'ali.ahmadi@example.com',
        nationalCode: '1234567890',
        joinDate: '1403/01/15',
        totalShifts: 45,
        correctShifts: 38,
        incorrectShifts: 7,
        hasCriminalRecord: false
    };

    // Sample monthly shifts data
    const monthlyShiftsData = [
        { month: 'فروردین', shifts: 3 },
        { month: 'اردیبهشت', shifts: 4 },
        { month: 'خرداد', shifts: 5 },
        { month: 'تیر', shifts: 4 },
        { month: 'مرداد', shifts: 6 },
        { month: 'شهریور', shifts: 3 },
        { month: 'مهر', shifts: 5 },
        { month: 'آبان', shifts: 4 },
        { month: 'آذر', shifts: 6 },
        { month: 'دی', shifts: 3 },
        { month: 'بهمن', shifts: 4 },
        { month: 'اسفند', shifts: 2 }
    ];

    // Sample user shifts data
    const userShifts = [
        { id: 1, date: '1404/05/01', event: 'جشن فارغ‌التحصیلی', status: 'تکمیل شده' },
        { id: 2, date: '1404/05/02', event: 'جلسه کاری', status: 'تکمیل شده' },
        { id: 3, date: '1404/05/03', event: 'کارگاه آموزشی', status: 'تکمیل شده' },
        { id: 4, date: '1404/05/04', event: 'جشن تولد', status: 'تکمیل شده' },
        { id: 5, date: '1404/05/05', event: 'همایش علمی', status: 'تکمیل شده' },
        { id: 6, date: '1404/05/06', event: 'مراسم تقدیر', status: 'تکمیل شده' },
        { id: 7, date: '1404/05/07', event: 'نمایشگاه فرهنگی', status: 'تکمیل شده' },
        { id: 8, date: '1404/05/08', event: 'جلسه هیئت مدیره', status: 'تکمیل شده' },
        { id: 9, date: '1404/05/09', event: 'کارگاه مهارت‌های نرم', status: 'تکمیل شده' },
        { id: 10, date: '1404/05/10', event: 'مراسم خیریه', status: 'تکمیل شده' }
    ];

    // Pagination logic for shifts
    const totalPages = Math.ceil(userShifts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentShifts = userShifts.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleBack = () => {
        window.history.back();
    };

    const handleEditShifts = () => {
        setIsEditingShifts(true);
    };

    const handleSaveShifts = () => {
        // Here you would save the data to your backend
        console.log('Saving shift limits:', shiftLimits);
        setIsEditingShifts(false);
    };

    const handleCancelEdit = () => {
        // Reset to original values
        setShiftLimits({
            minShifts: 20,
            maxShifts: 60
        });
        setIsEditingShifts(false);
    };

    const handleShiftLimitChange = (field, value) => {
        setShiftLimits(prev => ({
            ...prev,
            [field]: parseInt(value) || 0
        }));
    };

    return (
        <div className="px-4 py-2 md:px-6 md:py-6 space-y-4 md:space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
                <button
                    onClick={handleBack}
                    className="p-2 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                >
                    <FaArrowLeft size={16} />
                </button>
                <h1 className="text-lg md:text-3xl font-bold text-gray-800">
                    <span className="hidden md:inline">جزئیات کاربر: </span>
                    {userData.firstName} {userData.lastName}
                </h1>
            </div>

            {/* User Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">نام</label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {userData.firstName}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">نام خانوادگی</label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {userData.lastName}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">شماره تماس</label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {userData.phone}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {userData.email}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">کد ملی</label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {userData.nationalCode}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ عضویت</label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {userData.joinDate}
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl p-4 md:p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2">کل شیفت‌ها</h3>
                            <p className="text-2xl md:text-3xl font-bold">{userData.totalShifts}</p>
                        </div>
                        <FaCalendarAlt size={24} className="md:w-8 md:h-8 opacity-80" />
                    </div>
                </div>

                <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-4 md:p-6 text-white">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2">میانگین ماهانه</h3>
                            <p className="text-2xl md:text-3xl font-bold">
                                {Math.round(userData.totalShifts / 12)}
                            </p>
                        </div>
                        <FaChartLine size={24} className="md:w-8 md:h-8 opacity-80" />
                    </div>
                </div>

                <div className={`rounded-xl p-4 md:p-6 text-white ${userData.hasCriminalRecord
                        ? 'bg-gradient-to-r from-red-400 to-red-600'
                        : 'bg-gradient-to-r from-green-400 to-green-600'
                    }`}>
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2">سوء پیشینه</h3>
                            <p className="text-lg md:text-xl font-bold">
                                {userData.hasCriminalRecord ? 'دارد' : 'ندارد'}
                            </p>
                        </div>
                        <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/20 flex items-center justify-center">
                            <span className="text-sm md:text-lg">
                                {userData.hasCriminalRecord ? '⚠️' : '✅'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shift Limits and Performance */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                {/* Shift Limits Card */}
                <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-bold text-gray-800">محدوده شیفت‌ها</h3>
                        {!isEditingShifts ? (
                            <button
                                onClick={handleEditShifts}
                                className="p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                title="ویرایش"
                            >
                                <FaEdit size={16} />
                            </button>
                        ) : (
                            <div className="flex gap-2">
                                <button
                                    onClick={handleSaveShifts}
                                    className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    title="ذخیره"
                                >
                                    <FaSave size={16} />
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    title="انصراف"
                                >
                                    <FaTimes size={16} />
                                </button>
                            </div>
                        )}
                    </div>
                    
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                حداقل تعداد شیفت
                            </label>
                            {isEditingShifts ? (
                                <input
                                    type="number"
                                    value={shiftLimits.minShifts}
                                    onChange={(e) => handleShiftLimitChange('minShifts', e.target.value)}
                                    className="w-full p-3 border-2 border-blue-200 rounded-lg focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-200"
                                    min="0"
                                />
                            ) : (
                                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-blue-800 font-medium">
                                    {shiftLimits.minShifts} شیفت
                                </div>
                            )}
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                حداکثر تعداد شیفت
                            </label>
                            {isEditingShifts ? (
                                <input
                                    type="number"
                                    value={shiftLimits.maxShifts}
                                    onChange={(e) => handleShiftLimitChange('maxShifts', e.target.value)}
                                    className="w-full p-3 border-2 border-green-200 rounded-lg focus:border-green-400 focus:ring-4 focus:ring-green-100 transition-all duration-200"
                                    min="0"
                                />
                            ) : (
                                <div className="p-3 bg-green-50 rounded-lg border border-green-200 text-green-800 font-medium">
                                    {shiftLimits.maxShifts} شیفت
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Performance Stats */}
                <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">عملکرد شیفت‌ها</h3>
                    
                    <div className="space-y-4">
                        {/* Correct Shifts */}
                        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-4 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium mb-1">شیفت‌های درست</h4>
                                    <p className="text-2xl font-bold">{userData.correctShifts}</p>
                                    <p className="text-xs opacity-80">
                                        {Math.round((userData.correctShifts / userData.totalShifts) * 100)}% از کل
                                    </p>
                                </div>
                                <FaCheckCircle size={24} className="opacity-80" />
                            </div>
                        </div>

                        {/* Incorrect Shifts */}
                        <div className="bg-gradient-to-r from-red-400 to-red-600 rounded-xl p-4 text-white">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h4 className="text-sm font-medium mb-1">شیفت‌های اشتباه</h4>
                                    <p className="text-2xl font-bold">{userData.incorrectShifts}</p>
                                    <p className="text-xs opacity-80">
                                        {Math.round((userData.incorrectShifts / userData.totalShifts) * 100)}% از کل
                                    </p>
                                </div>
                                <FaTimesCircle size={24} className="opacity-80" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Monthly Shifts Chart */}
            <div className='grid grid-cols-1 overflow-hidden'>
                <div className="bg-white rounded-xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-6">نمودار شیفت‌های ماهانه</h3>
                    <div className="h-80 overflow-x-auto md:overflow-x-visible">
                        <div className="min-w-[600px]  md:min-w-0 h-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={monthlyShiftsData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                    <XAxis
                                        dataKey="month"
                                        stroke="#666"
                                        fontSize={12}
                                    />
                                    <YAxis
                                        stroke="#666"
                                        fontSize={12}
                                        domain={[0, 10]}
                                        tickCount={6}
                                        tickFormatter={(value) => value}
                                        tick={{ dx: -30 }}
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#fff',
                                            border: '1px solid #e5e7eb',
                                            borderRadius: '8px',
                                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                                        }}
                                    />
                                    <Line
                                        type="monotone"
                                        dataKey="shifts"
                                        stroke="#3b82f6"
                                        strokeWidth={3}
                                        dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                                        activeDot={{ r: 6, stroke: '#3b82f6', strokeWidth: 2 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
            {/* <VisitChart /> */}

            {/* User Shifts Table */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="p-4 md:p-6 border-b border-gray-200">
                    <h3 className="text-lg md:text-xl font-bold text-gray-800">لیست شیفت‌های انجام شده</h3>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-dMain/70 text-center text-black">
                                <th className="p-4 border border-l-2 border-gray-400 w-16">#</th>
                                <th className="p-4 border border-x-2 border-gray-400">تاریخ</th>
                                <th className="p-4 border border-x-2 border-gray-400">رویداد</th>
                                <th className="p-4 border border-r-2 border-gray-400/70">وضعیت</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentShifts.map((shift, index) => (
                                <tr key={shift.id} className="hover:bg-gray-50">
                                    <td className="p-4 border border-l-2 border-gray-400/70 text-center w-16">
                                        {startIndex + index + 1}
                                    </td>
                                    <td className="p-4 border border-x-2 border-gray-400/70 text-center">
                                        {shift.date}
                                    </td>
                                    <td className="p-4 border border-x-2 border-gray-400/70 text-right">
                                        {shift.event}
                                    </td>
                                    <td className="p-4 border border-r-2 border-gray-400/70 text-center">
                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                                            {shift.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Table */}
                <div className="md:hidden">
                    <div className="space-y-3 p-4">
                        {currentShifts.map((shift, index) => (
                            <div key={shift.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <span className="text-sm text-gray-500">#{startIndex + index + 1}</span>
                                        <h4 className="font-medium text-gray-800">{shift.date}</h4>
                                    </div>
                                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                                        {shift.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Pagination for shifts */}
                {totalPages > 1 && (
                    <div dir='ltr' className="p-4 border-t border-gray-200">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDetail;
