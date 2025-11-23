'use client';
import React, { useState, useRef, useEffect } from 'react';

const TimePicker24 = ({ 
  value = "18:00", 
  onChange, 
  placeholder = "انتخاب ساعت",
  className = "",
  disabled = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedHour, setSelectedHour] = useState("18");
  const [selectedMinute, setSelectedMinute] = useState("00");
  const dropdownRef = useRef(null);

  // Generate hours (00-23)
  const hours = Array.from({ length: 24 }, (_, i) => 
    i.toString().padStart(2, '0')
  );

  // Generate minutes (00-59)
  const minutes = Array.from({ length: 60 }, (_, i) => 
    i.toString().padStart(2, '0')
  );

  // Initialize from value prop
  useEffect(() => {
    if (value) {
      const [hour, minute] = value.split(':');
      setSelectedHour(hour || "18");
      setSelectedMinute(minute || "00");
    }
  }, [value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTimeChange = (hour, minute) => {
    const newTime = `${hour}:${minute}`;
    setSelectedHour(hour);
    setSelectedMinute(minute);
    if (onChange) {
      onChange(newTime);
    }
  };

  const handleHourSelect = (hour) => {
    handleTimeChange(hour, selectedMinute);
  };

  const handleMinuteSelect = (minute) => {
    handleTimeChange(selectedHour, minute);
  };

  const displayValue = `${selectedHour}:${selectedMinute}`;

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        type="text"
        value={displayValue}
        placeholder={placeholder}
        readOnly
        disabled={disabled}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-white cursor-pointer ${
          disabled ? 'opacity-50 cursor-not-allowed' : ''
        } ${className}`}
      />
      
      {/* Clock Icon */}
      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
        🕐
      </div>

      {/* Dropdown Arrow */}
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
        <svg 
          className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Time Picker Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-64 overflow-hidden">
          <div className="flex">
            {/* Hours Column */}
            <div className="flex-1 border-r border-gray-200">
              <div className="p-2 bg-gray-50 text-center text-sm font-medium text-gray-700 border-b">
                ساعت
              </div>
              <div className="max-h-48 overflow-y-auto">
                {hours.map((hour) => (
                  <button
                    key={hour}
                    onClick={() => handleHourSelect(hour)}
                    className={`w-full px-3 py-2 text-center hover:bg-blue-50 transition-colors ${
                      selectedHour === hour 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </div>

            {/* Minutes Column */}
            <div className="flex-1">
              <div className="p-2 bg-gray-50 text-center text-sm font-medium text-gray-700 border-b">
                دقیقه
              </div>
              <div className="max-h-48 overflow-y-auto">
                {minutes.map((minute) => (
                  <button
                    key={minute}
                    onClick={() => handleMinuteSelect(minute)}
                    className={`w-full px-3 py-2 text-center hover:bg-blue-50 transition-colors ${
                      selectedMinute === minute 
                        ? 'bg-blue-500 text-white' 
                        : 'text-gray-700 hover:text-blue-600'
                    }`}
                  >
                    {minute}
                  </button>
                ))}
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default TimePicker24;
