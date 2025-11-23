// components/Pagination.jsx
"use client";

import React from "react";
import ReactPaginate from "react-paginate";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Pagination = ({
  currentPage = 1,         
  totalPages = 1,          
  onPageChange = () => {}, 
}) => {
  return (
    <ReactPaginate
      previousLabel={
        currentPage > 1 ? (
          <button className="bg-[#B7E5B4] text-black cursor-pointer p-2 size-10 rounded-full hover:bg-[#B0C5A4] transition">
            <IoIosArrowBack size={20} />
          </button>
        ) : null
      }
      nextLabel={
        currentPage < totalPages ? (
          <button className="bg-[#B7E5B4] text-black cursor-pointer p-2 size-10 rounded-full hover:bg-[#B0C5A4] transition">
            <IoIosArrowForward className="translate-x-0.5" size={20} />
          </button>
        ) : null
      }
      breakLabel={"..."}
      forcePage={currentPage - 1} 
      pageCount={totalPages}
      marginPagesDisplayed={0}
      pageRangeDisplayed={currentPage === 2 ? 2 : 3}
      onPageChange={({ selected }) => onPageChange(selected + 1)}
      containerClassName="flex text-white space-x-2 justify-center items-center"
      activeClassName=" active text-black px-3 py-1 rounded-full "
      pageClassName="p-2 bg-[#B7E5B4] text-black rounded-full size-10 flex justify-center items-center cursor-pointer rounded"
      previousClassName="px-3 py-1 rounded"
      nextClassName="px-3 py-1 rounded"
      breakClassName="px-3 py-1 hidden"
      renderOnZeroPageCount={null}
      disableInitialCallback
    />
  );
};

export default Pagination;
