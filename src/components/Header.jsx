import React, { useEffect, useRef, useState } from "react";
import { logo } from "../assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaCartShopping } from "react-icons/fa6";
import { HiOutlineMenuAlt1 } from "react-icons/hi";
import { BsCart4 } from "react-icons/bs";
import { AiOutlineLogin } from "react-icons/ai";
import { CgProfile } from "react-icons/cg";
import { MdOutlineLogout, MdOutlineShoppingCart, MdOutlineLock } from "react-icons/md";
import UserAvathar from "../assets/images/user.png";

import { AnimatePresence, motion } from "framer-motion";
import { MdClose } from "react-icons/md";
import CartModal from "./CartModal";
import { useDispatch, useSelector } from "react-redux";
import { cloudinary } from "../utils/cloudinaryBaseUrl";
import { logout } from "../redux/actions/userActions";
import { toggleCart } from "../redux/reducers/userSlice";

const menuItems = [
  { title: `home`, url: `/` },
  { title: `shop now`, url: `/shop` },
  { title: `about us`, url: `/about-us` },
  { title: `videos`, url: `/our-videos` },
  { title: `contact`, url: `/contact-us `},
];

const Header = () => {
  const location = useLocation();
  const { pathname } = useLocation();
  if (pathname === "/login") return null;
  const currentPathname = location.pathname;
  const [isAdminView, setIsAdminView] = useState(true);
  const [open, setOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const menuRef = useRef(null);
  const profileDropdownRef = useRef(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, openCart } = useSelector((state) => state.user);
  const { cart, loading } = useSelector((state) => state.cart);

  const changeCartState = () => {
    dispatch(toggleCart())
  };

  const handleClickOutside = (event) => {
    // Close mobile menu if clicked outside
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setOpen(false);
    }

    // Close profile dropdown if clicked outside
    if (
      profileDropdownRef.current &&
      !profileDropdownRef.current.contains(event.target)
    ) {
      setIsProfileDropdownOpen(false);
    }
  };

  useEffect(() => {
    // Add click event listener to handle closing dropdowns
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleMenu = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen((prev) => !prev);
  };

  // Prevent scrolling when menu or cart is open
  open || openCart
    ? (document.body.style.overflow = "hidden")
    : (document.body.style.overflow = "unset");

  const menuVars = {
    initial: { scaleY: 0 },
    animate: {
      scaleY: 1,
      transition: {
        duration: 0.1,
        ease: [0.12, 0, 0.39, 0],
      },
    },
    exit: {
      scaleY: 0,
      transition: {
        delay: 0.3,
        duration: 0.1,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const handleLogout = () => {
    navigate("/");
    dispatch(logout());
  };

  // Common dropdown menu items
  const profileMenuItems = [
    {
      icon: <MdOutlineShoppingCart className="mr-2" />,
      text: "My Orders",
      path: "/order-history",
      onClick: () => {
        setIsProfileDropdownOpen(false);
        setOpen(false);
      }
    },
    {
      icon: <CgProfile className="mr-2" />,
      text: "Profile",
      path: "/edit-profile",
      onClick: () => {
        setIsProfileDropdownOpen(false);
        setOpen(false);
      }
    },
    {
      icon: <MdOutlineLock className="mr-2" />,
      text: "Change Password",
      path: "/change-password",
      onClick: () => {
        setIsProfileDropdownOpen(false);
        setOpen(false);
      }
    },
    {
      icon: <MdOutlineLogout className="mr-2" />,
      text: "Logout",
      path: null,
      onClick: () => {
        setIsProfileDropdownOpen(false);
        handleLogout();
        setOpen(false);
      }
    }
  ];


  // Render dropdown menu items
  const renderDropdownItems = () => (
    <ul className="py-1">
      {profileMenuItems.slice(0, -1).map((item, index) => (
        <li key={index}>
          <Link
            to={item.path}
            onClick={(e) => {
              // e.preventDefault()
              item.onClick()
              setIsProfileDropdownOpen((prev)=>!prev)
              
            }
            }
            className=" px-4 py-2 text-gray-800 hover:bg-gray-100 flex text-nowrap items-center"
          >
            {item.icon}
            {item.text}
          </Link>
        </li>
      ))}
      <li>
        <button
          onClick={profileMenuItems[3].onClick}
          className="w-full text-left flex items-center px-4 py-2 text-red-600 hover:bg-red-50 border-t border-gray-200"
        >
          {profileMenuItems[3].icon}
          {profileMenuItems[3].text}
        </button>
      </li>
    </ul>
  );

  return (
    <nav className="w-11/12 py-5 mx-auto flex items-center justify-between z-[9999]">
      {/* Logo */}
      <Link to={"/"}>
        <img
          className="h-20 w-28 xl:w-48 object-contain"
          src={logo}
          alt="safeears"
        />
      </Link>

      {/* Large Screen Menu */}
      <div className="flex   xl:flex-row gap-y-3 gap-x-20">
        {/* Menu Items */}
        <ul className="hidden lg:flex items-center gap-5">
          {menuItems?.map((menu, i) => (
            <div key={i}>
              <li
                className={`text-sm uppercase transition-all duration-200 text-white ${currentPathname === menu.url
                  ? "border-b-0 border-white font-semibold text-xl"
                  : "border-b-0 border-transparent font-medium"
                  }`}
              >
                <Link to={menu.url}>{menu.title}</Link>
              </li>
            </div>
          ))}
        </ul>

        {/* Desktop User Section */}
        <div className="hidden lg:block">
          {loading ? (
            ""
          ) : user && user.role === "user" ? (
            <>
              <div className="flex gap-10 items-center uppercase text-sm relative ">
                <div
                  ref={profileDropdownRef}
                  className="flex items-center gap-1 cursor-pointer relative"
                  onClick={toggleProfileDropdown}
                >
                  <img
                    className="h-10 w-10 rounded-full object-cover border-2"
                    src={
                      user.profileImgURL
                        ? `${cloudinary}/${user.profileImgURL}`
                        : UserAvathar
                    }
                    alt=""
                  />
                  <span>{user.firstName}</span>

                  {/* Desktop Profile Dropdown */}
                  {isProfileDropdownOpen && (
                    <div className="absolute top-full -right-10 mt-2 w-48 bg-white shadow-lg rounded-lg border">
                      {renderDropdownItems()}
                    </div>
                  )}
                </div>

              </div>
            </>
          ) : (
            <>
              <Link
                to={"/login"}
                className="flex gap-1 bg-main hover:bg-yellow-600 duration-200 px-8 cursor-pointer text-sm py-2 rounded-full items-center justify-center font-medium uppercase text-white"
              >
                <p>Login</p>
                <AiOutlineLogin className="text-lg" />
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Sections */}
      <div className="flex gap-5">
        {/* Mobile Cart Icon */}


        {/* Mobile Menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              ref={menuRef}
              variants={menuVars}
              initial="initial"
              animate="animate"
              exit="exit"
              className="fixed lg:hidden left-0 top-0 w-full h-fit pt-20 rounded-b-[2rem] origin-top bg-white text-main p-10 z-[9999]"
            >
              {/* Close Button */}
              <motion.div
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.3 }}
                className="absolute right-4 top-6"
              >
                <MdClose
                  onClick={toggleMenu}
                  className="text-3xl cursor-pointer"
                />
              </motion.div>

              {/* Mobile Menu Content */}
              <motion.div
                initial={{ opacity: 0, translateY: 40 }}
                animate={{ opacity: 1, translateY: 0 }}
                exit={{ opacity: 0, translateY: -40 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col h-full justify-center items-center gap-3 md:gap-4"
              >
                <div className="overflow-hidden flex flex-col gap-5 text-center font-semibold capitalize text-xl w-full">
                  {/* Menu Navigation Items */}
                  {menuItems?.map((menu, i) => (
                    <Link
                      key={i}
                      onClick={() => setOpen(false)}
                      className="hover:underline"
                      to={menu.url}
                    >
                      {menu.title}
                    </Link>
                  ))}

                  {/* Mobile User Profile Section */}
                  <div className="mt-4">
                    {loading ? (
                      ""
                    ) : user && user.role === "user" ? (
                      <div className="flex flex-col items-center gap-4">
                        {/* Profile Header */}
                        <div
                          className="flex items-center gap-3 cursor-pointer"
                          onClick={toggleProfileDropdown}
                        >
                          <span className="text-base">{user.firstName}</span>
                          <img
                            className="h-12 w-12 rounded-full object-cover border-2"
                            src={
                              user.profileImgURL
                                ? `${cloudinary}/${user.profileImgURL}`
                                : UserAvathar
                            }
                            alt="Profile"
                          />
                        </div>

                        {/* Mobile Profile Dropdown */}
                        <div className="w-full bg-gray-100 rounded-lg">
                          <ul className="py-1">
                            {profileMenuItems.slice(0, -1).map((item, index) => (
                              <li onClick={() => {
                                setOpen(false)
                                navigate(`${item.path}`)
                              }}
                                className="px-4 py-2 cursor-pointer text-gray-800 hover:bg-gray-100 flex text-nowrap items-center" key={index}>

                                {item.icon}
                                {item.text}
                              </li>
                            ))}
                            <li>
                              <button
                                onClick={profileMenuItems[3].onClick}
                                className="w-full text-left flex items-center px-4 py-2 text-red-600 hover:bg-red-50 border-t border-gray-200"
                              >
                                {profileMenuItems[3].icon}
                                {profileMenuItems[3].text}
                              </button>
                            </li>
                          </ul>
                        </div>
                      </div>
                    ) : (
                      <Link
                        to={"/login"}
                        className="flex gap-1 bg-main hover:bg-yellow-600 duration-200 px-8 cursor-pointer py-2 rounded-full items-center justify-center font-medium text-white"
                      >
                        <p>Login</p>
                        <AiOutlineLogin className="text-lg" />
                      </Link>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Menu Toggle */}
        <div className="flex gap-8 items-center">
          <HiOutlineMenuAlt1
            onClick={toggleMenu}
            className="text-4xl block lg:hidden cursor-pointer"
          />
        </div>
      </div>
      {user && user.role === "user" && (
      <div className=" fixed bottom-24 right-7 bg-main p-2 hover:bg-main-hover rounded-full shadow-xl">

        <div className="  hover:cursor-pointer  ">
          {cart && cart.length !== 0 && (
            <span className="bg-black text-white h-5 w-5 absolute -top-2 rounded-full grid place-items-center right-2 text-xs">
              {cart.length !== 0 && cart.length}
            </span>
          )}
          <BsCart4 onClick={changeCartState} className="text-3xl" />
        </div>
      </div>
        ) }
      {/* Cart Modal */}
      <CartModal />
    </nav>
  );
};

export default Header;
