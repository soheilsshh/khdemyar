'use client';
import React from 'react';

const DateInput = ({ label, value, onChange, placeholder, color = "blue" }) => {
    const colorClasses = {
        blue: "border-blue-200 focus:border-blue-400 focus:ring-blue-100",
        green: "border-green-200 focus:border-green-400 focus:ring-green-100",
        purple: "border-purple-200 focus:border-purple-400 focus:ring-purple-100"
    };

    const handleChange = (e) => {
        const inputValue = e.target.value;
        // Format: MM/DD
        if (inputValue.length <= 5) {
            let formatted = inputValue.replace(/\D/g, ''); // Remove non-digits
            if (formatted.length >= 2) {
                formatted = formatted.substring(0, 2) + '/' + formatted.substring(2, 4);
            }
            onChange(formatted);
        }
    };

    return (
        <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
                {label}
            </label>
            <div className="relative">
                <input
                    type="text"
                    value={value}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className={`w-full px-4 text-black py-3 border-2 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm text-center font-medium ${colorClasses[color]} focus:ring-4`}
                    maxLength={5}
                />
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm pointer-events-none">
                    MM/DD
                </div>
            </div>
        </div>
    );
};

export default DateInput;
