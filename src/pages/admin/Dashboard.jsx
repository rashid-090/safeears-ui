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

  // console.log(totalAvailableProducts);

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

      <AnalyticsSection />
    </section>
  );
};

const AnalyticsSection = () => {
  const [analytics, setAnalytics] = React.useState({ hospitalAnalytics: [], doctorAnalytics: [] });
  const [loading, setLoading] = React.useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const { data } = await import("axios").then(mod => mod.default.get(`http://localhost:3000/api/admin/analytics`, { withCredentials: true }));
        setAnalytics(data);
      } catch (error) {
        console.error("Error fetching analytics", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <div className="mt-10">Loading Analytics...</div>;

  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Top Hospitals by Orders</h2>
        <ul>
          {analytics.hospitalAnalytics.length > 0 ? (
            analytics.hospitalAnalytics.map((item, index) => (
              <li key={index} className="flex justify-between py-2 border-b last:border-0 capitalize">
                <span>{item.name}</span>
                <span className="font-bold">{item.count} orders</span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </ul>
      </div>
      <div className="bg-white p-5 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Top Doctors by Orders</h2>
        <ul>
          {analytics.doctorAnalytics.length > 0 ? (
            analytics.doctorAnalytics.map((item, index) => (
              <li key={index} className="flex justify-between py-2 border-b last:border-0 capitalize">
                <span>{item.name}</span>
                <span className="font-bold">{item.count} orders</span>
              </li>
            ))
          ) : (
            <p className="text-gray-500">No data available</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
