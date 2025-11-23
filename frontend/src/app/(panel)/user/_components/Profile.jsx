"use client";
import React, { useState } from 'react';
import { FaUser, FaPhone, FaEnvelope, FaCheck, FaTimes, FaChartLine, FaLock, FaTrophy } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import ChangePasswordModal from './ChangePasswordModal';

const Profile = () => {
  const [selectedYear, setSelectedYear] = useState(1403);
  const [showChangePassword, setShowChangePassword] = useState(false);

  // Sample user data
  const userData = {
    firstName: 'احمد',
    lastName: 'محمدی',
    phone: '09123456789',
    email: 'ahmad.mohammadi@example.com',
    joinYear: 1400,
    totalShifts: 45,
    correctShifts: 38,
    incorrectShifts: 7,
    monthlyShifts: {
      1403: [3, 4, 2, 5, 3, 4, 2, 3, 4, 5, 3, 4],
      1402: [2, 3, 4, 3, 2, 4, 3, 2, 3, 4, 2, 3],
      1401: [1, 2, 3, 2, 1, 3, 2, 1, 2, 3, 1, 2],
      1400: [0, 1, 2, 1, 0, 2, 1, 0, 1, 2, 0, 1]
    },
    minimumShiftsPerMonth: 3
  };

  const months = [
    'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
    'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
  ];

  const years = Object.keys(userData.monthlyShifts).map(Number).sort((a, b) => b - a);

  const chartData = months.map((month, index) => ({
    month,
    shifts: userData.monthlyShifts[selectedYear]?.[index] || 0
  }));

  const currentMonthShifts = userData.monthlyShifts[selectedYear]?.[new Date().getMonth()] || 0;
  const remainingShifts = Math.max(0, userData.minimumShiftsPerMonth - currentMonthShifts);

  return (
    <div className="space-y-8">
      {/* Profile Header with Glass Effect */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 rounded-3xl shadow-2xl"
      >
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative p-4 md:p-8 text-white">
          {/* Desktop Layout */}
          <div className="hidden md:block">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm">
                  <span className="text-2xl font-bold text-slate-800">
                    {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-slate-100">{userData.firstName} {userData.lastName}</h1>
                  <p className="text-slate-100 text-lg">عضو از سال {userData.joinYear}</p>
                </div>
              </div>
              <div className="text-right">
                <button
                  onClick={() => setShowChangePassword(true)}
                  className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-slate-800 px-6 py-3 rounded-xl font-medium transition-all duration-300 flex items-center gap-2"
                >
                  <FaLock />
                  تغییر رمز ورود
                </button>
              </div>
            </div>

            {/* Contact Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 border border-white border-opacity-20">
                <div className="w-12 h-12 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <FaPhone className="text-blue-300 text-lg" />
                </div>
                <div>
                  <p className="text-slate-800 text-sm">شماره تماس</p>
                  <p className="font-semibold text-slate-800 text-lg">{userData.phone}</p>
                </div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 flex items-center gap-3 border border-white border-opacity-20">
                <div className="w-12 h-12 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <FaEnvelope className="text-green-300 text-lg" />
                </div>
                <div>
                  <p className="text-slate-800 text-sm">ایمیل</p>
                  <p className="font-semibold text-slate-800 text-lg">{userData.email}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Layout */}
          <div className="md:hidden">
            {/* User Info */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center backdrop-blur-sm mx-auto mb-3">
                <span className="text-xl font-bold text-slate-800">
                  {userData.firstName.charAt(0)}{userData.lastName.charAt(0)}
                </span>
              </div>
              <h1 className="text-2xl font-bold text-slate-100 mb-1">{userData.firstName} {userData.lastName}</h1>
              <p className="text-slate-100 text-sm">عضو از سال {userData.joinYear}</p>
            </div>

            {/* Change Password Button */}
            <div className="text-center mb-6">
              <button
                onClick={() => setShowChangePassword(true)}
                className="bg-white bg-opacity-20 hover:bg-opacity-30 backdrop-blur-sm text-slate-800 px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center gap-2 mx-auto"
              >
                <FaLock />
                تغییر رمز ورود
              </button>
            </div>

            {/* Contact Info Cards - Mobile */}
            <div className="space-y-3">
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3 border border-white border-opacity-20">
                <div className="w-10 h-10 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <FaPhone className="text-blue-300" />
                </div>
                <div>
                  <p className="text-slate-800 text-xs">شماره تماس</p>
                  <p className="font-semibold text-slate-800 text-sm">{userData.phone}</p>
                </div>
              </div>
              <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3 border border-white border-opacity-20">
                <div className="w-10 h-10 bg-green-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <FaEnvelope className="text-green-300" />
                </div>
                <div>
                  <p className="text-slate-800 text-xs">ایمیل</p>
                  <p className="font-semibold text-slate-800 text-sm">{userData.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-blue-500 to-cyan-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-2">کل شیفت‌ها</p>
              <p className="text-4xl font-bold">{userData.totalShifts}</p>
            </div>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FaTrophy className="text-2xl text-yellow-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-gradient-to-br from-green-500 to-emerald-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-2">شیفت‌های درست</p>
              <p className="text-4xl font-bold flex items-center gap-2">
                <FaCheck />
                {userData.correctShifts}
              </p>
            </div>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FaCheck className="text-2xl text-green-500" />
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-gradient-to-br from-red-500 to-pink-500 text-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-red-100 text-sm mb-2">شیفت‌های اشتباه</p>
              <p className="text-4xl font-bold flex items-center gap-2">
                <FaTimes />
                {userData.incorrectShifts}
              </p>
            </div>
            <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
              <FaTimes className="text-2xl text-red-500" />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Advanced Chart Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-3xl shadow-2xl p-8 border border-gray-200 "
      >
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h3 className="text-2xl font-iranianSansDemiBold text-gray-800 flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <FaChartLine className="text-white" />
              </div>
              آمار عملکرد ماهانه
            </h3>
            <p className="text-gray-600">نمودار پیشرفت شیفت‌های شما در طول سال</p>
          </div>

          <div className="mt-4 md:mt-0">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-xl font-medium focus:outline-none focus:ring-4 focus:ring-purple-200 transition-all duration-200 shadow-lg border-0"
            >
              {years.map(year => (
                <option key={year} value={year} className="bg-white text-gray-800 py-2">{year}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Chart */}
        <div className='overflow-x-auto'>
          <div className="  min-w-200   rounded-2xl p-6 border-2 border-gray-300">
            <div className="h-96 font-iranianSansMedium">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis
                    dataKey="month"
                    stroke="#6b7280"
                    fontSize={12}
                    fontWeight="500"
                  />
                  <YAxis
                    stroke="#6b7280"
                    fontSize={12}
                    fontWeight="500"
                    domain={[0, 'dataMax + 1']}
                    tick={{ dx: -30 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      border: '1px solid #8B5CF6',
                      borderRadius: '8px',
                      color: '#ffffff'
                    }}
                    labelStyle={{ color: '#ffffff' }}
                    formatter={(value, name) => [`${value} شیفت انجام شده`, '']}
                    labelFormatter={(label) => `ماه ${label}`}
                  />
                  <Line
                    type="monotone"
                    dataKey="shifts"
                    stroke="#8B5CF6"
                    strokeWidth={3}
                    dot={{ fill: '#8B5CF6', stroke: '#ffffff', strokeWidth: 2, r: 6 }}
                    activeDot={{ r: 8, stroke: '#8B5CF6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Chart Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl p-4 text-center shadow-lg">
            <p className="text-blue-100 font-semibold">میانگین ماهانه</p>
            <p className="text-2xl font-bold text-white">
              {(userData.monthlyShifts[selectedYear]?.reduce((a, b) => a + b, 0) / 12).toFixed(1)}
            </p>
          </div>
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl p-4 text-center shadow-lg">
            <p className="text-orange-100 font-semibold">حداقل شیفت ماهانه</p>
            <p className="text-2xl font-bold text-white">
              {userData.minimumShiftsPerMonth}
            </p>
          </div>
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl p-4 text-center shadow-lg">
            <p className="text-purple-100 font-semibold">کل سال {selectedYear}</p>
            <p className="text-2xl font-bold text-white">
              {userData.monthlyShifts[selectedYear]?.reduce((a, b) => a + b, 0) || 0}
            </p>
          </div>
        </div>
      </motion.div>


      {/* Change Password Modal */}
      {showChangePassword && (
        <ChangePasswordModal onClose={() => setShowChangePassword(false)} />
      )}
    </div>
  );
};

export default Profile;
