"use client";
import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const images = [
  {
    src: "/images/image-1.jpg",
    text: "برگزاری باشکوه مراسم دعای عرفه در سراسر کشور با حضور خیل عظیم عاشقان و دلدادگان اهل بیت (ع) و اقامه نماز و قرائت دعای عرفه به صورت همزمان در مساجد و حسینیه‌ها."
      + "\nاین مراسم فرصتی است تا بندگان خدا با تضرع و دعا به درگاه الهی تقرب جویند و از گناهان خویش آمرزش طلب کنند."
  },
  {
    src: "/images/image-2.jpg",
    text: "همایش بزرگ روز جهانی قدس با حضور گسترده مردم مؤمن در خیابان‌های شهرهای مختلف به منظور حمایت از ملت مظلوم فلسطین و محکوم کردن ظلم و ستم رژیم صهیونیستی."
      + "\nدر این همایش‌ها پیام‌های وحدت و مقاومت در برابر دشمنان اسلام با سخنرانی علما و مداحی‌های حماسی به گوش جان مردم رسید."
  },
  {
    src: "/images/image-4.jpeg",
    text: "مراسم باشکوه جشن میلاد حضرت امام رضا (ع) در حرم مطهر با حضور هزاران زائر و دوستداران اهل بیت، همراه با برنامه‌های متنوع فرهنگی، سخنرانی، و مرثیه‌سرایی‌های پرمعنا."
      + "\nاین جشن‌ها نمادی از ارادت عمیق مردم به امام رئوف و یادآور جایگاه والای ایشان در قلب مسلمانان است."
  },
];


export default function ImageSlider() {
    return (
        <div className="w-full  mx-auto  col-span-12 xl:col-span-8">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                loop={true}
                autoplay={{ delay: 3000 }}
                pagination={{ clickable: true }}
                navigation
                spaceBetween={20}
                slidesPerView={1}
                className="rounded-2xl overflow-hidden shadow-xl"
            >
                {images.map((image, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative w-full h-[200px] md:h-[400px]">
                            <Image
                                src={image.src}
                                alt={`slide-${index}`}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <div className=" p-5 pb-8 ">
                            <div className="line-clamp-2">
                                {image.text}
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
}
