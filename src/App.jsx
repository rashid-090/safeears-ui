import "./App.css";
import { ScrollToTop } from "react-router-scroll-to-top";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { lazy, Suspense, useEffect, useState } from "react";
import "react-loading-skeleton/dist/skeleton.css";
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  Navigate,
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import { Header, Footer, Hubspot, PageLoader } from "./components";
import HomePage from "./pages/HomePage";
import AboutUs from "./pages/AboutUs";
import ContactUs from "./pages/ContactUs";
import OurVideos from "./pages/OurVideos";
import Shop from "./pages/shop";
import Construct from "./pages/Construct";
import Profile from "./pages/profile";
import OTP from "./components/OTPSection";
import LoginPage from "./pages/loginPage";
import Orders from "./pages/orders";
import PageNotFound from "./pages/PageNotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import Dashboard from "./pages/admin/Dashboard";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminOrder from "./pages/admin/AdminOrder";
import AdminProducts from "./pages/admin/AdminProducts";
import AddProduct from "./pages/admin/AddProduct";
import AdminSidebar from "./pages/admin/layout/Sidebar";
import AdminNav from "./pages/admin/layout/Navbar";
import { useDispatch, useSelector } from "react-redux";

import ProductPage from "./pages/ProductPage";
import { getUserDataFirst } from "./redux/actions/userActions";
import OrderConfirmation from "./pages/OrderConfirmation";
import OrderHistory from "./pages/OrderHistory";
import OrderDetail from "./pages/OrderDetail";
import Payments from "./pages/admin/Payments";
import Loading from "./components/Loading";
import { Toaster } from "react-hot-toast";
import ForgotPassword from "./pages/ForgotPassword";
import ChangePassword from "./pages/ChangePassword";
import Testimonials from "./pages/admin/Testimonials";


// Admin Layout
const AdminLayout = () => {
  const [isSideBarOpen, setIsSidebarOpen] = useState();
  return (
    <div className="flex h-screen bg-gray-100 text-black w-full">
      <AdminSidebar />
      <div className="flex flex-col flex-1 w-full">
        <AdminNav setIsSidebarOpen={setIsSidebarOpen} />
        <div className="flex-1 p-4 overflow-y-scroll w-full">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

// User Layout
const UserLayout = () => {
  return (
    <div className="2xl:max-w-[2200px] mx-auto min-h-screen flex flex-col">
      <ScrollToTop />
      <ToastContainer />
      <Header />
      {/* <Hubspot /> */}
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

function App() {
  const { user, loading } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  useEffect(() => {
    if (!user) {
      dispatch(getUserDataFirst());
    }
  }, [dispatch, user]);

  const ProtectedRoute = ({ element }) => {
    const { user, loading } = useSelector((state) => state.user);

    return user ? element : <Navigate to="/login" />;
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Toaster position="top-center" />

      <BrowserRouter>
        {/* {user ? user.role === "user" && <UserLayout /> : <UserLayout />} */}

        <Routes>
          <Route
            path="/"
            element={
              user ? user.role === "user" && <UserLayout /> : <UserLayout />
            }
          >
            <Route
              index
              element={
                user ? (
                  user.role === "admin" ? (
                    <Navigate to="/admin/" />
                  ) : (
                    <HomePage />
                  )
                ) : (
                  <HomePage />
                )
              }
            />

            {/* Auth Pages */}
            <Route path="/login" element={<LoginPage />} />
            {/* <Route path="register" element={<Register />} /> */}
            {/* <Route path="otp" element={<ValidateOTP />} />
          <Route path="forgot-password" element={<ForgetPassword />} /> */}

            {/* General Pages */}
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:id" element={<ProductPage />} />
            <Route path="/our-videos" element={<OurVideos />} />
            <Route path="/under-construction" element={<Construct />} />

            <Route
              path="/checkout"
              element={<ProtectedRoute element={<Orders />} />}
            />
            <Route
              path="/order-confirmation"
              element={<ProtectedRoute element={<OrderConfirmation />} />}
            />
            <Route
              path="/order-history"
              element={<ProtectedRoute element={<OrderHistory />} />}
            />
            <Route
              path="/order-history/detail/:id"
              element={<ProtectedRoute element={<OrderDetail />} />}
            />
            <Route
              path="/edit-profile"
              element={<ProtectedRoute element={<Profile />} />}
            />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route
              path="/change-password"
              element={<ProtectedRoute element={<ChangePassword />} />}
            />
            {/* Admin Routes */}
            {(user && user.role === "admin") ||
              (user && user.role === "superAdmin") ? (
              <Route path="/admin/*" element={<AdminRoutes />} />
            ) : (
              <Route path="/admin" element={<Navigate to="/" />} />
            )}

            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="order/:id" element={<AdminOrder />} />
        <Route path="products" element={<AdminProducts />} />

        <Route path="payments" element={<Payments />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="testimonials" element={<Testimonials />} />

        <Route path="*" element={<PageNotFound />} />
      </Route>
    </Routes>
  );
}




