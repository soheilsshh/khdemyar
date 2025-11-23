"use client";
import Image from "next/image";
import React, { useRef } from "react";
import { IoImagesOutline } from "react-icons/io5";

function ImageUploader({
  cClassName = "",
  className = "",
  bClassName = "",
  value = null, // props برای preview خارجی
  onChange = () => { }, // props برای ارسال فایل به بیرون
}) {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      onChange(file); // ارسال فایل به والد
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const getImageSrc = (value) => {
    console.log("value : ", value)
    if (!value) {
      console.log("step undefined ")
      return undefined;
    }
    if (typeof value === "string") {
      console.log("step string ")
      return value;
    }
    if (value instanceof File) {
      console.log("step file ")
      return URL.createObjectURL(value);
    }
    return undefined;
  };


  return (
    <div className={cClassName}>
      <div
        className={`relative ${className ? className : "h-40 w-50"
          } rounded-t-2xl print:rounded-xl shadow-2xl bg-green-50/70 flex justify-center items-center overflow-hidden`}
      >
        {value ? (
          <Image
            src={getImageSrc(value)}
            alt="uploaded"
            fill
            className="object-cover"
            sizes="100%"
          />
        ) : (
          <IoImagesOutline size={26} className="text-green-800 z-10" />
        )}
      </div>
      <button
        type="button"
        onClick={handleUploadClick}
        className={`${bClassName ? bClassName : "h-11 w-50"} print:hidden bg-green-600  text-white rounded-b-xl shadow-lg cursor-pointer`}
      >
        آپلود تصویر
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
}

export default ImageUploader;
