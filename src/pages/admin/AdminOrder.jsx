import React, { useEffect, useState } from "react";
import { TiCancel } from "react-icons/ti";
import { BsArrowLeft } from "react-icons/bs";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { FiDownload } from "react-icons/fi";

import axios from "axios";
import { URL } from "../../Common/api";
import { config } from "../../Common/configurations";
import { useNavigate, useParams } from "react-router-dom";
import date from "date-and-time";
// import Modal from "../components/Modal";
import StatusComponent from "../../components/StatusComponent";
import OrderDetailsProductRow from "../../pages/OrderDetailsProductRow";
import OrderHistoryAddress from "../../pages/OrderHistoryAddress";
import { modifyPaymentModeText } from "../../Common/functions";
import OrderDates from "../OrderDates";
import StatusHistoryLoadingBar from "../../components/StatusHistoryLoadingBar";

const AdminOrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [orderData, setOrderData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${URL}/admin/order/${id}`, config);

      if (res) {
        setOrderData(res.data.order);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      setError(error);
    }
  };

  // Downloading invoice
  const handleGenerateInvoice = async () => {
    try {
      const response = await axios.get(`${URL}/user/order-invoice/${id}`, {
        responseType: "blob",
        withCredentials: true,
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "invoice.pdf";
      link.click();
    } catch (error) {
      console.error("Error generating invoice:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  return (
    <>
      {orderData && (
        <div className="min-h-screen bg-gray-100 w-full px-5 lg:px-0 text-black">
          <div className="bg-white rounded-lg">
            <div className="flex items-center justify-between px-5 py-1 border-b">
              <div className="flex items-center gap-1">
                <div
                  className="cursor-pointer p-1 sm:p-3 rounded-md text-gray-500 hover:text-black hover:shadow-lg"
                  onClick={() => navigate(-1)}
                >
                  <BsArrowLeft className="text-xl" />
                </div>
                <h1 className="sm:uppercase text-xs sm:text-xl font-semibold">
                  Order Detail
                </h1>
              </div>
            </div>
            {/* Total Price, Order ID, and product count, order placement date */}
            <div>
              <div className="p-2 sm:p-5 m-5 bg-gray-200 rounded-lg flex flex-col sm:flex-row items-center justify-between">
                <div>
                  <h1 className="sm:text-lg font-semibold">
                    #{orderData.orderId || orderData._id}
                  </h1>
                  <p className="text-gray-500 text-xs sm:text-base">
                    {orderData.totalQuantity} products ∙ Order placed in{" "}
                    {date.format(
                      new Date(orderData.createdAt),
                      "MMM DD, YYYY at hh:mm A"
                    )}
                  </p>
                </div>
                <h1 className="text-3xl font-bold">{orderData.totalPrice}₹</h1>
              </div>
              {/* Expected Date and status component */}
              <div className="px-5 pb-5 border-b flex flex-col gap-2 sm:flex-row sm:gap-0 items-center justify-between">
                <div>
                  <StatusComponent status={orderData.status} />
                </div>
              </div>
              {/* Order Status representation */}
              {orderData.statusHistory &&
                (orderData.status === "pending" ||
                  orderData.status === "processing" ||
                  orderData.status === "shipped" ||
                  orderData.status === "delivered") && (
                  <div className="px-5 pt-5  ">
                    <StatusHistoryLoadingBar
                      statusHistory={orderData.statusHistory}
                    />
                  </div>
                )}
              {/* Product table */}
              <div className="px-5 w-full border-b mt-3">
                <h1 className="text-lg font-semibold pb-3">
                  Products{" "}
                  <span className="text-gray-500">
                    ({orderData.totalQuantity})
                  </span>
                </h1>
                {/* Product table */}
                <div className="overflow-x-auto">
                  <table className="w-full table-auto">
                    <thead>
                      <tr className="bg-gray-100 border border-gray-300">
                        <td className="py-2 px-1 w-4/12">Products</td>
                        <td className="py-2 px-1 w-1/12">Price</td>
                        <td className="py-2 px-1 w-1/12">Quantity</td>
                        <td className="py-2 px-1 w-1/12">Sub-Total</td>
                        {orderData.status !== "pending" &&
                          orderData.status !== "processing" &&
                          orderData.status !== "shipped" && (
                            <td className="py-2 px-1 w-2/12">Review</td>
                          )}
                      </tr>
                    </thead>
                    <tbody>
                      {orderData.products &&
                        orderData.products.map((item, index) => (
                          <OrderDetailsProductRow
                            index={index}
                            item={item}
                            length={orderData.products.length}
                            key={index}
                          />
                        ))}
                    </tbody>
                  </table>
                </div>
                {/* Order Total and charges */}
                <div className="lg:flex w-full lg:flex-row-reverse">
                  <div className="sm:w-1/4 bg-gray-100  p-5">
                    <div className="border-b border-gray-200 pb-2 mb-2">
                      <div className="cart-total-li">
                        <p className="cart-total-li-first">Sub Total</p>
                        <p className="cart-total-li-second">
                          {orderData.subTotal}₹
                        </p>
                      </div>
                      <div className="cart-total-li">
                        <p className="cart-total-li-first">Shipping</p>
                        <p className="cart-total-li-second">
                          {orderData.shipping === 0
                            ? "Free"
                            : orderData.shipping}
                        </p>
                      </div>
                      <div className="cart-total-li">
                        <p className="cart-total-li-first">Discount</p>
                        <p className="cart-total-li-second">
                          {orderData.discount || 0}₹
                        </p>
                      </div>
                      <div className="cart-total-li">
                        <p className="cart-total-li-first">Tax</p>
                        <p className="cart-total-li-second">{orderData.tax}₹</p>
                      </div>
                    </div>
                    <div className="cart-total-li">
                      <p className="font-semibold text-gray-500">Total</p>
                      <p className="font-semibold">{orderData.totalPrice}₹</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* ShippingAddress, BillingAddress and Order Notes */}
              <div className="p-5 font-semibold lg:flex justify-center">
                {orderData.address && (
                  <OrderHistoryAddress
                    address={orderData.address}
                    title="Shipping Address"
                  />
                )}
                {orderData.address && (
                  <OrderHistoryAddress
                    address={orderData.address}
                    title="Billing Address"
                  />
                )}

                <div className="p-5 lg:w-1/3">
                  <h1>Order Notes</h1>
                  <p className="text-gray-500 py-2">
                    {orderData.additionalNotes || "Not Added"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminOrderDetails;
