import React from "react";
import ImageNews from "../_components/ImageNews";
import TextNews from "../_components/TextNews";

function News() {
  return (
    <>
      <div className="flex flex-col md:flex-row justify-center items-center md:gap-14 w-full md:max-h-[350px] p-4 hover:bg-gray-100">
        <ImageNews />
        <TextNews />
      </div>
      <div>
        <hr className="border-gray-300" />
      </div>
    </>
  );
}

export default News;
