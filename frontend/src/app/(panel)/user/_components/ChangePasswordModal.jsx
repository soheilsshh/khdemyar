"use client";
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';

const PasswordField = ({ placeholder, value, onChange }) => {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input
        type={visible ? 'text' : 'password'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full p-4 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200"
      />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute inset-y-0 left-4 flex items-center text-gray-500 hover:text-gray-700"
        aria-label={visible ? 'مخفی کردن رمز' : 'نمایش رمز'}
      >
        {visible ? <FaEyeSlash /> : <FaEye />}
      </button>
    </div>
  );
};

const ChangePasswordModal = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50  flex items-center justify-center z-50 backdrop-blur-sm">
      <div className='absolute inset-0 bg-black/30 backdrop-blur-sm'></div>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white z-10 rounded-3xl p-8 w-full max-w-md mx-4 shadow-2xl"
      >
        <div className="flex items-center gap-3 justify-center mb-6">
          <FaLock className="text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-800">تغییر رمز ورود</h3>
        </div>

        <div className="space-y-4">
          <PasswordField
            placeholder="رمز فعلی"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <PasswordField
            placeholder="رمز جدید"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <PasswordField
            placeholder="تکرار رمز جدید"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <div className="flex gap-4 mt-8">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-4 rounded-xl font-semibold transition-all duration-200"
          >
            انصراف
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white py-4 rounded-xl font-semibold transition-all duration-200"
          >
            تغییر رمز
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ChangePasswordModal;


