"use client";
import React, { useState } from 'react';
import { FaArrowLeft, FaUserShield, FaPlus, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { useRouter } from 'next/navigation';

const ManagerDetail = ({ managerId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [selectedAccess, setSelectedAccess] = useState('');
    const [currentAccess, setCurrentAccess] = useState(['پروفایل', 'مدیریت شیفت‌ها', 'مدیریت سایت']);
    const router = useRouter();

    // Sample manager data
    const managerData = {
        id: managerId,
        firstName: 'علی',
        lastName: 'احمدی',
        phone: '09123456789',
        email: 'ali.ahmadi@example.com',
        nationalCode: '1234567890',
        joinDate: '1403/01/15'
    };

    // All available access levels
    const allAccessLevels = [
        'پروفایل',
        'درخواست‌های ثبت‌نام',
        'خادمیاران',
        'مدیریت شیفت‌ها',
        'مدیریت سایت',
        'مدیرها'
    ];

    const handleBack = () => {
        router.back();
    };

    const handleAddAccess = () => {
        if (selectedAccess && !currentAccess.includes(selectedAccess)) {
            setCurrentAccess([...currentAccess, selectedAccess]);
            setSelectedAccess('');
        }
    };

    const handleRemoveAccess = (access) => {
        setCurrentAccess(currentAccess.filter(item => item !== access));
    };

    const handleSaveChanges = () => {
        // In real app, this would save all changes to database
        console.log('Saving changes...');
        setIsEditing(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setSelectedAccess('');
        // Reset to original access levels
        setCurrentAccess(['پروفایل', 'مدیریت شیفت‌ها', 'مدیریت سایت']);
    };

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4 mb-6">
                <button
                    onClick={handleBack}
                    className="p-2 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition-colors"
                >
                    <FaArrowLeft size={16} />
                </button>
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                        جزئیات مدیر: {managerData.firstName} {managerData.lastName}
                    </h1>
                    <p className="text-gray-600">مدیریت دسترسی‌ها و اطلاعات مدیر</p>
                </div>
            </div>

            {/* Manager Info Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">اطلاعات شخصی</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">نام</label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {managerData.firstName}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">نام خانوادگی</label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {managerData.lastName}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">شماره تماس</label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {managerData.phone}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">ایمیل</label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {managerData.email}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">کد ملی</label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {managerData.nationalCode}
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">تاریخ عضویت</label>
                        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            {managerData.joinDate}
                        </div>
                    </div>
                </div>
            </div>

            {/* Access Levels Management */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FaUserShield className="text-blue-600" />
                        مدیریت دسترسی‌ها
                    </h3>
                    <button
                        onClick={() => setIsEditing(!isEditing)}
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                            isEditing 
                                ? 'bg-gray-500 text-white hover:bg-gray-600' 
                                : 'bg-blue-500 text-white hover:bg-blue-600'
                        }`}
                    >
                        {isEditing ? 'لغو ویرایش' : 'ویرایش دسترسی‌ها'}
                    </button>
                </div>

                {/* Current Access Levels */}
                <div className="mb-6">
                    <h4 className="text-lg font-semibold text-gray-700 mb-3">دسترسی‌های فعلی</h4>
                    <div className="flex flex-wrap gap-2">
                        {currentAccess.map((access, index) => (
                            <div key={index} className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-2 rounded-full">
                                <span className="text-sm font-medium">{access}</span>
                                {isEditing && (
                                    <button
                                        onClick={() => handleRemoveAccess(access)}
                                        className="text-red-600 hover:bg-red-200 rounded-full p-1 transition-colors"
                                        title="حذف دسترسی"
                                    >
                                        <FaTimes size={12} />
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Add New Access Level */}
                {isEditing && (
                    <div className="border-t pt-6">
                        <h4 className="text-lg font-semibold text-gray-700 mb-3">افزودن دسترسی جدید</h4>
                        <div className="flex gap-3">
                            <select
                                value={selectedAccess}
                                onChange={(e) => setSelectedAccess(e.target.value)}
                                className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="">انتخاب دسترسی</option>
                                {allAccessLevels
                                    .filter(access => !currentAccess.includes(access))
                                    .map((access, index) => (
                                        <option key={index} value={access}>
                                            {access}
                                        </option>
                                    ))}
                            </select>
                            <button
                                onClick={handleAddAccess}
                                disabled={!selectedAccess}
                                className="px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
                            >
                                <FaPlus size={16} />
                                افزودن
                            </button>
                        </div>
                    </div>
                )}

                {/* Save/Cancel Buttons */}
                {isEditing && (
                    <div className="flex gap-3 mt-6 pt-6 border-t">
                        <button
                            onClick={handleSaveChanges}
                            className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                        >
                            <FaCheck size={16} />
                            ذخیره تغییرات
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors flex items-center gap-2"
                        >
                            <FaTimes size={16} />
                            لغو
                        </button>
                    </div>
                )}
            </div>

            {/* Available Access Levels Info */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">دسترسی‌های موجود در سیستم</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {allAccessLevels.map((access, index) => (
                        <div key={index} className="flex items-center gap-2 text-blue-700">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <span className="text-sm">{access}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ManagerDetail;
