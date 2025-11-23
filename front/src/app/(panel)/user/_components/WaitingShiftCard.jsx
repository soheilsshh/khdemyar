"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaUsers, FaMale, FaFemale, FaEye } from 'react-icons/fa';

const WaitingShiftCard = ({ shift, onViewDetails, requestStatus = 'none', onRequest }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">{shift.occasion}</h3>
        </div>
        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
          در انتظار تکمیل
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="flex items-center gap-3">
          <FaCalendarAlt className="text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">تاریخ</p>
            <p className="font-semibold text-gray-800">{shift.date}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FaClock className="text-green-600" />
          <div>
            <p className="text-sm text-gray-600">زمان</p>
            <p className="font-semibold text-gray-800">{shift.from} - {shift.to}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 mb-4">
        <h4 className="font-semibold text-gray-800 mb-3">آمار ثبت‌نام</h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex items-center gap-2">
            <FaMale className="text-blue-600" />
            <span className="text-sm text-gray-600">مردان:</span>
            <span className="font-semibold">{shift.registeredMen}/{shift.maxMen}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaFemale className="text-pink-600" />
            <span className="text-sm text-gray-600">زنان:</span>
            <span className="font-semibold">{shift.registeredWomen}/{shift.maxWomen}</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex justify-between items-center">
            <span className="text-sm text-gray-600">کل ثبت‌نام شده:</span>
            <span className="font-semibold">{shift.totalRegistered}/{shift.totalNeeded}</span>
          </div>
          <div className="mt-2">
            <div className="flex justify-between text-sm mb-1">
              <span>پیشرفت</span>
              <span>{Math.round((shift.totalRegistered / shift.totalNeeded) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(shift.totalRegistered / shift.totalNeeded) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-sm:hidden bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
        <div className="flex items-start gap-2">
          <FaUsers className="text-blue-600 text-sm mt-0.5 flex-shrink-0" />
          <p className="text-gray-700 text-sm line-clamp-2 leading-relaxed">
            {shift.description}
          </p>
        </div>
      </div>

      <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
        <p className="text-red-800 text-sm">
          <strong>باقی‌مانده برای تکمیل:</strong> {shift.remaining} نفر
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={() => onViewDetails && onViewDetails(shift)}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
        >
          <FaEye />
          مشاهده جزئیات
        </button>

        {requestStatus === 'none' && (
          <button
            onClick={() => onRequest && onRequest(shift.id)}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-semibold transition-colors"
          >
            درخواست انجام شیفت
          </button>
        )}
        {requestStatus === 'pending' && (
          <div className="flex-1 bg-yellow-50 text-yellow-800 py-3 rounded-lg font-medium border border-yellow-200 text-center">
            در انتظار تایید
          </div>
        )}
        {requestStatus === 'approved' && (
          <div className="flex-1 bg-green-50 text-green-800 py-3 rounded-lg font-medium border border-green-200 text-center">
            تایید شد
          </div>
        )}
        {requestStatus === 'rejected' && (
          <div className="flex-1 bg-red-50 text-red-800 py-3 rounded-lg font-medium border border-red-200 text-center">
            رد شد
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default WaitingShiftCard;


