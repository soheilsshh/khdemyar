"use client";
import React, { useState } from 'react';
import { FaHistory, FaCheck, FaTimes, FaCalendarAlt, FaClock } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Pagination from './Pagination';

const MyShifts = () => {
  const [filter, setFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Sample user's shifts data
  const myShifts = [
    {
      id: 1,
      date: '1403/10/15',
      from: '16:00',
      to: '20:00',
      occasion: 'تولد امام زمان',
      status: 'correct'
    },
    {
      id: 2,
      date: '1403/10/10',
      from: '08:00',
      to: '12:00',
      occasion: 'وفات پیامبر',
      status: 'correct'
    },
    {
      id: 3,
      date: '1403/10/05',
      from: '20:00',
      to: '24:00',
      occasion: 'تولد امام علی',
      status: 'incorrect'
    },
    {
      id: 4,
      date: '1403/10/01',
      from: '12:00',
      to: '16:00',
      occasion: 'وفات امام حسین',
      status: 'pending'
    },
    {
      id: 5,
      date: '1403/09/28',
      from: '08:00',
      to: '12:00',
      occasion: 'تولد امام رضا',
      status: 'correct'
    },
    {
      id: 6,
      date: '1403/09/25',
      from: '16:00',
      to: '20:00',
      occasion: 'وفات امام حسن',
      status: 'incorrect'
    },
    {
      id: 7,
      date: '1403/09/22',
      from: '20:00',
      to: '24:00',
      occasion: 'تولد امام جواد',
      status: 'correct'
    },
    {
      id: 8,
      date: '1403/09/20',
      from: '12:00',
      to: '16:00',
      occasion: 'وفات امام کاظم',
      status: 'pending'
    },
    {
      id: 9,
      date: '1403/09/18',
      from: '08:00',
      to: '12:00',
      occasion: 'تولد امام هادی',
      status: 'correct'
    },
    {
      id: 10,
      date: '1403/09/15',
      from: '16:00',
      to: '20:00',
      occasion: 'وفات امام صادق',
      status: 'incorrect'
    },
    {
      id: 11,
      date: '1403/09/12',
      from: '20:00',
      to: '24:00',
      occasion: 'تولد امام عسکری',
      status: 'correct'
    },
    {
      id: 12,
      date: '1403/09/10',
      from: '12:00',
      to: '16:00',
      occasion: 'وفات امام باقر',
      status: 'pending'
    }
  ];

  const filteredShifts = myShifts.filter(shift => {
    if (filter === 'all') return true;
    return shift.status === filter;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredShifts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedShifts = filteredShifts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset page when filter changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filter]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'correct': return 'bg-green-500';
      case 'incorrect': return 'bg-red-500';
      case 'pending': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'correct': return 'درست انجام شده';
      case 'incorrect': return 'اشتباه انجام شده';
      case 'pending': return 'در انتظار ارزیابی';
      default: return 'نامشخص';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'correct': return <FaCheck />;
      case 'incorrect': return <FaTimes />;
      case 'pending': return <FaClock />;
      default: return <FaHistory />;
    }
  };

  const ShiftCard = ({ shift }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 h-full flex flex-col"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-800">شیفت انجام شده</h3>
          <p className="text-gray-600">{shift.occasion}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-white text-sm font-medium flex items-center gap-2 ${getStatusColor(shift.status)}`}>
          {getStatusIcon(shift.status)}
          {getStatusText(shift.status)}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 flex-1">
        <div className="flex items-center gap-3">
          <FaCalendarAlt className="text-blue-600" />
          <div>
            <p className="text-sm text-gray-600">تاریخ</p>
            <p className="font-semibold text-gray-800">{shift.date}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <FaClock className="text-green-600" />
          <div>
            <p className="text-sm text-gray-600">زمان</p>
            <p className="font-semibold text-gray-800">{shift.from} - {shift.to}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const stats = {
    total: myShifts.length,
    correct: myShifts.filter(s => s.status === 'correct').length,
    incorrect: myShifts.filter(s => s.status === 'incorrect').length,
    pending: myShifts.filter(s => s.status === 'pending').length
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-3 mb-4">
          <FaHistory className="text-green-600" />
          شیفت‌های انجام شده
        </h2>
        
        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-4 rounded-xl">
            <div className="text-center">
              <p className="text-blue-100 text-sm">کل شیفت‌ها</p>
              <p className="text-2xl font-bold">{stats.total}</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-4 rounded-xl">
            <div className="text-center">
              <p className="text-green-100 text-sm">درست انجام شده</p>
              <p className="text-2xl font-bold">{stats.correct}</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-red-500 to-red-600 text-white p-4 rounded-xl">
            <div className="text-center">
              <p className="text-red-100 text-sm">اشتباه انجام شده</p>
              <p className="text-2xl font-bold">{stats.incorrect}</p>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-4 rounded-xl">
            <div className="text-center">
              <p className="text-yellow-100 text-sm">در انتظار ارزیابی</p>
              <p className="text-2xl font-bold">{stats.pending}</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              filter === 'all'
                ? 'bg-blue-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            همه ({stats.total})
          </button>
          <button
            onClick={() => setFilter('correct')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              filter === 'correct'
                ? 'bg-green-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            درست ({stats.correct})
          </button>
          <button
            onClick={() => setFilter('incorrect')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              filter === 'incorrect'
                ? 'bg-red-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            اشتباه ({stats.incorrect})
          </button>
          <button
            onClick={() => setFilter('pending')}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              filter === 'pending'
                ? 'bg-yellow-500 text-white shadow-lg'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            در انتظار ({stats.pending})
          </button>
        </div>
      </div>

      {/* Shifts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {paginatedShifts.length > 0 ? (
          paginatedShifts.map((shift) => (
            <ShiftCard key={shift.id} shift={shift} />
          ))
        ) : (
          <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center">
            <FaHistory className="text-6xl text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">هیچ شیفتی یافت نشد</h3>
            <p className="text-gray-500">
              {filter === 'all' 
                ? 'هنوز هیچ شیفتی انجام نداده‌اید'
                : `هیچ شیفت ${getStatusText(filter)} یافت نشد`
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
    </div>
  );
};

export default MyShifts;
