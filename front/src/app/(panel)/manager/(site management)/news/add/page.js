"use client";

import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  setTitle,
  setDate,
  setContent,
  setImage,
  resetNews,
} from "@/redux/features/newsSlice";

import InputTypeOne from "@/components/InputTypeOne";
import TextAreaTypeOne from "@/components/TextAreaTypeOne";
import ImageUploader from "@/components/ImageUploader";

function AddNews() {
  const dispatch = useDispatch();
  const news = useSelector((state) => state.news);
  const [errors, setErrors] = useState({
    title: false,
    date: false,
    content: false,
  });

  const handleSave = () => {
    const newErrors = {
      title: news.title.trim() === "",
      date: news.date.trim() === "",
      content: news.content.trim() === "",
    };

    setErrors(newErrors);

    const hasError = Object.values(newErrors).some((e) => e);
    if (hasError) return;
  };

  return (
    <div className="w-full">
      <div className="mx-5 md:mx-30 my-10">
        <div className="my-10 text-xl">
          <h1>اخبار جدید</h1>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-center gap-5">
          <div className="flex flex-col w-full">
            <InputTypeOne
              placeholder=" موضوع اخبار مورد نظر را وارد کنید"
              name="NameCategory"
              className={`my-5 ${errors.title ? "border border-red-500" : ""}`}
              value={news.title}
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
              value={news.date}
              onChange={(e) => dispatch(setDate(e.target.value))}
            />
            {errors.date && (
              <p className="text-red-500 text-sm">تاریخ اجباری است</p>
            )}
          </div>
        </div>

        <div>
          <TextAreaTypeOne
            placeholder="متن خود را وارد کنید "
            name="text"
            className={`my-5 min-h-[200px] ${
              errors.content ? "border border-red-500" : ""
            }`}
            value={news.content}
            onChange={(e) => dispatch(setContent(e.target.value))}
          />
        </div>
        {errors.content && (
          <p className="text-red-500 text-sm">متن اجباری است</p>
        )}

        <div className="my-5">
          <ImageUploader
            value={news.image}
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
            onClick={() => dispatch(resetNews())}
            className="p-2 rounded-xl border-3 bg-green-100 shadow-lg hover:bg-green-600 hover:text-white transition-all cursor-pointer  border-green-700 w-[250px]"
          >
            لغو
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddNews;
