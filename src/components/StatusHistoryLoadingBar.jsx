import React from "react";
import { TiTick } from "react-icons/ti";
import { BiDockLeft, BiPackage } from "react-icons/bi";
import { FaShippingFast, FaRegHandshake } from "react-icons/fa";

const StatusHistoryLoadingBar = ({ statusHistory }) => {
  let loadingPercentage = 0;
  let count = 0;

  if (statusHistory.slice(-1)[0].status === "processing") {
    count = 1;
    loadingPercentage = 35;
  }
  if (statusHistory.slice(-1)[0].status === "shipped") {
    loadingPercentage = 68;
    count = 2;
  }
  if (statusHistory.slice(-1)[0].status === "delivered") {
    loadingPercentage = 100;
    count = 3;
  }

  const list = [
    { name: "Order Placed", icon: <BiDockLeft />, status: "pending" },
    { name: "Packaging", icon: <BiPackage />, status: "processing" },
    { name: "Shipped", icon: <FaShippingFast />, status: "shipped" },
    { name: "Delivered", icon: <FaRegHandshake />, status: "delivered" },
  ];
  console.log(statusHistory.slice(-1)[0].status);
  const lastStatus = statusHistory.slice(-1)[0].status;

  return (
    <div className="relative h-24">
      <div className="flex justify-between w-full ">
        {list.map((status, index) => (
          <div className=" flex flex-col items-center z-10" key={index}>
            <div
              key={index}
              className={`w-6 h-6  rounded-full flex justify-center items-center  text-white ${
                count >= index
                  ? "bg-main"
                  : "border-4 border-main bg-white"
              }`}
            >
              {console.log(count,index)}
              {count >= index && <TiTick />}
            </div>
            <span className="text-2xl text-secondary mt-3">{status.icon}</span>
            <p className="text-sm font-semibold">{status.name}</p>
          </div>
        ))}
      </div>
      <div className="w-full px-8 absolute top-2">
        <div className="h-2 bg-gray-200 rounded-md">
          <div
            className="h-2 rounded-md bg-main"
            style={{ width: `${loadingPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default StatusHistoryLoadingBar;
