"use client";
import React, { useState } from 'react';
import { FaCalendarAlt, FaClock, FaUsers, FaMale, FaFemale, FaEye, FaCheckCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';
import ShiftDetailsModal from './ShiftDetailsModal';
import Pagination from './Pagination';
import WaitingShiftCard from './WaitingShiftCard';
import CompletedShiftCard from './CompletedShiftCard';

const Shifts = () => {
  const [filter, setFilter] = useState('waiting');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedShift, setSelectedShift] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [requestStatuses, setRequestStatuses] = useState({});
  const itemsPerPage = 6;

  // Sample shifts data
  const shiftsData = {
    waiting: [
      {
        id: 1,
        occasion: 'تولد پیامبر اسلام',
        date: '1403/10/15',
        from: '16:00',
        to: '20:00',
        registeredMen: 8,
        registeredWomen: 12,
        minMen: 10,
        maxMen: 15,
        minWomen: 15,
        maxWomen: 20,
        description: 'مراسم تولد پیامبر اسلام در مسجد مرکزی',
        totalRegistered: 20,
        totalNeeded: 35,
        remaining: 15,
        requestStatus: 'none'
      },
      {
        id: 2,
        occasion: 'وفات امام علی',
        date: '1403/10/20',
        from: '08:00',
        to: '12:00',
        registeredMen: 5,
        registeredWomen: 8,
        minMen: 8,
        maxMen: 12,
        minWomen: 12,
        maxWomen: 18,
        description: 'مراسم وفات امام علی در حسینیه',
        totalRegistered: 13,
        totalNeeded: 30,
        remaining: 17,
        requestStatus: 'pending'
      },
      {
        id: 3,
        occasion: 'تولد امام زمان',
        date: '1403/10/25',
        from: '20:00',
        to: '24:00',
        registeredMen: 12,
        registeredWomen: 18,
        minMen: 15,
        maxMen: 20,
        minWomen: 20,
        maxWomen: 25,
        description: 'مراسم تولد امام زمان در مسجد جامع',
        totalRegistered: 30,
        totalNeeded: 45,
        remaining: 15,
        requestStatus: 'approved'
      }
    ],
    completed: [
      {
        id: 4,
        occasion: 'تولد امام رضا',
        date: '1403/10/10',
        from: '16:00',
        to: '20:00',
        participated: true,
        correct: true
      },
      {
        id: 5,
        occasion: 'وفات امام حسین',
        date: '1403/10/05',
        from: '08:00',
        to: '12:00',
        participated: false,
        correct: false
      },
      {
        id: 6,
        occasion: 'تولد امام جواد',
        date: '1403/09/28',
        from: '20:00',
        to: '24:00',
        participated: true,
        correct: true
      }
    ]
  };

  const getEffectiveRequestStatus = (shift) => (requestStatuses[shift.id]) || shift.requestStatus || 'none';

  const totalRequestShifts = (shiftsData.waiting || []).filter((s) => getEffectiveRequestStatus(s) !== 'none').length;

  const filteredShifts = (() => {
    if (filter === 'requests') {
      return (shiftsData.waiting || []).filter((s) => getEffectiveRequestStatus(s) !== 'none');
    }
    return shiftsData[filter] || [];
  })();
  const totalPages = Math.ceil(filteredShifts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedShifts = filteredShifts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const handleViewDetails = (shift) => {
    setSelectedShift(shift);
    setShowDetailsModal(true);
  };

  const handleRequest = (shiftId) => {
    setRequestStatuses((prev) => ({ ...prev, [shiftId]: 'pending' }));
    // در اینجا می‌توانید فراخوانی API قرار دهید
  };

  

  const totalWaitingShifts = shiftsData.waiting.length;
  const totalCompletedShifts = shiftsData.completed.length;
  const totalSystemShifts = totalWaitingShifts + totalCompletedShifts;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-4">
          <FaCalendarAlt className="text-blue-600" />
          شیفت‌ها
        </h2>
        
        {/* System Statistics */}
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-4 rounded-xl mb-6">
          <div className="text-center">
            <p className="text-purple-100 text-sm">آمار کلی سامانه</p>
            <p className="text-2xl font-bold">{totalSystemShifts} شیفت تا کنون</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('waiting')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              filter === 'waiting'
                ? 'bg-yellow-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            در انتظار تکمیل ({totalWaitingShifts})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              filter === 'completed'
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            تکمیل شده ({totalCompletedShifts})
          </button>
          <button
            onClick={() => setFilter('requests')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              filter === 'requests'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            درخواست‌ها ({totalRequestShifts})
          </button>
        </div>
      </div>

      {/* Shifts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paginatedShifts.length > 0 ? (
          paginatedShifts.map((shift) => (
            filter === 'completed' ? (
              <CompletedShiftCard key={shift.id} shift={shift} />
            ) : (
              <WaitingShiftCard
                key={shift.id}
                shift={shift}
                requestStatus={(requestStatuses[shift.id]) || shift.requestStatus || 'none'}
                onViewDetails={handleViewDetails}
                onRequest={handleRequest}
              />
            )
          ))
        ) : (
          <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaCalendarAlt className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">هیچ شیفتی یافت نشد</h3>
            <p className="text-gray-500">
              {filter === 'waiting' 
                ? 'هیچ شیفت در انتظار تکمیل وجود ندارد'
                : filter === 'completed' ? 'هیچ شیفت تکمیل شده‌ای یافت نشد' : 'هیچ درخواستی یافت نشد'
              }
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        itemsPerPage={itemsPerPage}
        totalItems={filteredShifts.length}
      />

      {/* Shift Details Modal */}
      {showDetailsModal && selectedShift && (
        <ShiftDetailsModal
          shift={selectedShift}
          requestStatus={(requestStatuses[selectedShift.id]) || selectedShift.requestStatus || 'none'}
          onRequest={() => handleRequest(selectedShift.id)}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
};

export default Shifts;
