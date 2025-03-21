import React, { useEffect } from "react";
import { BiWallet } from "react-icons/bi";
import { GiPayMoney } from "react-icons/gi";

const CheckoutPaymentOption = ({ selectedPayment, handleSelectedPayment }) => {
  return (
    <>
      <div className="flex items-center justify-center py-5">
        <label className="cursor-pointer" htmlFor="cashOnDelivery">
          <div className="border-r px-5  flex flex-col items-center hover:cursor-not-allowed ">
            <div className="w-10 h-10 flex items-center justify-center ">
              <GiPayMoney className="text-2xl" />
            </div>
            <p className="mb-2 text-sm">Cash On Delivery</p>
            <input
              type="radio"
              name="paymentMode"
              id="cashOnDelivery"
              value="cashOnDelivery"
              disabled={true}
              className="hover:cursor-not-allowed"
            />
            <p className="text-sm text-red-500">Not avalable now</p>
          </div>
        </label>
        <label className="cursor-pointer" htmlFor="razorPay">
          <div className="border-r px-5 flex flex-col items-center">
            <div className="w-10 h-10">
              <img
                src="https://d6xcmfyh68wv8.cloudfront.net/assets/razorpay-glyph.svg"
                alt="Razor Pay Icon"
                className="w-full h-full object-contain"
              />
            </div>
            <p className="mb-2 text-sm">Razer Pay</p>
            <input
              type="radio"
              name="paymentMode"
              id="razorPay"
              value="razorPay"
              onChange={handleSelectedPayment}
              checked={selectedPayment === "razorPay"}
            />
          </div>
        </label>
      </div>
    </>
  );
};

export default CheckoutPaymentOption;
