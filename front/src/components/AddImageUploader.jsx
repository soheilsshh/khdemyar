"use client";

import React, { useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import ImageUploader from "@/components/ImageUploader";
import { useDispatch, useSelector } from "react-redux";
import { setImage } from "@/redux/features/gallerySlice";

const AddImagesDynamic = () => {
  const dispatch = useDispatch();
  const gallery = useSelector((state) => state.gallery);

  const [uploaders, setUploaders] = useState([0]);

  const handleAddUploader = () => {
    setUploaders((prev) => [...prev, prev.length]);

    const newImages = [
      ...(Array.isArray(gallery.image) ? gallery.image : []),
      null,
    ];
    dispatch(setImage(newImages));
  };

  const handleImageChange = (index, img) => {
    const images = [...(Array.isArray(gallery.image) ? gallery.image : [])];
    images[index] = img;
    dispatch(setImage(images));
  };

  return (
    <>
      <div className="grid grid-cols-2 md:grid-cols-5 col-span-1 my-10 gap-4 md:gap-5">
        {uploaders.map((_, index) => (
          <div key={index}>
            <ImageUploader
              value={gallery.image?.[index] || null}
              onChange={(img) => handleImageChange(index, img)}
            />
          </div>
        ))}
      </div>
      <div>
        <button
          type="button"
          onClick={handleAddUploader}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg shadow-md my-10"
        >
          <AiOutlinePlus size={20} />
          افزودن تصویر
        </button>
      </div>
    </>
  );
};

export default AddImagesDynamic;
