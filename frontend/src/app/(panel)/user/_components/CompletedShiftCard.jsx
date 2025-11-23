"use client";
import React from 'react';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaClock, FaCheckCircle } from 'react-icons/fa';

const CompletedShiftCard = ({ shift }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300"
  >
    <div className="flex justify-between items-start mb-4">
      <div>
        <h3 className="text-xl font-bold text-gray-800">{shift.occasion}</h3>
      </div>
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
        shift.participated 
          ? shift.correct 
            ? 'bg-green-100 text-green-800' 
            : 'bg-red-100 text-red-800'
          : 'bg-gray-100 text-gray-800'
      }`}>
        {shift.participated 
          ? shift.correct 
            ? 'درست انجام شده' 
            : 'اشتباه انجام شده'
          : 'شرکت نکرده'
        }
      </span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

    {shift.participated && (
      <div className="mt-4 flex items-center gap-2">
        {shift.correct ? (
          <FaCheckCircle className="text-green-600" />
        ) : (
          <FaCheckCircle className="text-red-600" />
        )}
        <span className={`text-sm font-medium ${
          shift.correct ? 'text-green-600' : 'text-red-600'
        }`}>
          {shift.correct ? 'شیفت به درستی انجام شده' : 'شیفت اشتباه انجام شده'}
        </span>
      </div>
    )}
  </motion.div>
);

export default CompletedShiftCard;


