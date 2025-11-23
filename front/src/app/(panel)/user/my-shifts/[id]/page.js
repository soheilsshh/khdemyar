"use client";
import React from 'react';
import { FaArrowRight, FaCalendarAlt, FaClock, FaCheck, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

export default function ShiftDetailsPage({ params }) {
  const router = useRouter();
  const shiftId = params.id;

  // Sample shift data - in real app, fetch from API
  const shiftData = {
    id: shiftId,
    date: '1403/10/15',
    from: '16:00',
    to: '20:00',
    occasion: 'تولد امام زمان',
    status: 'correct',
    description: 'مراسم تولد امام زمان در مسجد مرکزی با حضور جمع کثیری از مردم'
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'correct': return 'bg-green-500';
      case 'incorrect': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'correct': return 'درست انجام شده';
      case 'incorrect': return 'اشتباه انجام شده';
      case 'pending': return 'در انتظار ارزیابی';
      default: return 'نامشخص';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'correct': return <FaCheck />;
      case 'incorrect': return <FaTimes />;
      case 'pending': return <FaClock />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors"
          >
            <FaArrowRight />
            بازگشت
          </button>
        </div>

        {/* Shift Details Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-gray-100 max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">جزئیات شیفت</h1>
            <p className="text-gray-600">شماره شیفت: {shiftData.id}</p>
          </div>

          {/* Status Badge */}
          <div className="flex justify-center mb-8">
            <span className={`px-6 py-3 rounded-full text-white text-lg font-medium flex items-center gap-3 ${getStatusColor(shiftData.status)}`}>
              {getStatusIcon(shiftData.status)}
              {getStatusText(shiftData.status)}
            </span>
          </div>

          {/* Shift Information */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">اطلاعات شیفت</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center gap-4">
                  <FaCalendarAlt className="text-blue-600 text-xl" />
                  <div>
                    <p className="text-sm text-gray-600">تاریخ</p>
                    <p className="font-semibold text-gray-800 text-lg">{shiftData.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <FaClock className="text-green-600 text-xl" />
                  <div>
                    <p className="text-sm text-gray-600">زمان</p>
                    <p className="font-semibold text-gray-800 text-lg">{shiftData.from} - {shiftData.to}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">مناسبت</h3>
              <p className="text-gray-800 text-lg">{shiftData.occasion}</p>
            </div>

            <div className="bg-yellow-50 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">توضیحات</h3>
              <p className="text-gray-800">{shiftData.description}</p>
            </div>

            {/* Performance Note */}
            {shiftData.status !== 'pending' && (
              <div className={`rounded-xl p-6 ${
                shiftData.status === 'correct' ? 'bg-green-50' : 'bg-red-50'
              }`}>
                <h3 className="text-xl font-semibold text-gray-800 mb-4">نتیجه ارزیابی</h3>
                <div className="flex items-center gap-3">
                  {getStatusIcon(shiftData.status)}
                  <p className={`text-lg font-medium ${
                    shiftData.status === 'correct' ? 'text-green-800' : 'text-red-800'
                  }`}>
                    {shiftData.status === 'correct' 
                      ? 'شیفت شما به درستی انجام شده و مورد تأیید قرار گرفته است.'
                      : 'شیفت شما نیاز به بهبود دارد. لطفاً در شیفت‌های آینده دقت بیشتری داشته باشید.'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
