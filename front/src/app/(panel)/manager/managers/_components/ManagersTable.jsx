"use client";
import React, { useState, useMemo } from 'react';
import { FaEye, FaUserShield, FaInfo, FaSearch, FaFilter } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import Pagination from '@/components/Pagination';
import { motion, AnimatePresence } from 'framer-motion';

const ManagersTable = ({ title = "مدیریت مدیران" }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeAccessFilters, setActiveAccessFilters] = useState([]);
    const [showFilterSidebar, setShowFilterSidebar] = useState(false);
    const itemsPerPage = 10;
    const router = useRouter();

    // Sample managers data
    const managers = [
        { id: 1, firstName: 'علی', lastName: 'احمدی', phone: '09123456789', accessLevels: ['پروفایل', 'مدیریت شیفت‌ها', 'مدیریت سایت'], accessCount: 3 },
        { id: 2, firstName: 'فاطمه', lastName: 'محمدی', phone: '09123456790', accessLevels: ['پروفایل', 'درخواست‌های ثبت‌نام', 'خادمیاران'], accessCount: 3 },
        { id: 3, firstName: 'حسن', lastName: 'رضایی', phone: '09123456791', accessLevels: ['پروفایل', 'مدیریت شیفت‌ها'], accessCount: 2 },
        { id: 4, firstName: 'زهرا', lastName: 'کریمی', phone: '09123456792', accessLevels: ['پروفایل', 'مدیریت سایت', 'مدیرها'], accessCount: 3 },
        { id: 5, firstName: 'محمد', lastName: 'حسینی', phone: '09123456793', accessLevels: ['پروفایل'], accessCount: 1 },
        { id: 6, firstName: 'مریم', lastName: 'نوری', phone: '09123456794', accessLevels: ['پروفایل', 'درخواست‌های ثبت‌نام', 'خادمیاران', 'مدیریت شیفت‌ها'], accessCount: 4 },
        { id: 7, firstName: 'رضا', lastName: 'موسوی', phone: '09123456795', accessLevels: ['پروفایل', 'مدیریت سایت'], accessCount: 2 },
        { id: 8, firstName: 'سارا', lastName: 'جعفری', phone: '09123456796', accessLevels: ['پروفایل', 'مدیرها'], accessCount: 2 },
        { id: 9, firstName: 'امیر', lastName: 'کاظمی', phone: '09123456797', accessLevels: ['پروفایل', 'درخواست‌های ثبت‌نام'], accessCount: 2 },
        { id: 10, firstName: 'نرگس', lastName: 'صادقی', phone: '09123456798', accessLevels: ['پروفایل', 'خادمیاران', 'مدیریت شیفت‌ها', 'مدیریت سایت'], accessCount: 4 },
        { id: 11, firstName: 'حسین', lastName: 'طاهری', phone: '09123456799', accessLevels: ['پروفایل', 'مدیریت شیفت‌ها', 'مدیرها'], accessCount: 3 },
        { id: 12, firstName: 'لیلا', lastName: 'مرادی', phone: '09123456800', accessLevels: ['پروفایل', 'درخواست‌های ثبت‌نام', 'خادمیاران'], accessCount: 3 },
        { id: 13, firstName: 'عبدالله', lastName: 'نوری', phone: '09123456801', accessLevels: ['پروفایل', 'مدیریت سایت'], accessCount: 2 },
        { id: 14, firstName: 'فریبا', lastName: 'احمدی', phone: '09123456802', accessLevels: ['پروفایل', 'مدیرها'], accessCount: 2 },
        { id: 15, firstName: 'مهدی', lastName: 'کریمی', phone: '09123456803', accessLevels: ['پروفایل', 'درخواست‌های ثبت‌نام', 'مدیریت شیفت‌ها'], accessCount: 3 },
        { id: 16, firstName: 'زینب', lastName: 'حسینی', phone: '09123456804', accessLevels: ['پروفایل', 'خادمیاران'], accessCount: 2 },
        { id: 17, firstName: 'محسن', lastName: 'موسوی', phone: '09123456805', accessLevels: ['پروفایل', 'مدیریت سایت', 'مدیرها'], accessCount: 3 },
        { id: 18, firstName: 'طاهره', lastName: 'جعفری', phone: '09123456806', accessLevels: ['پروفایل', 'درخواست‌های ثبت‌نام', 'مدیریت شیفت‌ها', 'خادمیاران'], accessCount: 4 },
        { id: 19, firstName: 'علی‌رضا', lastName: 'کاظمی', phone: '09123456807', accessLevels: ['پروفایل', 'مدیریت سایت'], accessCount: 2 },
        { id: 20, firstName: 'مرضیه', lastName: 'صادقی', phone: '09123456808', accessLevels: ['پروفایل', 'مدیرها'], accessCount: 2 },
        { id: 21, firstName: 'حامد', lastName: 'طاهری', phone: '09123456809', accessLevels: ['پروفایل', 'درخواست‌های ثبت‌نام', 'خادمیاران', 'مدیریت شیفت‌ها', 'مدیریت سایت'], accessCount: 5 },
        { id: 22, firstName: 'سودابه', lastName: 'مرادی', phone: '09123456810', accessLevels: ['پروفایل', 'مدیرها'], accessCount: 2 },
        { id: 23, firstName: 'بهرام', lastName: 'نوری', phone: '09123456811', accessLevels: ['پروفایل', 'درخواست‌های ثبت‌نام'], accessCount: 2 },
        { id: 24, firstName: 'گلناز', lastName: 'احمدی', phone: '09123456812', accessLevels: ['پروفایل', 'خادمیاران', 'مدیریت شیفت‌ها'], accessCount: 3 },
        { id: 25, firstName: 'فرهاد', lastName: 'کریمی', phone: '09123456813', accessLevels: ['پروفایل', 'مدیریت سایت', 'مدیرها'], accessCount: 3 }
    ];

    // Access level filter items
    const accessFilterItems = [
        { title: "1 دسترسی", id: 1, color: "bg-red-500" },
        { title: "2 دسترسی", id: 2, color: "bg-orange-500" },
        { title: "3 دسترسی", id: 3, color: "bg-yellow-500" },
        { title: "4 دسترسی", id: 4, color: "bg-green-500" },
        { title: "5 دسترسی", id: 5, color: "bg-blue-500" },
    ];

    // Filter and search logic
    const filteredManagers = useMemo(() => {
        let filtered = managers;

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter(manager => 
                manager.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                manager.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                manager.phone.includes(searchTerm) ||
                manager.accessLevels.some(level => 
                    level.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        // Access count filter
        if (activeAccessFilters.length > 0) {
            filtered = filtered.filter(manager => 
                activeAccessFilters.includes(manager.accessCount)
            );
        }

        return filtered;
    }, [managers, searchTerm, activeAccessFilters]);

    // Pagination logic
    const totalPages = Math.ceil(filteredManagers.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentManagers = filteredManagers.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleViewManager = (managerId) => {
        router.push(`/manager/managers/${managerId}`);
    };

    const handleMoreInfo = (managerId) => {
        router.push(`/manager/users/${managerId}`);
    };

    // Filter functions
    const removeAccessFilter = (id) => {
        setActiveAccessFilters((prev) => prev.filter((item) => item !== id));
    };

    const addAccessFilter = (id) => {
        setActiveAccessFilters((prev) => [...prev, id]);
    };

    const isAccessFilterExist = (id) => {
        return activeAccessFilters.includes(id);
    };

    const handleAccessFilterClick = (id) => {
        if (isAccessFilterExist(id)) {
            removeAccessFilter(id);
        } else {
            addAccessFilter(id);
        }
    };

    // Close sidebar when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (showFilterSidebar && !event.target.closest('.manager-filter-sidebar') && !event.target.closest('.manager-filter-button')) {
                setShowFilterSidebar(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [showFilterSidebar]);

    return (
        <div className="p-4 md:p-6 space-y-6">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{title}</h1>
                <p className="text-gray-600">مدیریت و نظارت بر مدیران سیستم</p>
            </div>

            {/* Search and Filter Section */}
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex flex-col lg:flex-row gap-4 items-center">
                    {/* Search Input */}
                    <div className="flex-1 w-full">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="جستجو در نام، نام خانوادگی، شماره تماس یا سطح دسترسی..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white"
                            />
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                <FaSearch size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Filter Button */}
                    <div className="flex-shrink-0">
                        <button
                            onClick={() => setShowFilterSidebar(true)}
                            className="manager-filter-button bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                        >
                            <FaFilter size={16} />
                            فیلتر دسترسی
                        </button>
                    </div>
                </div>

                {/* Search Results Info */}
                {searchTerm && (
                    <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                            {filteredManagers.length} مدیر از {managers.length} مدیر پیدا شد
                            {searchTerm && ` برای "${searchTerm}"`}
                        </p>
                    </div>
                )}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
                <table className="min-w-full">
                    <thead>
                        <tr className="bg-dMain/70 text-center text-black">
                            <th className="p-4 border border-l-2 border-gray-400 w-16">#</th>
                            <th className="p-4 border border-x-2 border-gray-400">نام</th>
                            <th className="p-4 border border-x-2 border-gray-400">نام خانوادگی</th>
                            <th className="p-4 border border-x-2 border-gray-400">شماره تماس</th>
                            <th className="p-4 border border-x-2 border-gray-400">تعداد دسترسی</th>
                            <th className="p-4 border border-r-2 border-gray-400/70 w-24">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentManagers.map((manager, index) => (
                            <tr key={manager.id} className="hover:bg-gray-50">
                                <td className="p-4 border border-l-2 border-gray-400/70 text-center w-16">
                                    {startIndex + index + 1}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400/70 text-right">
                                    {manager.firstName}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400/70 text-right">
                                    {manager.lastName}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400/70 text-center">
                                    {manager.phone}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400/70 text-center">
                                    <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                                        {manager.accessCount} دسترسی
                                    </span>
                                </td>
                                <td className="p-4 border border-r-2 border-gray-400/70 text-center w-24">
                                    <div className="flex justify-center gap-2">
                                        <button
                                            onClick={() => handleViewManager(manager.id)}
                                            className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                            title="مشاهده جزئیات"
                                        >
                                            <FaEye size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleMoreInfo(manager.id)}
                                            className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                                            title="اطلاعات بیشتر"
                                        >
                                            <FaInfo size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Table */}
            <div className="md:hidden space-y-4">
                {currentManagers.map((manager, index) => (
                    <div key={manager.id} className="bg-white rounded-xl shadow-lg p-4">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">
                                    {manager.firstName} {manager.lastName}
                                </h3>
                                <p className="text-sm text-gray-500">#{startIndex + index + 1}</p>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleViewManager(manager.id)}
                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
                                    title="مشاهده جزئیات"
                                >
                                    <FaEye size={16} />
                                </button>
                                <button
                                    onClick={() => handleMoreInfo(manager.id)}
                                    className="p-2 text-green-600 hover:bg-green-100 rounded-full transition-colors"
                                    title="اطلاعات بیشتر"
                                >
                                    <FaInfo size={16} />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filter Sidebar */}
            <AnimatePresence>
                {showFilterSidebar && (
                    <motion.div
                        className="fixed inset-0 h-screen  bg-black/50 backdrop-blur-sm z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setShowFilterSidebar(false)}
                    >
                        {/* Sidebar */}
                        <motion.div
                            className="manager-filter-sidebar fixed left-0 top-0 bottom-0 w-80 max-w-[90vw] bg-white shadow-2xl overflow-y-auto"
                            initial={{ x: -320 }}
                            animate={{ x: 0 }}
                            exit={{ x: -320 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Sidebar Header */}
                            <div className="flex justify-between items-center p-6 border-b border-gray-200">
                                <h2 className="text-xl font-bold text-gray-800">فیلتر دسترسی</h2>
                                <button
                                    onClick={() => setShowFilterSidebar(false)}
                                    className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Sidebar Content */}
                            <div className="p-6 space-y-6">
                                {/* Access Count Filter */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800">تعداد دسترسی</h3>
                                    <div className="space-y-3">
                                        {accessFilterItems.map((item) => (
                                            <button
                                                key={item.id}
                                                onClick={() => handleAccessFilterClick(item.id)}
                                                className={`w-full p-3 rounded-xl border-2 transition-all duration-200 flex items-center gap-3 ${
                                                    isAccessFilterExist(item.id)
                                                        ? `${item.color} text-white border-transparent shadow-lg`
                                                        : `bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300`
                                                }`}
                                            >
                                                <div className={`w-3 h-3 rounded-full ${
                                                    isAccessFilterExist(item.id) ? 'bg-white/30' : item.color
                                                }`} />
                                                {item.title}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Active Filters Summary */}
                                {activeAccessFilters.length > 0 && (
                                    <div className="p-4 bg-blue-50 rounded-lg">
                                        <h4 className="font-medium text-blue-800 mb-2">فیلترهای فعال:</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {activeAccessFilters.map((filterId) => {
                                                const filter = accessFilterItems.find(item => item.id === filterId);
                                                return (
                                                    <span
                                                        key={filterId}
                                                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                                                    >
                                                        {filter?.title}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
                <div dir='ltr' className="flex justify-center">
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}
        </div>
    );
};

export default ManagersTable;

