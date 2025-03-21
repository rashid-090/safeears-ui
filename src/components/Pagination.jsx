import React from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import toast from "react-hot-toast";
import { AiOutlineDoubleLeft, AiOutlineDoubleRight } from "react-icons/ai";

const Pagination = ({ handleClick, page, number, totalNumber }) => {
  let paginationNum = Math.ceil(totalNumber / number);
  const maxVisibleButtons = 5; // Number of pages to be shown in the pagination

  const renderPaginationNumber = () => {
    const paginationButtons = [];
    if (paginationNum > maxVisibleButtons) {
      const leftBoundary = Math.max(page - Math.floor(maxVisibleButtons / 2), 1);
      const rightBoundary = Math.min(leftBoundary + maxVisibleButtons - 1, paginationNum);

      if (leftBoundary > 1) {
        paginationButtons.push(
          <p key="ellipsis-left" className="text-gray-500">
            ...
          </p>
        );
      }

      for (let i = leftBoundary; i <= rightBoundary; i++) {
        paginationButtons.push(
          <p
            key={i}
            className={`px-3 py-1 rounded-lg cursor-pointer ${
              page === i
                ? "bg-blue-500 text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
            onClick={() => handleClick("page", i)}
          >
            {i}
          </p>
        );
      }

      if (rightBoundary < paginationNum) {
        paginationButtons.push(
          <p key="ellipsis-right" className="text-gray-500">
            ...
          </p>
        );
      }
    } else {
      for (let i = 1; i <= paginationNum; i++) {
        paginationButtons.push(
          <p
            key={i}
            className={`px-3 py-1 rounded-lg cursor-pointer ${
              page === i
                ? "bg-[#00756b] text-white"
                : "bg-gray-200 hover:bg-gray-300 text-gray-700"
            }`}
            onClick={() => handleClick("page", i)}
          >
            {i}
          </p>
        );
      }
    }

    return paginationButtons;
  };

  return (
    <div className="flex items-center justify-center space-x-2 mt-4">
      {paginationNum > maxVisibleButtons && (
        <p
          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
          onClick={() => {
            if (page > 1) {
              handleClick("page", 1);
            } else {
              toast.error("Already on the first page");
            }
          }}
        >
          <AiOutlineDoubleLeft size={18} />
        </p>
      )}
      {paginationNum > 1 && (
        <p
          className="p-2 rounded-lg  hover:bg-gray-300 cursor-pointer"
          onClick={() => {
            if (page > 1) {
              handleClick("page", page - 1);
            } else {
              toast.error("Can't go below one");
            }
          }}
        >
          <BsArrowLeft size={18} />
        </p>
      )}
      {renderPaginationNumber()}
      {paginationNum > 1 && (
        <p
          className="p-2 rounded-lg  hover:bg-gray-300 cursor-pointer"
          onClick={() => {
            if (page < paginationNum) {
              handleClick("page", page + 1);
            } else {
              toast.error("Page End");
            }
          }}
        >
          <BsArrowRight size={18} />
        </p>
      )}
      {paginationNum > maxVisibleButtons && (
        <p
          className="p-2 rounded-lg bg-gray-200 hover:bg-gray-300 cursor-pointer"
          onClick={() => {
            if (page < paginationNum) {
              handleClick("page", paginationNum);
            } else {
              toast.error("Already on the last page");
            }
          }}
        >
          <AiOutlineDoubleRight size={18} />
        </p>
      )}
    </div>
  );
};

export default Pagination;
