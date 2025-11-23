"use client";
import React from 'react';
import { FaUsers, FaCalendarCheck, FaEye, FaChartLine } from 'react-icons/fa';
import StatCard from './StatCard';
import VisitChart from './VisitChart';
import TopUsers from './TopUsers';

const Dashboard = ({ title = "داشبورد مدیریت" }) => {
    // Sample statistics data
    const stats = [
        {
            title: 'تعداد کل کاربران',
            value: '1,234',
            icon: FaUsers,
            color: 'bg-blue-500',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'شیفت‌های انجام شده',
            value: '456',
            icon: FaCalendarCheck,
            color: 'bg-green-500',
            bgColor: 'bg-green-50'
        },
        {
            title: 'بازدیدهای این ماه',
            value: '12,890',
            icon: FaEye,
            color: 'bg-purple-500',
            bgColor: 'bg-purple-50'
        },
        {
            title: 'رشد ماهانه',
            value: '+12.5%',
            icon: FaChartLine,
            color: 'bg-orange-500',
            bgColor: 'bg-orange-50'
        }
    ];

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
                <p className="text-gray-600">خلاصه‌ای از آمار و اطلاعات کلی سیستم</p>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        bgColor={stat.bgColor}
                    />
                ))}
            </div>

            {/* Charts and Top Users */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Visit Chart - Takes 2 columns on large screens */}
                <div className="lg:col-span-2">
                    <VisitChart />
                </div>
                    
                {/* Top Users - Takes 1 column on large screens */}
                <div className="lg:col-span-1">
                    <TopUsers />
                </div>
            </div>

            {/* Additional Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-r from-green-400 to-blue-500 rounded-xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">وضعیت سیستم</h3>
                    <p className="text-green-100">همه سرویس‌ها به درستی کار می‌کنند</p>
                    <div className="mt-4 flex items-center">
                        <div className="w-3 h-3 bg-green-300 rounded-full mr-2"></div>
                        <span className="text-sm">آنلاین</span>
                    </div>
                </div>

                <div className="bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl p-6 text-white">
                    <h3 className="text-xl font-bold mb-2">آخرین فعالیت</h3>
                    <p className="text-purple-100">3 شیفت جدید امروز ثبت شده</p>
                    <div className="mt-4 flex items-center">
                        <div className="w-3 h-3 bg-purple-300 rounded-full mr-2"></div>
                        <span className="text-sm">فعال</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
