import React from "react";
import News from "./_components/News";
import Pagination from "./_components/Pagination";


function Page() {
  return (
    <div className="my-40 mx-5 md:mx-[250px]">
      <News />
      <News />
      <News />
      <Pagination/>
    </div>
  );
}

export default Page;
