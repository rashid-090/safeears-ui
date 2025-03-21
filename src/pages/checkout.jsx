import React from "react";
import {  useNavigate } from "react-router-dom";

const Checkout = () => {
  const navigate = useNavigate();
  return (
    <section className="w-11/12 xl:w-10/12 mx-auto py-10 h-full">
      <div className="grid grid-cols-1 md:grid-cols-3 text-sm gap-10">
        {/* left */}
        <div className="md:col-span-2">
          <h6 className="text-2xl font-semibold pb-5">Billing Address</h6>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-3 gap-y-4">
            <div className="flex flex-col gap-0">
              <label className="flex items-center gap-2">
                <p>Name</p>
                <span className="text-red-400 mt-2">*</span>
              </label>
              <input
                className="w-full p-2.5 bg-transparent outline-none border-2 border-gray-200"
                type="text"
                placeholder="Name"
              />
            </div>
            <div className="flex flex-col gap-0">
              <label className="flex items-center gap-2">
                <p>Phone Number</p>
                <span className="text-red-400 mt-2">*</span>
              </label>
              <input
                className="w-full p-2.5 bg-transparent outline-none border-2 border-gray-200"
                type="number"
                placeholder="Phone Number"
              />
            </div>
            <div className="flex flex-col gap-0">
              <label className="flex items-center gap-2">
                <p>Whatsapp Number</p>
                <span className="text-red-400 mt-2">*</span>
              </label>
              <input
                className="w-full p-2.5 bg-transparent outline-none border-2 border-gray-200"
                type="number"
                placeholder="Whatsapp Number"
              />
            </div>
            <div className="flex flex-col gap-0">
              <label className="flex items-center gap-2">
                <p>Email</p>
                <span className="text-red-400 mt-2">*</span>
              </label>
              <input
                className="w-full p-2.5 bg-transparent outline-none border-2 border-gray-200"
                type="email"
                placeholder="Email"
              />
            </div>
            <div className="flex flex-col gap-0 md:col-span-2">
              <label className="flex items-center gap-2">
                <p>Delivery Address</p>
                <span className="text-red-400 mt-2">*</span>
              </label>
              <textarea
                className="w-full p-2.5 bg-transparent outline-none border-2 border-gray-200"
                type="text"
                rows={4}
                placeholder="Phone Number"
              />
            </div>
            <div className="flex flex-col gap-0 md:col-span-2">
              <label className="flex items-center gap-2">
                <p>City</p>
                <span className="text-red-400 mt-2">*</span>
              </label>
              <input
                className="w-full p-2.5 bg-transparent outline-none border-2 border-gray-200"
                type="text"
                placeholder="City"
              />
            </div>
            <div className="flex flex-col gap-0">
              <label className="flex items-center gap-2">
                <p>State</p>
                <span className="text-red-400 mt-2">*</span>
              </label>
              <input
                className="w-full p-2.5 bg-transparent outline-none border-2 border-gray-200"
                type="text"
                placeholder="State"
              />
            </div>
            <div className="flex flex-col gap-0">
              <label className="flex items-center gap-2">
                <p>Pin Code</p>
                <span className="text-red-400 mt-2">*</span>
              </label>
              <input
                className="w-full p-2.5 bg-transparent outline-none border-2 border-gray-200"
                type="number"
                placeholder="Pin code"
              />
            </div>
          </div>
        </div>
        {/* seconde */}
        <div>
            <h6 className="text-2xl font-semibold pb-5">Your order</h6>
            <div className="flex flex-col gap-5">
                <table className="">
                    <tr className="text-main">
                        <th>Product</th>
                        <th>Subtotal</th>
                    </tr>
                    <tr>
                        <td>SE-Black RIGHT <span className="font-semibold">x 1</span></td>
                        <td>1299 ₹</td>
                    </tr>          
                    <tr>
                        <td>SE-Black RIGHT <span className="font-semibold">x 1</span></td>
                        <td>1299 ₹</td>
                    </tr>          
                    <tr>
                        <td>SE-Black RIGHT <span className="font-semibold">x 1</span></td>
                        <td>1299 ₹</td>
                    </tr>          
                    <tr className="font-bold text-main text-xl">
                        <td>Total</td>
                        <td>3999 ₹</td>
                    </tr>          
                </table>
                <button onClick={() => navigate('/order-success')} className="bg-main hover:bg-yellow-600 duration-200 text-white py-3 rounded-md capitalize font-semibold text-base">pay now</button>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Checkout;
