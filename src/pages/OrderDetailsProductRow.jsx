import React from "react";
import { URL } from "../Common/api";
import { Link } from "react-router-dom";
import { BiMessageSquareDetail } from "react-icons/bi";
import { cloudinary } from "../utils/cloudinaryBaseUrl";
import { useSelector } from "react-redux";

const OrderDetailsProductRow = ({ length, index, item }) => {
  const isLast = index === length - 1;
  const classes = isLast ? "p-4" : "p-4 border-b border-gray-200 ";

  return (
    <tr className={classes}>
      <td className="admin-table-row">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 overflow-clip flex justify-center items-center shrink-0">
            {item.productId.imageURL ? (
              <img
                src={`${cloudinary}/${item.productId.imageURL}`}
                alt={`${item.productId.imageURL}`}
                className="object-contain w-full h-full"
              />
            ) : (
              <div className="w-14 h-1w-14 bg-slate-300 rounded-md"></div>
            )}
          </div>
          <div>
            <Link to={`/shop/${item.productId._id}`}>
              <p className="lg:text-lg font-semibold text-blue-600 line-clamp-1 hover:underline cursor-pointer">
                {item.productId.name}
              </p>
            </Link>
            <p className="line-clamp-2">{item.productId.description}</p>
          </div>
        </div>
      </td>
      <td className="admin-table-row">{item.salePrice}</td>
      <td className="admin-table-row">{item.quantity}</td>
      <td className="admin-table-row">{item.salePrice * item.quantity}</td>
    </tr>
  );
};

export default OrderDetailsProductRow;
