"use client";
import React, { useState } from 'react';
import { FaEdit, FaSave, FaTimes, FaEye, FaEyeSlash } from 'react-icons/fa';
import InputTypeOne from '@/components/InputTypeOne';

const ProfileTable = ({ title = "پروفایل مدیر" }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showChangePassword, setShowChangePassword] = useState(false);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [showPasswords, setShowPasswords] = useState({
        current: false,
        new: false,
        confirm: false
    });
    const [profileData, setProfileData] = useState({
        firstName: 'علی',
        lastName: 'احمدی',
        nationalCode: '1234567890',
        phone: '09123456789',
        email: 'ali.ahmadi@example.com',
        accessLevel: 'مدیر کل',
        permissions: [
            'پروفایل',
            'درخواست‌های ثبت‌نام',
            'خادمیاران',
            'مدیریت شیفت‌ها',
            'مدیریت سایت',
            'مدیر ها'
        ],
        joinDate: '1403/01/15',
        lastLogin: '1404/05/30'
    });

    const [editData, setEditData] = useState({
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        phone: profileData.phone,
        email: profileData.email
    });

    const handleEdit = () => {
        setIsEditing(true);
        setEditData({
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            phone: profileData.phone,
            email: profileData.email
        });
    };

    const handleSave = () => {
        setProfileData({
            ...profileData,
            ...editData
        });
        setIsEditing(false);
    };

    const handleCancel = () => {
        setIsEditing(false);
        setEditData({
            firstName: profileData.firstName,
            lastName: profileData.lastName,
            phone: profileData.phone,
            email: profileData.email
        });
    };

    const handleInputChange = (e) => {
        setEditData({
            ...editData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleChangePassword = () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            alert('رمز عبور جدید و تکرار آن مطابقت ندارند');
            return;
        }
        if (passwordData.newPassword.length < 6) {
            alert('رمز عبور باید حداقل 6 کاراکتر باشد');
            return;
        }
        // Here you would typically send the password change request to the server
        alert('رمز عبور با موفقیت تغییر کرد');
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setShowChangePassword(false);
    };

    const handleCancelPasswordChange = () => {
        setPasswordData({
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
        });
        setShowPasswords({
            current: false,
            new: false,
            confirm: false
        });
        setShowChangePassword(false);
    };

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const profileFields = [
        {
            label: 'نام',
            value: isEditing ? null : profileData.firstName,
            name: 'firstName',
            editable: true
        },
        {
            label: 'نام خانوادگی',
            value: isEditing ? null : profileData.lastName,
            name: 'lastName',
            editable: true
        },
        {
            label: 'کد ملی',
            value: profileData.nationalCode,
            editable: false
        },
        {
            label: 'شماره تماس',
            value: isEditing ? null : profileData.phone,
            name: 'phone',
            editable: true
        },
        {
            label: 'ایمیل',
            value: isEditing ? null : profileData.email,
            name: 'email',
            editable: true
        },
        {
            label: 'تاریخ عضویت',
            value: profileData.joinDate,
            editable: false
        },
        {
            label: 'آخرین ورود',
            value: profileData.lastLogin,
            editable: false
        }
    ];

    return (
        <div className="p-4 md:p-6 space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
                <div className="flex gap-2">
                    {!isEditing ? (
                        <>
                            <button
                                onClick={handleEdit}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            >
                                <FaEdit size={16} />
                                ویرایش
                            </button>
                            <button
                                onClick={() => setShowChangePassword(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                تغییر رمز عبور
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={handleSave}
                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                <FaSave size={16} />
                                ذخیره
                            </button>
                            <button
                                onClick={handleCancel}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                            >
                                <FaTimes size={16} />
                                لغو
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-white">
                    <div className="flex items-center gap-4">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                            <span className="text-2xl font-bold">
                                {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                            </span>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">
                                {profileData.firstName} {profileData.lastName}
                            </h2>
                            <p className="text-blue-100">{profileData.accessLevel}</p>
                        </div>
                    </div>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {profileFields.map((field, index) => (
                            <div key={index} className="space-y-2">
                                <label className="block text-sm font-medium text-gray-700">
                                    {field.label}
                                </label>
                                {isEditing && field.editable ? (
                                    <InputTypeOne
                                        name={field.name}
                                        value={editData[field.name]}
                                        onChange={handleInputChange}
                                        className="w-full"
                                        dir={field.name === 'email' ? 'ltr' : 'rtl'}
                                    />
                                ) : (
                                    <div className="p-3 bg-gray-50 rounded-lg border border-gray-200 min-h-[44px] flex items-center">
                                        {field.isPermissions ? (
                                            <div className="flex flex-wrap gap-2">
                                                {profileData.permissions.map((permission, idx) => (
                                                    <span 
                                                        key={idx}
                                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                                    >
                                                        {permission}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className={field.name === 'email' ? 'text-left' : 'text-right'}>
                                                {field.value}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Access Level Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">سطح دسترسی</h3>
                <div className="flex flex-wrap gap-3">
                    {profileData.permissions.map((permission, idx) => (
                        <span 
                            key={idx}
                            className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium border border-blue-200"
                        >
                            {permission}
                        </span>
                    ))}
                </div>
            </div>

            {/* Change Password Modal */}
            {showChangePassword && (
                <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className='bg-gray-500/30 backdrop-blur-sm absolute inset-0 z-5'>

                    </div>
                    <div className="bg-white rounded-xl max-w-lg w-full shadow-2xl z-10">
                        <div className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-t-xl">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-white">تغییر رمز عبور</h2>
                                <button
                                    onClick={handleCancelPasswordChange}
                                    className="text-white hover:text-gray-200 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                        
                        <div  className="p-6 space-y-6 z-10">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">رمز عبور فعلی</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.current ? "text" : "password"}
                                            name="currentPassword"
                                            value={passwordData.currentPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                            placeholder="رمز عبور فعلی خود را وارد کنید"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('current')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPasswords.current ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">رمز عبور جدید</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.new ? "text" : "password"}
                                            name="newPassword"
                                            value={passwordData.newPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                            placeholder="رمز عبور جدید خود را وارد کنید"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('new')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPasswords.new ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                        </button>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">تکرار رمز عبور جدید</label>
                                    <div className="relative">
                                        <input
                                            type={showPasswords.confirm ? "text" : "password"}
                                            name="confirmPassword"
                                            value={passwordData.confirmPassword}
                                            onChange={handlePasswordChange}
                                            className="w-full p-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                                            placeholder="رمز عبور جدید را مجدداً وارد کنید"
                                            required
                                        />
                                        <button
                                            type="button"
                                            onClick={() => togglePasswordVisibility('confirm')}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPasswords.confirm ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end gap-3">
                                <button
                                    onClick={handleCancelPasswordChange}
                                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                                >
                                    لغو
                                </button>
                                <button
                                    onClick={handleChangePassword}
                                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all font-medium shadow-lg"
                                >
                                    تغییر رمز عبور
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProfileTable;
