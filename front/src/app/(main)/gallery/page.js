"use client";
import React from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import Link from "next/link";
import FilterAccordion from "../../../components/DropdownAccordion";

const images = [
  {
    src: "/images/image-1.jpg",
    text: "برگذاری نشست بین خادمیاران چایخانه امام رضا",
  },
  {
    src: "/images/image-2.jpg",
    text: "برگذاری نشست بین خادمیاران چایخانه امام رضا",
  },
  {
    src: "/images/image-3.jpg",
    text: "برگذاری نشست بین خادمیاران چایخانه امام رضا",
  },
];

function Page() {
  return (
    <div className="flex flex-col md:flex-row justify-center items-center gap-5 my-30">
      <div className="px-5 w-full md:w-1/4">
        <FilterAccordion />
      </div>
      <div className="w-full md:w-3/4 px-5 md:px-10 relative">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          loop={true}
          autoplay={{ delay: 3000 }}
          pagination={{ clickable: true }}
          navigation={true}
          spaceBetween={20}
          slidesPerView={1}
          className="overflow-hidden shadow-xl"
        >
          {images.map((image, idx) => (
            <SwiperSlide key={`${image.src}-${idx}`}>
              <Link href="/gallery/1">
                <div className="relative w-full h-[300px] md:h-[600px] z-0">
                  <Image
                    src={image.src}
                    alt={`slide-${idx}`}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-black/50 text-white text-sm md:text-xl px-4 py-2 rounded-md">
                    {image.text}
                  </div>
                </div>
              </Link>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export default Page;
