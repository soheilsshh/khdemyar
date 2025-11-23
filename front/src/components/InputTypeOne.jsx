"use client"
import React, { useState } from 'react';
import { IoEye, IoEyeOff } from 'react-icons/io5';

function InputTypeOne({
  className = "",
  pClassName = "",
  classNameTitle = "",
  dir = "rtl",
  placeholder = "",
  title = "",
  required = false,
  value,
  onChange,
  autoComplete = "off",
  name,
  type = "text",
  disabled = false,
  readOnly = false,
  pr = false
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className={`w-full flex flex-col relative ${pClassName}`}>
      {title && (
        <div className="flex justify-start items-center gap-2 mb-1">
          <label htmlFor={name} className={` ${classNameTitle ? classNameTitle : "text-sm font-iranianSansDemiBold"} `}>
            {title}
          </label>
          {required && (
            <span className="text-red-600 text-lg leading-none translate-y-px font-bold">*</span>
          )}
        </div>
      )}
      <input
        id={name}
        name={name}
        dir={dir}
        placeholder={placeholder}
        required={required}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        disabled={disabled}
        readOnly={readOnly}
        type={isPassword && showPassword ? "text" : type}
        className={`outline-none rounded-lg shadow-md h-11 px-2
           bg-gray-100 w-full ${className} ${disabled ? "cursor-not-allowed opacity-70" : ""}
           ${pr ? "placeholder-rtl" : ""}`}
      />
      {isPassword && (
        <div
          onClick={() => setShowPassword(prev => !prev)}
          className="absolute right-3 top-[47px] cursor-pointer text-gray-600"
        >
          {showPassword ? <IoEyeOff size={20} /> : <IoEye size={20} />}
        </div>
      )}
    </div>
  );
}

export default InputTypeOne;
