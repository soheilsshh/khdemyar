import Image from "next/image";
import React from "react";

function Side() {
  return (
    <div
      className=" hidden lg:flex rounded-lg h-full  flex-col w-full
                justify-center items-center text-white p-8 lg:p-11 pt-12 lg:py-12 relative"
    >
      <div className="relative -translate-y-7 w-full h-full  justify-center items-center flex  ">
        <Image
          src="/images/logo-3.png"
          alt="example"
          width={320}
          height={100}
          sizes="100%"
        />
      </div>
    </div>
  );
}

export default Side;
