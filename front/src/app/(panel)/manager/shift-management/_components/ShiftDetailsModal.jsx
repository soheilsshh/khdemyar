"use client";
import React, { useState } from 'react';
import { FaTimes, FaCheck, FaTimesCircle, FaUsers, FaStar, FaEdit } from 'react-icons/fa';
import Swal from 'sweetalert2';

const ShiftDetailsModal = ({ shift, onClose }) => {
    const [users, setUsers] = useState(shift.users || []);
    const [isEditing, setIsEditing] = useState(false);

    const handleUserRatingChange = (userId, rating) => {
        setUsers(prev => prev.map(user => 
            user.id === userId ? { ...user, rating } : user
        ));
    };

    const handleBulkRating = (rating) => {
        setUsers(prev => prev.map(user => ({ ...user, rating })));
        
        Swal.fire({
            title: 'موفقیت',
            text: `همه کاربران به عنوان ${rating ? 'درست' : 'نادرست'} نمره‌دهی شدند`,
            icon: 'success',
            confirmButtonText: 'باشه'
        });
    };

    const handleSaveRatings = () => {
        // Here you would save the ratings to your backend
        Swal.fire({
            title: 'موفقیت',
            text: 'نمره‌دهی‌ها با موفقیت ذخیره شد',
            icon: 'success',
            confirmButtonText: 'باشه'
        });
        setIsEditing(false);
    };

    const getRatingStats = () => {
        const total = users.length;
        const correct = users.filter(u => u.rating === true).length;
        const incorrect = users.filter(u => u.rating === false).length;
        const pending = users.filter(u => u.rating === null).length;
        
        return { total, correct, incorrect, pending };
    };

    const stats = getRatingStats();

    return (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className='absolute z-5 inset-0 bg-green-300/20 backdrop-blur-sm'>

            </div>
            <div className="bg-white z-10 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-800">
                        جزئیات شیفت {shift.date}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        <FaTimes size={20} />
                    </button>
                </div>

                {/* Shift Details - Read Only */}
                <div className="p-6 border-b border-gray-200">
                    <h3 className="text-lg font-semibold mb-4 text-gray-800">اطلاعات شیفت</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">📅</span>
                                <span className="font-medium text-gray-700">تاریخ</span>
                            </div>
                            <p className="text-gray-600">{shift.date}</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🕐</span>
                                <span className="font-medium text-gray-700">زمان</span>
                            </div>
                            <p className="text-gray-600">{shift.from} - {shift.to}</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">👥</span>
                                <span className="font-medium text-gray-700">تعداد کل</span>
                            </div>
                            <p className="text-gray-600">{shift.all} نفر</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">👨</span>
                                <span className="font-medium text-gray-700">مرد</span>
                            </div>
                            <p className="text-gray-600">{shift.man} نفر</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">👩</span>
                                <span className="font-medium text-gray-700">زن</span>
                            </div>
                            <p className="text-gray-600">{shift.woman} نفر</p>
                        </div>
                        
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">📝</span>
                                <span className="font-medium text-gray-700">مناسب برای</span>
                            </div>
                            <p className="text-gray-600">{shift.suitable}</p>
                        </div>
                    </div>
                </div>

                {/* User Rating Section */}
                {shift.isCompleted && (
                    <div className="p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                                <FaUsers />
                                نمره‌دهی کاربران
                            </h3>
                            <div className="flex gap-2">
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
                                    >
                                        <FaEdit />
                                        ویرایش نمره‌ها
                                    </button>
                                ) : (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSaveRatings}
                                            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                                        >
                                            <FaCheck />
                                            ذخیره
                                        </button>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                        >
                                            انصراف
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Statistics */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                                <div className="text-sm text-blue-800">کل کاربران</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-green-600">{stats.correct}</div>
                                <div className="text-sm text-green-800">درست انجام داده</div>
                            </div>
                            <div className="bg-red-50 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-red-600">{stats.incorrect}</div>
                                <div className="text-sm text-red-800">نادرست انجام داده</div>
                            </div>
                            <div className="bg-orange-50 p-4 rounded-lg text-center">
                                <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
                                <div className="text-sm text-orange-800">در انتظار نمره</div>
                            </div>
                        </div>

                        {/* Bulk Actions */}
                        {isEditing && (
                            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                                <h4 className="font-medium mb-3 text-gray-700">عملیات گروهی:</h4>
                                <div className="flex gap-2 flex-wrap">
                                    <button
                                        onClick={() => handleBulkRating(true)}
                                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2"
                                    >
                                        <FaCheck />
                                        همه را درست نمره‌دهی کن
                                    </button>
                                    <button
                                        onClick={() => handleBulkRating(false)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors flex items-center gap-2"
                                    >
                                        <FaTimesCircle />
                                        همه را نادرست نمره‌دهی کن
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Users List */}
                        <div className="space-y-3">
                            {users.length > 0 ? (
                                users.map((user) => (
                                    <div key={user.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                                                <span className="text-gray-600 font-medium">
                                                    {user.name.charAt(0)}
                                                </span>
                                            </div>
                                            <span className="font-medium text-gray-800">{user.name}</span>
                                        </div>
                                        
                                        {isEditing ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleUserRatingChange(user.id, true)}
                                                    className={`p-2 rounded-full transition-colors ${
                                                        user.rating === true 
                                                            ? 'bg-green-500 text-white' 
                                                            : 'bg-gray-200 text-gray-600 hover:bg-green-100'
                                                    }`}
                                                    title="درست انجام داده"
                                                >
                                                    <FaCheck size={16} />
                                                </button>
                                                <button
                                                    onClick={() => handleUserRatingChange(user.id, false)}
                                                    className={`p-2 rounded-full transition-colors ${
                                                        user.rating === false 
                                                            ? 'bg-red-500 text-white' 
                                                            : 'bg-gray-200 text-gray-600 hover:bg-red-100'
                                                    }`}
                                                    title="نادرست انجام داده"
                                                >
                                                    <FaTimesCircle size={16} />
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="flex items-center gap-2">
                                                {user.rating === true && (
                                                    <span className="flex items-center gap-1 text-green-600 bg-green-100 px-3 py-1 rounded-full text-sm">
                                                        <FaCheck size={12} />
                                                        درست
                                                    </span>
                                                )}
                                                {user.rating === false && (
                                                    <span className="flex items-center gap-1 text-red-600 bg-red-100 px-3 py-1 rounded-full text-sm">
                                                        <FaTimesCircle size={12} />
                                                        نادرست
                                                    </span>
                                                )}
                                                {user.rating === null && (
                                                    <span className="flex items-center gap-1 text-orange-600 bg-orange-100 px-3 py-1 rounded-full text-sm">
                                                        <FaStar size={12} />
                                                        در انتظار
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    <FaUsers size={48} className="mx-auto mb-4 opacity-50" />
                                    <p>هیچ کاربری برای این شیفت ثبت نشده است</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Footer */}
                <div className="flex justify-end p-6 border-t border-gray-200">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                        بستن
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ShiftDetailsModal;
