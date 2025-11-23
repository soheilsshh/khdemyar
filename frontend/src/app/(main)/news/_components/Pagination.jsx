"use client";
import { useRouter } from "next/navigation";
import React from "react";
import ReactPaginate from "react-paginate";

function Pagination() {
  const router = useRouter();
  const handlePageClick = (e) => {
    const page = e.selected + 1;
    router.push(`/news?page=${page}&per_page=2`);
  };
  return (
    <div className="mt-5" dir="rtl">
      <ReactPaginate
        breakLabel="..."
        nextLabel=">"
        onPageChange={handlePageClick}
        pageRangeDisplayed={5}
        pageCount={1}
        previousLabel="<"
        renderOnZeroPageCount={null}
        containerClassName="flex flex-row gap-1 justify-center text-lg"
        pageClassName="border border-gray-300 rounded-full bg-[#8D6145]"
        pageLinkClassName="px-4 py-4 cursor-pointer"
        activeClassName="bg-[#FE6E1F] text-white"
        previousClassName="border border-gray-300 rounded-full bg-[#8D6145]"
        previousLinkClassName="px-4 py-4 cursor-pointer"
        nextClassName="border border-gray-300 rounded-full bg-[#8D6145]"
        nextLinkClassName="px-4 py-4 cursor-pointer "
        breakClassName="border border-gray-300 rounded-full"
        breakLinkClassName="px-4 py-4"
        disabledClassName="opacity-50 cursor-not-allowed"
      />
    </div>
  );
}

export default Pagination;
