"use client";
import React from "react";

function TextAreaTypeOne({
    className = "",
    pClassName = "",
    classNameTitle = "",
    placeholder = "",
    title = "",
    required = false,
    value,
    onChange,
    name,
    resize = false,
}) {
    return (
        <div className={`w-full flex flex-col relative ${pClassName}`}>
            {title && (
                <div className="flex justify-start items-center gap-2 mb-1">
                    <label
                        htmlFor={name}
                        className={`${classNameTitle ? classNameTitle : "text-sm font-iranianSansDemiBold"}`}
                    >
                        {title}
                    </label>
                    {required && (
                        <span className="text-red-600 text-lg leading-none translate-y-px font-bold">*</span>
                    )}
                </div>
            )}
            <textarea
                id={name}
                name={name}
                placeholder={placeholder}
                required={required}
                value={value}
                onChange={onChange}
                className={`w-full  shadow-md bg-gray-100 rounded-lg outline-none p-3 ${resize ? "resize-y" : "resize-none"
                    } ${className}`}
            />
        </div>
    );
}

export default TextAreaTypeOne;
