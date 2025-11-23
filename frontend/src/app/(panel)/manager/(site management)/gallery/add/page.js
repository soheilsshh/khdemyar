"use client";
import InputTypeOne from "@/components/InputTypeOne";
import { React, useState } from "react";
import AddImagesDynamic from "@/components/AddImageUploader";
import { useSelector, useDispatch } from "react-redux";
import {
  resetGallery,
  setTitle,
  setDate,
  setImage,
} from "@/redux/features/gallerySlice";

function AddCategory() {
  const dispatch = useDispatch();
  const gallery = useSelector((state) => state.gallery);
  const [errors, setErrors] = useState({
    title: false,
    date: false,
  });

  const handleSave = () => {
    const newErrors = {
      title: gallery.title.trim() === "",
      date: gallery.date.trim() === "",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((e) => e);
    if (hasError) return;
  };
  return (
    <div className="w-full">
      <div className="mx-5 md:mx-30 my-10">
        <div className="my-10 text-xl">
          <h1> اضافه کردن مناسبت ها</h1>
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-5">
          <div className="flex flex-col w-full">
            <InputTypeOne
              placeholder=" موضوع اخبار مورد نظر را وارد کنید"
              name="NameCategory"
              className={`my-5 ${errors.title ? "border border-red-500" : ""}`}
              value={gallery.title}
              onChange={(e) => dispatch(setTitle(e.target.value))}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">موضوع اجباری است</p>
            )}
          </div>
          <div className="flex flex-col w-full">
            <InputTypeOne
              placeholder="تاریخ را به عدد وارد کنید "
              name="DateCategory"
              className={`my-5 ${errors.date ? "border border-red-500" : ""}`}
              value={gallery.date}
              onChange={(e) => dispatch(setDate(e.target.value))}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">تاریخ اجباری است</p>
            )}
          </div>
        </div>
        <div>
          <AddImagesDynamic
            value={gallery.image}
            onChange={(file) => dispatch(setImage(file))}
          />
        </div>
        <div className="flex flex-col md:flex-row justify-center items-center gap-5">
          <button
            className="p-2 rounded-xl border-3 bg-green-500 shadow-lg hover:bg-green-600 hover:text-white transition-all cursor-pointer  border-green-700 w-[250px]"
            onClick={handleSave}
          >
            ذخیره
          </button>
          <button
            onClick={() => dispatch(resetGallery())}
            className="p-2 rounded-xl border-3 bg-green-100 shadow-lg hover:bg-green-600 hover:text-white transition-all cursor-pointer  border-green-700 w-[250px]"
          >
            لغو
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCategory;
