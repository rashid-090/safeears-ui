import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getPayments } from "../../redux/actions/admin/paymentAction";
import { getOrders } from "../../redux/actions/admin/ordersAction";
import { getProducts } from "../../redux/actions/admin/productActions";

const Dashboard = () => {
  const { payments, loading, error, totalAvailablePayments } = useSelector(
    (state) => state.payments
  );

  const { orders, totalAvailableOrders } = useSelector((state) => state.orders);
  const { products, totalAvailableProducts } = useSelector(
    (state) => state.products
  );

  console.log(totalAvailableProducts);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPayments(""));
    dispatch(getOrders(""));
    dispatch(getProducts(""));
  }, []);

  return (
    <section className="h-full w-full">
      <h1 className="text-2xl font-semibold">Dashbaord</h1>
      <p className="">Welcome to the SafeEars Admin Panel!</p>
      {/* demo */}
      <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-4 mt-10 gap-5 text-black font-medium">
        <div className="bg-main  h-40 grid place-items-center rounded-2xl capitalize text-center text-xl shadow-lg">
          total Payments : {totalAvailablePayments}
        </div>
        <div className="bg-main h-40 grid place-items-center rounded-2xl capitalize text-center text-xl shadow-lg">
          total orders : {totalAvailableOrders}
        </div>
        <div className="bg-main  h-40 grid place-items-center rounded-2xl capitalize text-center text-xl shadow-lg">
          total Products : {totalAvailableProducts}
        </div>
      </div>
    </section>
  );
};

export default Dashboard;
