"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaCheck, FaTimes, FaStar, FaUsers } from 'react-icons/fa';
import Pagination from '@/components/Pagination';
import ShiftDetailsModal from './ShiftDetailsModal';

const AllShiftsTable = ({ 
  title = "", 
  requests, 
  activeFilters = [], 
  activeRatingFilters = [], 
  selectedDate, 
  activeDate 
}) => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedShift, setSelectedShift] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const itemsPerPage = 10;

    // Filter logic
    const filteredRequests = React.useMemo(() => {
        let filtered = requests;

        // Filter by status
        if (activeFilters.length > 0) {
            filtered = filtered.filter(request => activeFilters.includes(request.status));
        }

        // Filter by completion and rating status
        if (activeRatingFilters.length > 0) {
            filtered = filtered.filter(request => {
                if (activeRatingFilters.includes('completed-rated')) {
                    return request.isCompleted && request.isRated;
                }
                if (activeRatingFilters.includes('completed-unrated')) {
                    return request.isCompleted && !request.isRated;
                }
                if (activeRatingFilters.includes('in-progress')) {
                    return !request.isCompleted;
                }
                return false;
            });
        }

        // Filter by date if active
        if (activeDate && selectedDate) {
            const targetDate = `${selectedDate.year}/${selectedDate.month}/${selectedDate.day}`;
            filtered = filtered.filter(request => request.date === targetDate);
        }

        return filtered;
    }, [requests, activeFilters, activeRatingFilters, selectedDate, activeDate]);

    // Pagination logic
    const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentRequests = filteredRequests.slice(startIndex, endIndex);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleViewDetails = (request, index) => {
        // If shift is not completed, navigate to edit page
        if (!request.isCompleted) {
            router.push(`/manager/shift-management/${request.id}`);
        } else {
            // If shift is completed, show details modal
            setSelectedShift(request);
            setShowDetailsModal(true);
        }
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
                            <th className="p-4 border border-x-2 border-gray-400">تاریخ</th>
                            <th className="p-4 border border-x-2 border-gray-400">کل</th>
                            <th className="p-4 border border-x-2 border-gray-400">مرد</th>
                            <th className="p-4 border border-x-2 border-gray-400">زن</th>
                            <th className="p-4 border border-x-2 border-gray-400">از</th>
                            <th className="p-4 border border-x-2 border-gray-400">تا</th>
                            <th className="p-4 border border-x-2 border-gray-400">مناسب</th>
                            <th className="p-4 border border-x-2 border-gray-400">وضعیت</th>
                            <th className="p-4 border border-r-2 border-gray-400/70 w-32">عملیات</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRequests.map((request, index) => (
                            <tr key={startIndex + index} className="hover:bg-gray-50">
                                <td className="p-4 border border-l-2 border-gray-400 text-center w-16">
                                    {startIndex + index + 1}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-right">
                                    {request.date}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-center">
                                    {request.all}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-center">
                                    {request.man}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-center">
                                    {request.woman}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-center">
                                    {request.from}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-center">
                                    {request.to}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-right break-words max-w-xs">
                                    {request.suitable}
                                </td>
                                <td className="p-4 border border-x-2 border-gray-400 text-center">
                                    <div className="flex flex-col items-center gap-1">
                                        {/* Completion Status */}
                                        <div className="flex items-center gap-1">
                                            {request.isCompleted ? (
                                                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                                    تمام شده
                                                </span>
                                            ) : (
                                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                                    در حال انجام
                                                </span>
                                            )}
                                        </div>
                                        
                                        {/* Rating Status */}
                                        {request.isCompleted && (
                                            <div className="flex items-center gap-1">
                                                {request.isRated ? (
                                                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full flex items-center gap-1">
                                                        <FaStar size={10} />
                                                        نمره‌دهی شده
                                                    </span>
                                                ) : (
                                                    <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                                        نیاز به نمره‌دهی
                                                    </span>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 border border-r-2 border-gray-400/70 text-center w-32">
                                    <div className="flex justify-center items-center gap-2">
                                        {/* Status indicators */}
                                        {request.status === 0 && (
                                            <div className="w-3 h-3 bg-red-500 rounded-full" title="غیرفعال" />
                                        )}
                                        {request.status === 1 && (
                                            <div className="w-3 h-3 bg-green-500 rounded-full" title="فعال" />
                                        )}
                                        {request.status === 2 && (
                                            <div className="w-3 h-3 bg-yellow-500 rounded-full" title="در انتظار" />
                                        )}
                                        
                                        {/* View details button */}
                                        <button
                                            onClick={() => handleViewDetails(request, index)}
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
                                <h3 className="font-bold text-lg">شیفت {request.date}</h3>
                                <p className="text-sm text-gray-600">#{startIndex + index + 1}</p>
                                
                                {/* Status badges for mobile */}
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {request.isCompleted ? (
                                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                            تمام شده
                                        </span>
                                    ) : (
                                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                            در حال انجام
                                        </span>
                                    )}
                                    
                                    {request.isCompleted && (
                                        request.isRated ? (
                                            <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full flex items-center gap-1">
                                                <FaStar size={8} />
                                                نمره‌دهی شده
                                            </span>
                                        ) : (
                                            <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                                                نیاز به نمره‌دهی
                                            </span>
                                        )
                                    )}
                                </div>
                            </div>
                            <div className="flex gap-2 items-center">
                                {/* Status indicators */}
                                {request.status === 0 && (
                                    <div className="w-3 h-3 bg-red-500 rounded-full" title="غیرفعال" />
                                )}
                                {request.status === 1 && (
                                    <div className="w-3 h-3 bg-green-500 rounded-full" title="فعال" />
                                )}
                                {request.status === 2 && (
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full" title="در انتظار" />
                                )}
                                
                                <button
                                    onClick={() => handleViewDetails(request, index)}
                                    className="p-2 rounded-full bg-blue-500 text-white hover:bg-blue-600 transition-colors"
                                    title="مشاهده جزئیات"
                                >
                                    <FaEye size={16} />
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                            <div>
                                <span className="text-gray-600">کل:</span>
                                <span className="mr-2">{request.all}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">مرد:</span>
                                <span className="mr-2">{request.man}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">زن:</span>
                                <span className="mr-2">{request.woman}</span>
                            </div>
                            <div>
                                <span className="text-gray-600">زمان:</span>
                                <span className="mr-2">{request.from} - {request.to}</span>
                            </div>
                            <div className="col-span-2">
                                <span className="text-gray-600">مناسب:</span>
                                <span className="mr-2">{request.suitable}</span>
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

            {/* Shift Details Modal */}
            {showDetailsModal && selectedShift && (
                <ShiftDetailsModal
                    shift={selectedShift}
                    onClose={() => {
                        setShowDetailsModal(false);
                        setSelectedShift(null);
                    }}
                />
            )}
        </div>
    );
};

export default AllShiftsTable;
