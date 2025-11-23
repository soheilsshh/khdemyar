'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaCheck, FaTimes, FaInfo } from 'react-icons/fa';
import Pagination from '@/components/Pagination';

const RegisterRequests = ({ title, requests, itemsPerPage = 10 }) => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);

    // Calculate pagination
    const totalPages = Math.ceil(requests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRequests = requests.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleAction = (action, requestId) => {
        console.log(`${action} action for request ${requestId}`);
        // Handle approve/reject actions here
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
                            <th className="p-4 border border-x-2 border-gray-400">کد ملی</th>
                            <th className="p-4 border border-x-2 border-gray-400">شماره تماس</th>
                            <th className="p-4 border border-x-2 border-gray-400">سوء پیشینه</th>
                            <th className="p-4 border border-x-2 border-gray-400">تحصیلات</th>
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
                                    {request.nationalCode}
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
                                <td className="p-4 border border-x-2 border-gray-400 text-right">
                                    {request.education}
                                </td>
                                <td className="p-4 border border-r-2 border-gray-400/70 text-center w-32">
                                    <div className="flex justify-between items-center gap-2">
                                        {request.status === 0 && (
                                            <div className="w-6.5 h-6.5 bg-red-500 rounded-full" title="رد شده" />
                                        )}
                                        {request.status === 1 && (
                                            <>
                                                <div className="w-6.5 h-6.5 bg-green-500 rounded-full" title="تایید شده" />
                                                <button 
                                                    onClick={() => router.push(`/manager/users/${startIndex + index + 1}`)}
                                                    className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                                                    title="اطلاعات بیشتر"
                                                >
                                                    <FaInfo size={14} />
                                                </button>
                                            </>
                                        )}
                                        {request.status === 2 && (
                                            <>
                                                <button 
                                                    onClick={() => handleAction('reject', startIndex + index + 1)}
                                                    className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                                                    title="رد کردن"
                                                >
                                                    <FaTimes size={14} />
                                                </button>
                                                <button 
                                                    onClick={() => handleAction('approve', startIndex + index + 1)}
                                                    className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                                                    title="تایید کردن"
                                                >
                                                    <FaCheck size={14} />
                                                </button>
                                            </>
                                        )}
                                        <button 
                                            onClick={() => router.push(`/manager/registration-requests/${startIndex + index + 1}`)}
                                            className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                            title="مشاهده جزئیات"
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
                            <div className="flex gap-2 items-center justify-center">
                                {request.status === 0 && (
                                    <div className="w-6.5 h-6.5 bg-red-500 rounded-full " title="رد شده" />
                                )}
                                {request.status === 1 && (
                                    <>
                                        <div className="w-6.5 h-6.5 bg-green-500 rounded-full" title="تایید شده" />
                                        <button 
                                            onClick={() => router.push(`/manager/users/${startIndex + index + 1}`)}
                                            className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                                            title="اطلاعات بیشتر"
                                        >
                                            <FaInfo size={14} />
                                        </button>
                                    </>
                                )}
                                {request.status === 2 && (
                                    <>
                                        <button 
                                            onClick={() => handleAction('reject', startIndex + index + 1)}
                                            className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-colors"
                                            title="رد کردن"
                                        >
                                            <FaTimes size={14} />
                                        </button>
                                        <button 
                                            onClick={() => handleAction('approve', startIndex + index + 1)}
                                            className="p-2 rounded-full bg-green-500 text-white hover:bg-green-600 transition-colors"
                                            title="تایید کردن"
                                        >
                                            <FaCheck size={14} />
                                        </button>
                                    </>
                                )}
                                <button 
                                    onClick={() => router.push(`/manager/registration-requests/${startIndex + index + 1}`)}
                                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                    title="مشاهده جزئیات"
                                >
                                    <FaEye size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-gray-600">کد ملی:</span>
                                <span className="mr-2">{request.nationalCode}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">شماره تماس:</span>
                                <span className="mr-2">{request.phone}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">تحصیلات:</span>
                                <span className="mr-2">{request.education}</span>
                            </div>
                            <div>
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

export default RegisterRequests;
