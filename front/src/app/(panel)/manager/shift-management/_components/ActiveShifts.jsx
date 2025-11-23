"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaEye, FaCheck, FaTimes } from 'react-icons/fa';
import Pagination from '@/components/Pagination';

const ActiveShifts = ({ title = "", requests }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Pagination logic
  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRequests = requests.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewDetails = (request, index) => {
    router.push(`/manager/shift-management/${startIndex + index + 1}`);
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
    </div>
  );
};

export default ActiveShifts;
