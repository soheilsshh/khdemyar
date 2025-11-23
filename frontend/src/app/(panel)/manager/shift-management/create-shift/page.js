"use client";
import CalendarComponent from "@/components/CalendarComponent";
import InputTypeOne from "@/components/InputTypeOne";
import SelectTypeOne from "@/components/SelectTypeOne";
import TextAreaTypeOne from "@/components/TextAreaTypeOne";
import { toJalaali } from "jalaali-js";
import React, { useReducer } from "react";
import Swal from 'sweetalert2';
import TimePicker24 from '@/components/TimePicker24';

const today = toJalaali(new Date());

const initialState = {
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
  description: "",
};

function reducer(state, action) {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_DATE":
      return { ...state, date: action.value };
    default:
      return state;
  }
}

function Page() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [selectedDate, setSelectedDate] = React.useState({
    year: today.jy,
    month: today.jm,
    day: today.jd,
  });

  React.useEffect(() => {
    dispatch({
      type: "SET_DATE",
      value: `${selectedDate.year}/${selectedDate.month}/${selectedDate.day}`,
    });
  }, [selectedDate]);

  // Handle date change from calendar
  const handleDateChange = (newDate) => {
    setSelectedDate(newDate);
  };

  // Handle input change with validation
  const handleInputChange = (field, value) => {
    // Prevent negative numbers for count fields
    if (['maleCount', 'femaleCount', 'minCount', 'maxCount'].includes(field)) {
      const numValue = parseInt(value);
      if (numValue < 0) {
        return; // Don't update if negative
      }
    }

    dispatch({ type: "SET_FIELD", field, value });
  };

  // Create shift function
  const handleCreateShift = () => {
    // Validation
    if (!state.date || !state.timeFrom || !state.timeTo || !state.minCount || !state.maxCount) {
      Swal.fire({
        title: 'خطا',
        text: 'لطفاً فیلدهای ضروری را پر کنید.',
        icon: 'error',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    // Check if numbers are valid and positive
    const minCount = parseInt(state.minCount);
    const maxCount = parseInt(state.maxCount);
    const maleCount = parseInt(state.maleCount) || 0;
    const femaleCount = parseInt(state.femaleCount) || 0;

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
      title: 'ایجاد شیفت',
      text: 'آیا از ایجاد شیفت جدید اطمینان دارید؟',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'بله، ایجاد کن',
      cancelButtonText: 'انصراف'
    }).then((result) => {
      if (result.isConfirmed) {
        // Here you would send state to your backend
        console.log('Form data to create:', state);
        Swal.fire('ایجاد شد!', 'شیفت جدید با موفقیت ایجاد شد.', 'success');
      }
    });
  };

  return (
    <div className="w-full grid grid-cols-12 px-2 lg:px-10">
      <div className="col-span-full text-xl font-iranianSansDemiBold">
        ایجاد شیفت جدید
      </div>
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
              value={state.date}
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
            value={state.timeFrom}
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
            value={state.timeTo}
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
              value={state.gender}
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
              value={state.maleCount}
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
              value={state.femaleCount}
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
              value={state.minCount}
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
              value={state.maxCount}
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
              value={state.occasion}
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
            ارسال پیامک
          </label>
          <div className="relative">
            <select
              value={state.sendSMS}
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
              value={state.id}
              onChange={(e) => handleInputChange('id', e.target.value)}
              placeholder="شناسه"
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              🆔
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
              value={state.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="توضیحات اضافی..."
              rows={4}
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-vertical bg-white"
            />
            <div className="absolute right-3 top-3 text-gray-400">
              📝
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="col-span-12 flex justify-center mt-4">
          <button 
            onClick={handleCreateShift}
            className="min-w-[200px] bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            ✨ ایجاد شیفت جدید
          </button>
        </div>
      </div>
    </div>
  );
}

export default Page;