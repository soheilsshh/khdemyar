'use client';
import React, { useState } from 'react';
import { FaImage, FaFileAlt, FaEdit, FaTimes, FaCheck, FaSave } from 'react-icons/fa';
import ImageUploader from './ImageUploader';
import Swal from 'sweetalert2';

const HomePageManager = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [homePageData, setHomePageData] = useState({
    headerImageDesktop: null,
    headerImageMobile: null,
    aboutUsImage: null,
    aboutUsText: 'خادمیار یک پلتفرم جامع برای مدیریت و سازماندهی فعالیت‌های خیریه و خدماتی است. ما با هدف تسهیل ارتباط بین نیازمندان و خیرین، بستری امن و قابل اعتماد فراهم کرده‌ایم تا بتوانیم در جهت کمک به جامعه گام برداریم. تیم ما متشکل از افراد مجرب و متخصص در حوزه‌های مختلف است که با تلاش مستمر در جهت بهبود خدمات و ارائه بهترین تجربه کاربری تلاش می‌کنند.'
  });

  const [formData, setFormData] = useState({ ...homePageData });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (field, imageUrl, file) => {
    setFormData(prev => ({
      ...prev,
      [field]: imageUrl
    }));
  };

  const handleEdit = () => {
    setIsEditing(true);
    setFormData({ ...homePageData });
  };

  const handleSave = async () => {
    // Validation
    const requiredFields = ['aboutUsText'];
    const emptyFields = requiredFields.filter(field => !formData[field] || !formData[field].toString().trim());
    
    if (emptyFields.length > 0) {
      Swal.fire({
        title: 'خطا!',
        text: 'لطفاً متن درباره ما را پر کنید.',
        icon: 'error',
        confirmButtonText: 'باشه'
      });
      return;
    }

    // Check text length
    if (formData.aboutUsText.length < 50) {
      Swal.fire({
        title: 'خطا!',
        text: 'متن درباره ما باید حداقل 50 کاراکتر باشد.',
        icon: 'error',
        confirmButtonText: 'باشه'
      });
      return;
    }

    try {
      // Here you would typically save to backend
      setHomePageData({ ...formData });
      setIsEditing(false);
      
      Swal.fire({
        title: 'موفق!',
        text: 'محتوای صفحه اصلی با موفقیت به‌روزرسانی شد.',
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
    setFormData({ ...homePageData });
    setIsEditing(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 space-y-6 md:space-y-8">
      {/* Header */}
      <div className="text-center mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">مدیریت محتوای صفحه اصلی</h1>
        <p className="text-sm md:text-base text-gray-600">تصاویر و محتوای صفحه اصلی سایت خود را مدیریت کنید</p>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 md:gap-3 mb-4 md:mb-6">
        {!isEditing ? (
          <button
            onClick={handleEdit}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <FaEdit size={16} />
            ویرایش محتوا
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

      {/* Header Image Section */}
      <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
            <FaImage className="text-white text-sm md:text-lg" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">تصویر هدر صفحه اصلی</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* Desktop Header Image */}
          <div>
            <ImageUploader
              title="تصویر هدر - دسکتاپ"
              description="این تصویر در نمایش دسکتاپ به عنوان پس‌زمینه هدر نمایش داده می‌شود."
              currentImage={homePageData.headerImageDesktop}
              onImageChange={(imageUrl, file) => handleImageChange('headerImageDesktop', imageUrl, file)}
              isEditing={isEditing}
              aspectRatio="21/9"
              maxSizeMB={10}
              qualityNote={true}
            />
          </div>
          
          {/* Mobile Header Image */}
          <div>
            <ImageUploader
              title="تصویر هدر - موبایل"
              description="این تصویر در نمایش موبایل به عنوان پس‌زمینه هدر نمایش داده می‌شود."
              currentImage={homePageData.headerImageMobile}
              onImageChange={(imageUrl, file) => handleImageChange('headerImageMobile', imageUrl, file)}
              isEditing={isEditing}
              aspectRatio="21/9"
              maxSizeMB={8}
              qualityNote={true}
            />
          </div>
        </div>
      </div>

      {/* About Us Section */}
      <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-4 md:mb-6">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center">
            <FaFileAlt className="text-white text-sm md:text-lg" />
          </div>
          <h2 className="text-xl md:text-2xl font-bold text-gray-800">بخش درباره ما</h2>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
          {/* About Us Image */}
          <div>
            <ImageUploader
              title="تصویر درباره ما"
              description="این تصویر در بخش درباره ما صفحه اصلی نمایش داده می‌شود."
              currentImage={homePageData.aboutUsImage}
              onImageChange={(imageUrl, file) => handleImageChange('aboutUsImage', imageUrl, file)}
              isEditing={isEditing}
              aspectRatio="4/3"
              maxSizeMB={5}
              qualityNote={true}
            />
          </div>
          
          {/* About Us Text */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">متن درباره ما</h3>
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  value={formData.aboutUsText}
                  onChange={(e) => handleInputChange('aboutUsText', e.target.value)}
                  rows={12}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white resize-none"
                  placeholder="متن درباره ما را وارد کنید..."
                />
                <div className="text-sm text-gray-500 text-left">
                  {formData.aboutUsText.length} کاراکتر (حداقل 50 کاراکتر)
                </div>
              </div>
            ) : (
              <div className="bg-gray-50 px-4 py-6 rounded-lg border border-gray-200 text-gray-700 leading-relaxed min-h-[300px]">
                {homePageData.aboutUsText || 'متن درباره ما تنظیم نشده'}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};

export default HomePageManager;
