"use client";
import CalendarComponent from "@/components/CalendarComponent";
import InputTypeOne from "@/components/InputTypeOne";
import SelectTypeOne from "@/components/SelectTypeOne";
import TextAreaTypeOne from "@/components/TextAreaTypeOne";
import { toJalaali } from "jalaali-js";
import React, { useState } from "react";
import UserList from "../_components/UserList";
import Swal from 'sweetalert2';
import TimePicker24 from '@/components/TimePicker24';

function EditShiftPage() {
  const today = toJalaali(new Date());
  const [selectedDate, setSelectedDate] = useState({
    year: today.jy,
    month: today.jm,
    day: today.jd,
  });

  const [formData, setFormData] = useState({
    date: `${today.jy}/${today.jm}/${today.jd}`,
    timeFrom: "18:00",
    timeTo: "20:00",
    gender: "",
    maleCount: "",
    femaleCount: "",
    minCount: "",
    maxCount: "",
    occasion: "",
    sendSMS: "",
    id: "",
    lastModifiedBy: "",
    description: ""
  });

  // Update date input when calendar changes
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
    setFormData(prev => ({
      ...prev,
      date: `${newDate.year}/${newDate.month}/${newDate.day}`
    }));
  };

  const handleInputChange = (field, value) => {
    // Prevent negative numbers for count fields
    if (['maleCount', 'femaleCount', 'minCount', 'maxCount'].includes(field)) {
      const numValue = parseInt(value);
      if (numValue < 0) {
        return; // Don't update if negative
      }
    }

    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Shift management functions
  const handleSaveChanges = () => {
    // Validation
    if (!formData.date || !formData.timeFrom || !formData.timeTo || !formData.minCount || !formData.maxCount) {
      Swal.fire({
        title: 'خطا',
        text: 'لطفاً فیلدهای ضروری را پر کنید.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    // Check if numbers are valid and positive
    const minCount = parseInt(formData.minCount);
    const maxCount = parseInt(formData.maxCount);
    const maleCount = parseInt(formData.maleCount) || 0;
    const femaleCount = parseInt(formData.femaleCount) || 0;

    if (minCount < 0 || maxCount < 0 || maleCount < 0 || femaleCount < 0) {
      Swal.fire({
        title: 'خطا',
        text: 'تعداد خادمیاران نمی‌تواند منفی باشد.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    if (maxCount <= minCount) {
      Swal.fire({
        title: 'خطا',
        text: 'حداکثر تعداد باید بیشتر از حداقل تعداد باشد.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    Swal.fire({
      title: 'ثبت تغییرات',
      text: 'آیا از ثبت تغییرات اطمینان دارید؟',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'بله، ثبت کن',
      cancelButtonText: 'انصراف'
    }).then((result) => {
      if (result.isConfirmed) {
        // Here you would send formData to your backend
        console.log('Form data to save:', formData);
        Swal.fire('ثبت شد!', 'تغییرات با موفقیت ثبت شد.', 'success');
      }
    });
  };


  const handleDeleteShift = () => {
    Swal.fire({
      title: 'حذف شیفت',
      text: 'آیا از حذف این شیفت اطمینان دارید؟ این عمل قابل بازگشت نیست!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'بله، حذف کن',
      cancelButtonText: 'انصراف'
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire('حذف شد!', 'شیفت با موفقیت حذف شد.', 'success');
      }
    });
  };

  const requests = [
    {
      firstName: "مینا",
      lastName: "رحمانی",
      phone: "09121234567",
      criminalRecord: "ندارد",
      status: 2, // وضعیت: در انتظار
      approved: null, // تایید/رد: در انتظار
      gender: "female",
    },
    {
      firstName: "سمیه",
      lastName: "کاظمی",
      phone: "09123456789",
      criminalRecord: "دارد",
      status: 1, // وضعیت: فعال
      approved: true, // تایید شده
      gender: "female",
    },
    {
      firstName: "علی",
      lastName: "احمدی",
      phone: "09131234567",
      criminalRecord: "ندارد",
      status: 0, // وضعیت: غیرفعال
      approved: false, // رد شده
      gender: "male",
    },
    {
      firstName: "فاطمه",
      lastName: "محمدی",
      phone: "09141234567",
      criminalRecord: "ندارد",
      status: 3, // وضعیت: بررسی مجدد
      approved: true, // تایید شده
      gender: "female",
    },
    {
      firstName: "حسن",
      lastName: "رضایی",
      phone: "09151234567",
      criminalRecord: "دارد",
      status: 2, // وضعیت: در انتظار
      approved: null, // در انتظار تایید
      gender: "male",
    },
    {
      firstName: "زهرا",
      lastName: "حسینی",
      phone: "09161234567",
      criminalRecord: "ندارد",
      status: 1, // وضعیت: فعال
      approved: false, // رد شده
      gender: "female",
    },
    {
      firstName: "محمد",
      lastName: "عزیزی",
      phone: "09171234567",
      criminalRecord: "ندارد",
      status: 0, // وضعیت: غیرفعال
      approved: true, // تایید شده
      gender: "male",
    },
    {
      firstName: "مریم",
      lastName: "نوری",
      phone: "09181234567",
      criminalRecord: "ندارد",
      status: 3, // وضعیت: بررسی مجدد
      approved: null, // در انتظار تایید
      gender: "female",
    },
    {
      firstName: "رضا",
      lastName: "کریمی",
      phone: "09191234567",
      criminalRecord: "دارد",
      status: 2, // وضعیت: در انتظار
      approved: false, // رد شده
      gender: "male",
    },
    {
      firstName: "نرگس",
      lastName: "صادقی",
      phone: "09201234567",
      criminalRecord: "ندارد",
      status: 1, // وضعیت: فعال
      approved: true, // تایید شده
      gender: "female",
    },
    {
      firstName: "امیر",
      lastName: "جعفری",
      phone: "09211234567",
      criminalRecord: "ندارد",
      status: 0, // وضعیت: غیرفعال
      approved: null, // در انتظار تایید
      gender: "male",
    },
    {
      firstName: "لیلا",
      lastName: "موسوی",
      phone: "09221234567",
      criminalRecord: "ندارد",
      status: 3, // وضعیت: بررسی مجدد
      approved: false, // رد شده
      gender: "female",
    },
    {
      firstName: "بهرام",
      lastName: "شریفی",
      phone: "09231234567",
      criminalRecord: "دارد",
      status: 2, // وضعیت: در انتظار
      approved: true, // تایید شده
      gender: "male",
    },
    {
      firstName: "سارا",
      lastName: "باقری",
      phone: "09241234567",
      criminalRecord: "ندارد",
      status: 1, // وضعیت: فعال
      approved: null, // در انتظار تایید
      gender: "female",
    },
    {
      firstName: "داود",
      lastName: "فرهادی",
      phone: "09251234567",
      criminalRecord: "ندارد",
      status: 0, // وضعیت: غیرفعال
      approved: true, // تایید شده
      gender: "male",
    },
  ];

  return (
    <div>
      <div className="w-full grid grid-cols-12 px-2 lg:px-10">
        {/* Title */}
        <div className="col-span-full text-xl font-iranianSansDemiBold">
          ویرایش شیفت
        </div>

        {/* Calendar */}
        <div className="col-span-full lg:col-span-6 xl:col-span-5">
          <CalendarComponent
            selectedDate={selectedDate}
            setSelectedDate={handleDateChange}
          />
        </div>

        {/* Form Fields */}
        <div className=" col-span-full lg:col-span-6 xl:col-span-7 auto-rows-min gap-5 grid grid-cols-12 mt-5">
          {/* Date Field with Calendar Icon */}
          <div className="col-span-6 xl:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تاریخ *
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                placeholder="از روی تقویم انتخاب کنید"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                📅
              </div>
            </div>
          </div>

          {/* Time From Field */}
          <div className="col-span-6 xl:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              از ساعت *
            </label>
            <TimePicker24
              value={formData.timeFrom}
              onChange={(time) => handleInputChange('timeFrom', time)}
              placeholder="انتخاب ساعت شروع"
            />
          </div>

          {/* Time To Field */}
          <div className="col-span-6 xl:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تا ساعت *
            </label>
            <TimePicker24
              value={formData.timeTo}
              onChange={(time) => handleInputChange('timeTo', time)}
              placeholder="انتخاب ساعت پایان"
            />
          </div>

          {/* Gender Field */}
          <div className="col-span-6 xl:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              جنسیت *
            </label>
            <div className="relative">
              <select
                value={formData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
              >
                <option value="">انتخاب کنید</option>
                <option value="important">مهم است</option>
                <option value="not-important">مهم نیست</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                👥
              </div>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                ▼
              </div>
            </div>
          </div>

          {/* Male Count Field */}
          <div className="col-span-6 xl:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تعداد خادمیاران مرد
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={formData.maleCount}
                onChange={(e) => handleInputChange('maleCount', e.target.value)}
                placeholder="10"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                👨
              </div>
            </div>
          </div>

          {/* Female Count Field */}
          <div className="col-span-6 xl:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              تعداد خادمیاران زن
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={formData.femaleCount}
                onChange={(e) => handleInputChange('femaleCount', e.target.value)}
                placeholder="10"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                👩
              </div>
            </div>
          </div>

          {/* Min Count Field */}
          <div className="col-span-6 xl:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حداقل تعداد خادمیاران *
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={formData.minCount}
                onChange={(e) => handleInputChange('minCount', e.target.value)}
                placeholder="20"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                📊
              </div>
            </div>
          </div>

          {/* Max Count Field */}
          <div className="col-span-6 xl:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              حداکثر تعداد خادمیاران *
            </label>
            <div className="relative">
              <input
                type="number"
                min="0"
                value={formData.maxCount}
                onChange={(e) => handleInputChange('maxCount', e.target.value)}
                placeholder="35"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                📈
              </div>
            </div>
          </div>

          {/* Occasion Field */}
          <div className="col-span-12 xl:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              مناسبت
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.occasion}
                onChange={(e) => handleInputChange('occasion', e.target.value)}
                placeholder="مناسبت را وارد کنید"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🎉
              </div>
            </div>
          </div>

          {/* Send SMS Field */}
          <div className="col-span-6 xl:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ارسال پیامک *
            </label>
            <div className="relative">
              <select
                value={formData.sendSMS}
                onChange={(e) => handleInputChange('sendSMS', e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors appearance-none bg-white"
              >
                <option value="">انتخاب کنید</option>
                <option value="yes">بله</option>
                <option value="no">خیر</option>
              </select>
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                📱
              </div>
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                ▼
              </div>
            </div>
          </div>

          {/* ID Field */}
          <div className="col-span-6 xl:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ID
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.id}
                onChange={(e) => handleInputChange('id', e.target.value)}
                placeholder="شناسه"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                🆔
              </div>
            </div>
          </div>

          {/* Last Modified By Field */}
          <div className="col-span-12 xl:col-span-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              آخرین تغییر توسط
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.lastModifiedBy}
                onChange={(e) => handleInputChange('lastModifiedBy', e.target.value)}
                placeholder="نام کاربر"
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                👤
              </div>
            </div>
          </div>

          {/* Description Field */}
          <div className="col-span-12">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              توضیح
            </label>
            <div className="relative">
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="توضیحات اضافی..."
                rows={4}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical"
              />
              <div className="absolute right-3 top-3 text-gray-400">
                📝
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="col-span-12 flex flex-wrap gap-3 mt-4">
            <button 
              onClick={handleSaveChanges}
              className="flex-1 min-w-[150px] bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              💾 ثبت تغییرات
            </button>
            
            <button 
              onClick={handleDeleteShift}
              className="flex-1 min-w-[150px] bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              🗑️ حذف شیفت
            </button>
          </div>
        </div>
      </div>
      <div className="max-md:mt-5 mt-10">
        <div>
          <UserList title="لیست افراد ثبت نام شده" requests={requests} />
        </div>
      </div>
    </div>
  );
}

export default EditShiftPage;
