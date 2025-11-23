"use client";
import React, { useState } from 'react';
import { FaEye } from 'react-icons/fa';
import InputTypeOne from '@/components/InputTypeOne';
import Pagination from '@/components/Pagination';

const FeedbackTable = ({ title = "مدیریت فیدبک‌ها" }) => {
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Sample feedback data
    const [feedbacks] = useState([
        {
            id: 1,
            firstName: 'علی',
            lastName: 'احمدی',
            phone: '09123456789',
            email: 'ali.ahmadi@example.com',
            message: 'خدمات عالی بود، ممنون از زحمات شما'
        },
        {
            id: 2,
            firstName: 'فاطمه',
            lastName: 'محمدی',
            phone: '09187654321',
            email: 'fateme.mohammadi@example.com',
            message: 'چایخانه محیط بسیار آرام و دلنشینی دارد'
        },
        {
            id: 3,
            firstName: 'حسن',
            lastName: 'رضایی',
            phone: '09111111111',
            email: 'hasan.rezaei@example.com',
            message: 'پیشنهاد می‌کنم ساعت کاری را افزایش دهید'
        },
        {
            id: 4,
            firstName: 'زهرا',
            lastName: 'کریمی',
            phone: '09222222222',
            email: 'zahra.karimi@example.com',
            message: 'کیفیت چای و قهوه بسیار عالی است'
        },
        {
            id: 5,
            firstName: 'محمد',
            lastName: 'نوری',
            phone: '09333333333',
            email: 'mohammad.nouri@example.com',
            message: 'خدمات مشتری بسیار خوب و سریع است'
        },
        {
            id: 6,
            firstName: 'مریم',
            lastName: 'حسینی',
            phone: '09444444444',
            email: 'maryam.hosseini@example.com',
            message: 'فضای چایخانه بسیار دنج و آرامش‌بخش است'
        },
        {
            id: 7,
            firstName: 'رضا',
            lastName: 'کاظمی',
            phone: '09555555555',
            email: 'reza.kazemi@example.com',
            message: 'کارکنان بسیار مهربان و حرفه‌ای هستند'
        },
        {
            id: 8,
            firstName: 'نرگس',
            lastName: 'فرهادی',
            phone: '09666666666',
            email: 'narges.farahadi@example.com',
            message: 'منوی متنوع و قیمت‌های مناسب'
        },
        {
            id: 9,
            firstName: 'امیر',
            lastName: 'صادقی',
            phone: '09777777777',
            email: 'amir.sadeghi@example.com',
            message: 'محیط تمیز و بهداشتی، پیشنهاد می‌کنم'
        },
        {
            id: 10,
            firstName: 'سارا',
            lastName: 'موسوی',
            phone: '09888888888',
            email: 'sara.mousavi@example.com',
            message: 'چای سنتی عالی و قهوه‌های خوشمزه'
        },
        {
            id: 11,
            firstName: 'حامد',
            lastName: 'نوری',
            phone: '09999999999',
            email: 'hamed.nouri@example.com',
            message: 'سرویس سریع و کیفیت بالا'
        },
        {
            id: 12,
            firstName: 'لیلا',
            lastName: 'احمدی',
            phone: '09000000000',
            email: 'leila.ahmadi@example.com',
            message: 'فضای مطالعه عالی برای دانشجویان'
        },
        {
            id: 13,
            firstName: 'عرفان',
            lastName: 'محمدی',
            phone: '09111111112',
            email: 'erfan.mohammadi@example.com',
            message: 'دکوراسیون زیبا و فضای آرام'
        },
        {
            id: 14,
            firstName: 'نازنین',
            lastName: 'کریمی',
            phone: '09222222223',
            email: 'nazanin.karimi@example.com',
            message: 'پارکینگ مناسب و دسترسی آسان'
        },
        {
            id: 15,
            firstName: 'مهدی',
            lastName: 'رضایی',
            phone: '09333333334',
            email: 'mahdi.rezaei@example.com',
            message: 'قیمت‌ها منطقی و کیفیت عالی'
        },
        {
            id: 16,
            firstName: 'آرزو',
            lastName: 'حسینی',
            phone: '09444444445',
            email: 'arezu.hosseini@example.com',
            message: 'محیط خانوادگی و مناسب برای همه سنین'
        },
        {
            id: 17,
            firstName: 'پویا',
            lastName: 'کاظمی',
            phone: '09555555556',
            email: 'pouya.kazemi@example.com',
            message: 'سرویس وای‌فای رایگان و سریع'
        },
        {
            id: 18,
            firstName: 'شیدا',
            lastName: 'فرهادی',
            phone: '09666666667',
            email: 'shida.farahadi@example.com',
            message: 'کیک‌ها و شیرینی‌های خانگی عالی'
        },
        {
            id: 19,
            firstName: 'کامران',
            lastName: 'صادقی',
            phone: '09777777778',
            email: 'kamran.sadeghi@example.com',
            message: 'مدیریت خوب و نظافت عالی'
        },
        {
            id: 20,
            firstName: 'گلناز',
            lastName: 'موسوی',
            phone: '09888888889',
            email: 'golnaz.mousavi@example.com',
            message: 'فضای باز و نور طبیعی مناسب'
        }
    ]);

    // Pagination logic
    const totalPages = Math.ceil(feedbacks.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentFeedbacks = feedbacks.slice(startIndex, endIndex);

    const handleViewDetails = (feedback) => {
        setSelectedFeedback(feedback);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedFeedback(null);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    return (
        <div className="p-2 md:p-6 md:pt-0">
            <h1 className="text-2xl font-bold mb-4">{title}</h1>
            
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto border border-gray-400/70 rounded-lg shadow">
                <table className="min-w-full rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-dMain/70 text-center text-black">
                            <th className="p-4 border border-l-2 border-gray-400 w-16">#</th>
                            <th className="p-4 border border-x-2 border-gray-400">نام</th>
                            <th className="p-4 border border-x-2 border-gray-400">نام خانوادگی</th>
                            <th className="p-4 border border-x-2 border-gray-400">شماره تماس</th>
                            <th className="p-4 border border-x-2 border-gray-400">ایمیل</th>
                            <th className="p-4 border border-x-2 border-gray-400">متن پیام</th>
                            <th className="p-4 border border-r-2 border-gray-400/70 w-24">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentFeedbacks.map((feedback, index) => (
                            <tr key={feedback.id} className="hover:bg-gray-50">
                                <td className="p-4 border border-l-2 border-gray-400 text-center w-16">
                                    {startIndex + index + 1}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-right">
                                    {feedback.firstName}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-right">
                                    {feedback.lastName}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-right">
                                    {feedback.phone}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-right">
                                    {feedback.email}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-right break-words max-w-xs">
                                    {feedback.message}
                                </td>
                                <td className="p-4 border border-r-2 border-gray-400/70 text-center w-24">
                                    <button
                                        onClick={() => handleViewDetails(feedback)}
                                        className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                        title="View Details"
                                    >
                                        <FaEye size={14} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Table */}
            <div className="md:hidden space-y-4">
                {currentFeedbacks.map((feedback, index) => (
                    <div key={feedback.id} className="border border-gray-400/70 rounded-lg p-4 bg-white shadow">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-lg">{feedback.firstName} {feedback.lastName}</h3>
                                <p className="text-sm text-gray-600">#{startIndex + index + 1}</p>
                            </div>
                            <button
                                onClick={() => handleViewDetails(feedback)}
                                className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                title="View Details"
                            >
                                <FaEye size={16} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div dir='ltr' className="mt-6">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {/* Modal */}
            {isModalOpen && selectedFeedback && (
                <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className='absolute z-5 inset-0  bg-green-300/20 backdrop-blur-sm'>

                    </div>
                    <div className="bg-white z-10 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-bold">جزئیات فیدبک</h2>
                                <button
                                    onClick={closeModal}
                                    className="text-gray-500 hover:text-gray-700 text-2xl"
                                >
                                    ×
                                </button>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">نام</label>
                                        <div className="p-3 bg-gray-100 rounded-lg">{selectedFeedback.firstName}</div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">نام خانوادگی</label>
                                        <div className="p-3 bg-gray-100 rounded-lg">{selectedFeedback.lastName}</div>
                                    </div>
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">شماره تماس</label>
                                        <div className="p-3 bg-gray-100 rounded-lg">{selectedFeedback.phone}</div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">ایمیل</label>
                                        <div className="p-3 bg-gray-100 rounded-lg">{selectedFeedback.email}</div>
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">متن پیام</label>
                                    <div className="p-3 bg-gray-100 rounded-lg min-h-[100px]">
                                        {selectedFeedback.message}
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex justify-end mt-6">
                                <button
                                    onClick={closeModal}
                                    className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    بستن
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FeedbackTable;
