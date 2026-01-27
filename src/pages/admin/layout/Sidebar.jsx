import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { HiOutlineTruck } from "react-icons/hi2";
import { TbSitemap } from "react-icons/tb";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { BsCreditCard } from "react-icons/bs";
import { GoCodeReview } from "react-icons/go";
import { IoCloseOutline } from "react-icons/io5";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaHospital, FaUserMd, FaImages } from "react-icons/fa";
import { logo } from "../../../assets";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const navigationItems = [
    {
      label: "Dashboard",
      path: "/admin",
      icon: <RxDashboard className="text-xl" />,
    },
    {
      label: "All Products",
      path: "/admin/products",
      icon: <TbSitemap className="text-xl" />,
    },
    {
      label: "All Orders",
      path: "/admin/orders",
      icon: <HiOutlineTruck className="text-xl" />,
    },
    {
      label: "Add Product",
      path: "/admin/add-product",
      icon: <MdFormatListBulletedAdd className="text-xl" />,
    },
    {
      label: "Payments",
      path: "/admin/payments",
      icon: <BsCreditCard className="text-xl" />,
    },
    {
      label: "Testimonials",
      path: "/admin/testimonials",
      icon: <GoCodeReview className="text-xl" />,
    },
    {
      label: "Hospitals",
      path: "/admin/hospitals",
      icon: <FaHospital className="text-xl" />,
    },
    {
      label: "Doctors",
      path: "/admin/doctors",
      icon: <FaUserMd className="text-xl" />,
    },
    {
      label: "Banners",
      path: "/admin/banners",
      icon: <FaImages className="text-xl" />,
    },
  ];

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    if (window.innerWidth < 1024) {
      setIsSidebarOpen(false);
    }
  };

  const isActive = (path) => {
    // For admin dashboard home route
    if (path === "/admin" && location.pathname === "/admin") {
      return true;
    }

    // For nested admin routes, ensure proper matching
    if (path !== "/admin") {
      // This handles exact matches and also cases where the path is followed by a slash and more content
      return location.pathname === path || location.pathname.startsWith(`${path}/`);
    }

    return false;
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        className="fixed top-4 left-4 z-30 lg:hidden bg-black text-white p-2 rounded-md shadow-md"
        onClick={toggleSidebar}
        aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <GiHamburgerMenu className="text-xl" />
      </button>

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:translate-x-0 lg:static lg:h-screen`}
      >
        {/* Header */}
        <div className="flex items-center justify-between h-16 px-4 bg-black text-white">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Logo"
              className="h-8 w-auto object-contain"
            />
            <h1 className="text-lg font-medium">Admin Panel</h1>
          </div>

          <button
            className="text-white lg:hidden"
            onClick={closeSidebar}
            aria-label="Close sidebar"
          >
            <IoCloseOutline className="text-2xl" />
          </button>
        </div>

        {/* Navigation */}
        <div className="p-4 h-[calc(100%-4rem)] overflow-y-auto">
          <nav className="flex flex-col gap-2">
            {navigationItems.map((item, index) => (
              <Link
                key={index}
                to={item.path}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-md transition-colors duration-200 ${isActive(item.path)
                  ? "bg-main text-white"
                  : "text-gray-700 hover:bg-blue-100"
                  }`}
              >
                {item.icon}
                <span className="font-medium capitalize">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
          onClick={closeSidebar}
          aria-hidden="true"
        ></div>
      )}
    </>
  );
};

export default Sidebar;