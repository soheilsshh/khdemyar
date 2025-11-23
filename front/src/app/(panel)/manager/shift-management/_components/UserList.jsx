'use client';
import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaCheck, FaTimes, FaInfo } from 'react-icons/fa';
import Pagination from '@/components/Pagination';
import Filter from './Filter';

const UserList = ({ title, requests }) => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [activeFilters, setActiveFilters] = useState([0, 1, 2, 3]); // All statuses active by default
    const [activeApprovalFilters, setActiveApprovalFilters] = useState([true, false, null]); // All approval statuses active by default
    const itemsPerPage = 10;

    // Status mapping
    const statusConfig = {
        0: { color: 'bg-red-500', label: 'وضعیت اول' },
        1: { color: 'bg-green-500', label: 'وضعیت دوم' },
        2: { color: 'bg-yellow-500', label: 'وضعیت سوم' },
        3: { color: 'bg-blue-500', label: 'وضعیت چهارم' }
    };

    // Approval mapping
    const approvalConfig = {
        true: { color: 'bg-green-500', label: 'تایید شده', icon: 'check' },
        false: { color: 'bg-red-500', label: 'رد شده', icon: 'times' },
        null: { color: 'bg-yellow-500', label: 'در انتظار', icon: 'clock' }
    };

    // Filter requests based on active filters
    const filteredRequests = useMemo(() => {
        return requests.filter(request => 
            activeFilters.includes(request.status) && 
            activeApprovalFilters.includes(request.approved)
        );
    }, [requests, activeFilters, activeApprovalFilters]);

    // Pagination logic
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRequests = filteredRequests.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleStatusChange = (requestId, newStatus) => {
        // Here you would update the status in your backend
        console.log(`Changing status of request ${requestId} to ${newStatus}`);
    };

    const handleApprovalChange = (requestId, newApproval) => {
        // Here you would update the approval status in your backend
        console.log(`Changing approval of request ${requestId} to ${newApproval}`);
    };

    const handleViewUser = (requestId) => {
        router.push(`/manager/users/${requestId}`);
    };

    const handleViewRegistration = (requestId) => {
        router.push(`/manager/registration-requests/${requestId}`);
    };

    // Statistics calculations
    const femaleCount = requests.filter(req => req.gender === 'female').length;
    const maleCount = requests.filter(req => req.gender === 'male').length;
    const approvedCount = requests.filter(req => req.approved === true).length;
    const minRequired = 50; // حداقل تعداد مورد نیاز
    const remainingToMin = Math.max(0, minRequired - approvedCount);

    return (
        <div className="p-2 md:p-6 md:pt-0">
            {/* Statistics Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-gradient-to-r from-pink-500 to-rose-500 text-white p-4 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">خادمیار زن</p>
                            <p className="text-2xl font-bold">{femaleCount}</p>
                        </div>
                        <div className="text-3xl opacity-80">👩</div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-4 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">خادمیار مرد</p>
                            <p className="text-2xl font-bold">{maleCount}</p>
                        </div>
                        <div className="text-3xl opacity-80">👨</div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-4 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">کل تایید شده</p>
                            <p className="text-2xl font-bold">{approvedCount}</p>
                        </div>
                        <div className="text-3xl opacity-80">✅</div>
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white p-4 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm opacity-90">مانده تا حداقل</p>
                            <p className="text-2xl font-bold">{remainingToMin}</p>
                        </div>
                        <div className="text-3xl opacity-80">⏳</div>
                    </div>
                </div>
            </div>

            <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4'>
                <h1 className="text-2xl font-bold">{title}</h1>
                <Filter 
                    activeFilters={activeFilters} 
                    setActiveFilters={setActiveFilters}
                    activeApprovalFilters={activeApprovalFilters}
                    setActiveApprovalFilters={setActiveApprovalFilters}
                />
            </div>
            
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto border border-gray-400/70 rounded-lg shadow">
                <table className="min-w-full rounded-lg overflow-hidden">
                    <thead>
                        <tr className="bg-dMain/70 text-center text-black">
                            <th className="p-4 border border-l-2 border-gray-400 w-16">#</th>
                            <th className="p-4 border border-x-2 border-gray-400">نام</th>
                            <th className="p-4 border border-x-2 border-gray-400">نام خانوادگی</th>
                            <th className="p-4 border border-x-2 border-gray-400">شماره تماس</th>
                            <th className="p-4 border border-x-2 border-gray-400">سوء پیشینه</th>
                            <th className="p-4 border border-x-2 border-gray-400">وضعیت</th>
                            <th className="p-4 border border-x-2 border-gray-400">تایید/رد</th>
                            <th className="p-4 border border-r-2 border-gray-400/70 w-32">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRequests.map((request, index) => (
                            <tr key={startIndex + index} className="hover:bg-gray-50">
                                <td className="p-4 border border-l-2 border-gray-400 text-center w-16">
                                    {startIndex + index + 1}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-right break-words max-w-xs">
                                    {request.firstName}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-right break-words max-w-xs">
                                    {request.lastName}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-right">
                                    {request.phone}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-center">
                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                        request.criminalRecord === 'ندارد' 
                                            ? 'bg-green-100 text-green-800' 
                                            : 'bg-red-100 text-red-800'
                                    }`}>
                                        {request.criminalRecord}
                                    </span>
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-center">
                                    <div className={`w-6 h-6 ${statusConfig[request.status].color} rounded-full mx-auto`} 
                                         title={statusConfig[request.status].label} />
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-center">
                                    <div className="flex items-center justify-center gap-2">
                                        <div className={`w-6 h-6 ${approvalConfig[request.approved].color} rounded-full`} 
                                             title={approvalConfig[request.approved].label} />
                                        {request.approved === false && (
                                            <button 
                                                onClick={() => handleApprovalChange(startIndex + index + 1, true)}
                                                className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                                                title="تایید کردن"
                                            >
                                                <FaCheck size={14} />
                                            </button>
                                        )}
                                        {request.approved === true && (
                                            <button 
                                                onClick={() => handleApprovalChange(startIndex + index + 1, false)}
                                                className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                title="رد کردن"
                                            >
                                                <FaTimes size={14} />
                                            </button>
                                        )}
                                        {request.approved === null && (
                                            <>
                                                <button 
                                                    onClick={() => handleApprovalChange(startIndex + index + 1, true)}
                                                    className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                                                    title="تایید کردن"
                                                >
                                                    <FaCheck size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => handleApprovalChange(startIndex + index + 1, false)}
                                                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                    title="رد کردن"
                                                >
                                                    <FaTimes size={14} />
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 border border-r-2 border-gray-400/70 text-center w-32">
                                    <div className="flex justify-center items-center gap-2">
                                        <button 
                                            onClick={() => handleViewUser(startIndex + index + 1)}
                                            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                            title="اطلاعات کاربر"
                                        >
                                            <FaInfo size={14} />
                                        </button>
                                        <button 
                                            onClick={() => handleViewRegistration(startIndex + index + 1)}
                                            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                            title="مشاهده جزئیات ثبت‌نام"
                                        >
                                            <FaEye size={14} />
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
                {currentRequests.map((request, index) => (
                    <div key={startIndex + index} className="border border-gray-400/70 rounded-lg p-4 bg-white shadow">
                        <div className="flex justify-between items-start mb-3">
                            <div>
                                <h3 className="font-bold text-lg">{request.firstName} {request.lastName}</h3>
                                <p className="text-sm text-gray-600">#{startIndex + index + 1}</p>
                            </div>
                            <div className="flex gap-2 items-center">
                                {/* Approval Indicator */}
                                <div className={`w-6 h-6 ${approvalConfig[request.approved].color} rounded-full`} 
                                     title={approvalConfig[request.approved].label} />
                                
                                {/* Approval Actions */}
                                {request.approved === false && (
                                    <button 
                                        onClick={() => handleApprovalChange(startIndex + index + 1, true)}
                                        className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                                        title="تایید کردن"
                                    >
                                        <FaCheck size={14} />
                                    </button>
                                )}
                                {request.approved === true && (
                                    <button 
                                        onClick={() => handleApprovalChange(startIndex + index + 1, false)}
                                        className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                                        title="رد کردن"
                                    >
                                        <FaTimes size={14} />
                                    </button>
                                )}
                                {request.approved === null && (
                                    <>
                                        <button 
                                            onClick={() => handleApprovalChange(startIndex + index + 1, true)}
                                            className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                                            title="تایید کردن"
                                        >
                                            <FaCheck size={14} />
                                        </button>
                                        <button 
                                            onClick={() => handleApprovalChange(startIndex + index + 1, false)}
                                            className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                                            title="رد کردن"
                                        >
                                            <FaTimes size={14} />
                                        </button>
                                    </>
                                )}
                                
                                {/* View Actions */}
                                <button 
                                    onClick={() => handleViewUser(startIndex + index + 1)}
                                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                    title="اطلاعات کاربر"
                                >
                                    <FaInfo size={14} />
                                </button>
                                
                                <button 
                                    onClick={() => handleViewRegistration(startIndex + index + 1)}
                                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                    title="مشاهده جزئیات"
                                >
                                    <FaEye size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-gray-600">شماره تماس:</span>
                                <span className="mr-2">{request.phone}</span>
                            </div>
                            <div className="flex items-center">
                                <span className="text-gray-600">وضعیت:</span>
                                <div className={`w-4 h-4 ${statusConfig[request.status].color} rounded-full mr-2`} 
                                     title={statusConfig[request.status].label} />
                                <span className="mr-1">{statusConfig[request.status].label}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">تایید/رد:</span>
                                <span className="mr-2">{approvalConfig[request.approved].label}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-gray-600">سوء پیشینه:</span>
                                <span className={`mr-2 px-2 py-1 rounded-full text-xs ${
                                    request.criminalRecord === 'ندارد' 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-red-100 text-red-800'
                                }`}>
                                    {request.criminalRecord}
                                </span>
                            </div>
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
        </div>
    );
};

export default UserList;
