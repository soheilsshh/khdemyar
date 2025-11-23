"use client";
import React, { useState } from 'react';
import { FaTimes, FaCalendarAlt, FaClock, FaUsers, FaMale, FaFemale, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ShiftDetailsModal = ({ shift, onClose, requestStatus = 'none', onRequest }) => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleRequestShift = () => {
    if (requestStatus === 'none') setShowConfirmDialog(true);
  };

  const confirmRequest = () => {
    if (onRequest) onRequest();
    setShowConfirmDialog(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className='absolute inset-0 bg-black-300/20 backdrop-blur-sm'>

      </div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h3 className="text-2xl font-bold text-gray-800">جزئیات شیفت</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">اطلاعات کلی</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">مناسبت</p>
              <p className="font-semibold text-gray-800">{shift.occasion}</p>
            </div>
            
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-2">توضیحات</p>
              <p className="text-gray-800">{shift.description}</p>
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-blue-50 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">نیازهای شیفت</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <FaMale className="text-blue-600" />
                  <span className="font-semibold text-gray-800">مردان</span>
                </div>
                <p className="text-sm text-gray-600">حداقل: {shift.minMen} نفر</p>
                <p className="text-sm text-gray-600">حداکثر: {shift.maxMen} نفر</p>
              </div>
              
              <div className="bg-white rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <FaFemale className="text-pink-600" />
                  <span className="font-semibold text-gray-800">زنان</span>
                </div>
                <p className="text-sm text-gray-600">حداقل: {shift.minWomen} نفر</p>
                <p className="text-sm text-gray-600">حداکثر: {shift.maxWomen} نفر</p>
              </div>
            </div>
          </div>

          {/* Current Status */}
          <div className="bg-yellow-50 rounded-xl p-4">
            <h4 className="text-lg font-semibold text-gray-800 mb-4">وضعیت فعلی</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <FaMale className="text-blue-600" />
                  <span className="font-semibold text-gray-800">مردان ثبت‌نام شده</span>
                </div>
                <p className="text-2xl font-bold text-blue-600">{shift.registeredMen}</p>
                <p className="text-sm text-gray-600">از {shift.maxMen} نفر</p>
              </div>
              
              <div className="bg-white rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <FaFemale className="text-pink-600" />
                  <span className="font-semibold text-gray-800">زنان ثبت‌نام شده</span>
                </div>
                <p className="text-2xl font-bold text-pink-600">{shift.registeredWomen}</p>
                <p className="text-sm text-gray-600">از {shift.maxWomen} نفر</p>
              </div>
            </div>
            
            <div className="mt-4 bg-white rounded-lg p-3">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold text-gray-800">کل ثبت‌نام شده</span>
                <span className="text-2xl font-bold text-gray-800">{shift.totalRegistered}/{shift.totalNeeded}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${(shift.totalRegistered / shift.totalNeeded) * 100}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {shift.remaining} نفر دیگر برای تکمیل شیفت نیاز است
              </p>
            </div>
          </div>

          {/* Action / Status */}
          <div className="flex justify-center">
            {requestStatus === 'none' && (
              <button
                onClick={handleRequestShift}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-4 rounded-xl font-semibold text-lg transition-colors flex items-center gap-3"
              >
                <FaCheckCircle />
                ثبت درخواست برای انجام شیفت
              </button>
            )}

            {requestStatus === 'pending' && (
              <div className="bg-yellow-50 text-yellow-800 px-6 py-4 rounded-xl font-semibold text-lg border border-yellow-200">
                در انتظار تایید
              </div>
            )}

            {requestStatus === 'approved' && (
              <div className="bg-green-50 text-green-800 px-6 py-4 rounded-xl font-semibold text-lg border border-green-200">
                تایید شد
              </div>
            )}

            {requestStatus === 'rejected' && (
              <div className="bg-red-50 text-red-800 px-6 py-4 rounded-xl font-semibold text-lg border border-red-200">
                رد شد
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Confirmation Dialog */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-60 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-6 w-full max-w-md"
          >
            <h4 className="text-xl font-bold text-gray-800 mb-4">تأیید درخواست</h4>
            <p className="text-gray-600 mb-6">
              آیا مطمئن هستید که می‌خواهید درخواست خود را برای انجام این شیفت ثبت کنید؟
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                انصراف
              </button>
              <button
                onClick={confirmRequest}
                className="flex-1 bg-green-500 hover:bg-green-600 text-white py-3 rounded-lg font-medium transition-colors"
              >
                تأیید
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ShiftDetailsModal;
