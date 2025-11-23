import Image from "next/image";
import Link from "next/link";
import React from "react";

function ImageNews() {
  return (
    <div>
      <div className="h-[200px] w-[400px] md:w-[250px] md:h-[200px] relative overflow-hidden z-0 cursor-pointer">
        <Link href="/news/2">
          <Image
            src="/images/image-1.jpg"
            alt="image"
            fill
            className="object-cover"
          />
        </Link>
      </div>
      <div className="bg-orange-400 flex justify-center items-center z-10 rounded-lg gap-2 w-[130px] h-[30px] -translate-x-72 md:-translate-x-40 -translate-y-12 md:-translate-y-20 hover:bg-gray-500">
        <p>1404/05/05</p>
        <Image
          src="/icons/icons8-calendar-50.png"
          alt="icon"
          width={20}
          height={20}
        />
      </div>
    </div>
  );
}

export default ImageNews;
