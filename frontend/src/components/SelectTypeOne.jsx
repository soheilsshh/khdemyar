"use client";
import React, { useState, useRef, useEffect } from "react";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";

function SelectTypeOne({
  className = "",
  pClassName = "",
  classNameTitle = "",
  sClassName="",
  dir = "rtl",
  placeholder = "یک گزینه انتخاب کنید",
  title = "",
  required = false,
  value,
  onChange,
  name,
  disabled = false,
  pr = false,
  options = [],
}) {
  const [isOpen, setIsOpen] = useState(false);
  const selectRef = useRef();

  const selectedItem = options.find((item) => item.value === value);
  
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`w-full flex flex-col relative ${pClassName}`} ref={selectRef}>
      {title && (
        <div className="flex justify-start items-center gap-2 mb-1">
          <label
            htmlFor={name}
            className={`${
              classNameTitle ? classNameTitle : "text-sm font-iranianSansDemiBold"
            }`}
          >
            {title}
          </label>
          {required && (
            <span className="text-red-600 text-lg leading-none translate-y-px font-bold">*</span>
          )}
        </div>
      )}

      <div
        dir={dir}
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`relative cursor-pointer outline-none rounded-lg shadow-md h-11 px-3 bg-gray-100 w-full flex items-center justify-between
        ${className} ${disabled ? "cursor-not-allowed opacity-70" : ""} ${pr ? "placeholder-rtl" : ""}`}
      >
        <span className={`truncate ${!value ? "text-gray-400" : ""}`}>
          {selectedItem?.text || placeholder}
        </span>
        <span className="text-gray-600">
          {isOpen ? <IoChevronUp size={18} /> : <IoChevronDown size={18} />}
        </span>

        {isOpen && (
          <div className={`absolute top-full mt-1 left-0 right-0 ${sClassName ? sClassName : "bg-white "} z-100 rounded-lg shadow-lg max-h-60 overflow-y-auto`}>
            {options.map((option) => (
              <div
                key={option.value}
                onClick={() => {
                  onChange({ target: { name, value: option } });
                  setIsOpen(false);
                }}
                className={`px-3 py-2 hover:bg-gray-100 text-sm cursor-pointer ${
                  option.value === value ? "bg-gray-200 font-bold" : ""
                }`}
              >
                {option.text}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SelectTypeOne;
