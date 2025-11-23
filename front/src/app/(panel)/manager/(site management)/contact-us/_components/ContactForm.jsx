'use client';
import React, { useState } from 'react';
import { FaTelegram, FaInstagram, FaPhone, FaMapMarkerAlt, FaGlobe, FaSave, FaEdit, FaTimes, FaCheck } from 'react-icons/fa';
import Eata from '@/components/Eata';
import Soroush from '@/components/Soroush';
import Swal from 'sweetalert2';

const ContactForm = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [contactData, setContactData] = useState({
    telegram: '@khademyar_official',
    instagram: '@khademyar.ir',
    eitaa: '@khademyar_eitaa',
    soroush: '@khademyar_soroush',
    websiteAddress: 'https://khademyar.ir',
    teahouseAddress: 'تهران، خیابان انقلاب، نرسیده به چهارراه کالج، پلاک ۱۲۳',
    phoneNumber: '021-88776655'
  });

  const [formData, setFormData] = useState({ ...contactData });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({ ...contactData });
  };

  const handleSave = async () => {
    // Validation
    const requiredFields = ['telegram', 'instagram', 'websiteAddress', 'teahouseAddress', 'phoneNumber'];
    const emptyFields = requiredFields.filter(field => !formData[field].trim());
    
    if (emptyFields.length > 0) {
      Swal.fire({
        title: 'خطا!',
        text: 'لطفاً تمام فیلدهای ضروری را پر کنید.',
        icon: 'error',
        confirmButtonText: 'باشه'
      });
      return;
    }

    // Phone number validation
    const phoneRegex = /^[\d\-\s\+\(\)]+$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      Swal.fire({
        title: 'خطا!',
        text: 'شماره تماس وارد شده معتبر نیست.',
        icon: 'error',
        confirmButtonText: 'باشه'
      });
      return;
    }

    try {
      // Here you would typically save to backend
      setContactData({ ...formData });
      setIsEditing(false);
      
      Swal.fire({
        title: 'موفق!',
        text: 'اطلاعات تماس با موفقیت به‌روزرسانی شد.',
        icon: 'success',
        confirmButtonText: 'عالی'
      });
    } catch (error) {
      Swal.fire({
        title: 'خطا!',
        text: 'خطایی در ذخیره اطلاعات رخ داد.',
        icon: 'error',
        confirmButtonText: 'باشه'
      });
    }
  };

  const handleCancel = () => {
    setFormData({ ...contactData });
    setIsEditing(false);
  };

  const socialMediaItems = [
    {
      key: 'telegram',
      label: 'تلگرام',
      icon: FaTelegram,
      color: 'text-blue-500 size-10',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    {
      key: 'instagram',
      label: 'اینستاگرام',
      icon: FaInstagram,
      color: 'text-pink-500 size-10',
      bgColor: 'bg-pink-50',
      borderColor: 'border-pink-200'
    },
    {
      key: 'eitaa',
      label: 'ایتا',
      icon: Eata,
      color: 'text-orange-500 ',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      key: 'soroush',
      label: 'سروش',
      icon: Soroush,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ];

  const contactItems = [
    {
      key: 'websiteAddress',
      label: 'آدرس سایت',
      icon: FaGlobe,
      color: 'text-indigo-500',
      bgColor: 'bg-indigo-50',
      borderColor: 'border-indigo-200',
      placeholder: 'https://example.com'
    },
    {
      key: 'teahouseAddress',
      label: 'آدرس چایخانه',
      icon: FaMapMarkerAlt,
      color: 'text-red-500',
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      placeholder: 'آدرس کامل چایخانه را وارد کنید',
      isTextarea: true
    },
    {
      key: 'phoneNumber',
      label: 'شماره تماس',
      icon: FaPhone,
      color: 'text-emerald-500',
      bgColor: 'bg-emerald-50',
      borderColor: 'border-emerald-200',
      placeholder: '021-12345678'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">مدیریت اطلاعات تماس</h1>
        <p className="text-gray-600">اطلاعات تماس و شبکه‌های اجتماعی خود را مدیریت کنید</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3 mb-6">
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <FaEdit size={16} />
            ویرایش اطلاعات
          </button>
        ) : (
          <div className="flex gap-3">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FaCheck size={16} />
              ذخیره تغییرات
            </button>
            <button
              onClick={handleCancel}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <FaTimes size={16} />
              انصراف
            </button>
          </div>
        )}
      </div>

      {/* Social Media Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
            <FaInstagram className="text-white text-lg" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">شبکه‌های اجتماعی</h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {socialMediaItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.key} className={`p-6 rounded-xl border-2 ${item.bgColor} ${item.borderColor} transition-all duration-200 hover:shadow-lg`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${item.bgColor} rounded-lg flex items-center justify-center  ${item.borderColor}`}>
                    <IconComponent className={`${item.color} `} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.label}</h3>
                </div>
                
                {isEditing ? (
                  <input
                    type="text"
                    value={formData[item.key]}
                    onChange={(e) => handleInputChange(item.key, e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                    placeholder={`آیدی ${item.label} را وارد کنید`}
                  />
                ) : (
                  <div className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-gray-700 font-medium">
                    {contactData[item.key] || `آیدی ${item.label} تنظیم نشده`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Contact Information Section */}
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
            <FaPhone className="text-white text-lg" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">اطلاعات تماس</h2>
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          {contactItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.key} className={`p-6 rounded-xl border-2 ${item.bgColor} ${item.borderColor} transition-all duration-200 hover:shadow-lg`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 ${item.bgColor} rounded-lg flex items-center justify-center border ${item.borderColor}`}>
                    <IconComponent className={`${item.color} text-lg`} />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">{item.label}</h3>
                </div>
                
                {isEditing ? (
                  item.isTextarea ? (
                    <textarea
                      value={formData[item.key]}
                      onChange={(e) => handleInputChange(item.key, e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white resize-none"
                      placeholder={item.placeholder}
                    />
                  ) : (
                    <input
                      type="text"
                      value={formData[item.key]}
                      onChange={(e) => handleInputChange(item.key, e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                      placeholder={item.placeholder}
                    />
                  )
                ) : (
                  <div className="bg-white px-4 py-3 rounded-lg border border-gray-200 text-gray-700 font-medium min-h-[48px] flex items-center">
                    {contactData[item.key] || `${item.label} تنظیم نشده`}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};

export default ContactForm;
