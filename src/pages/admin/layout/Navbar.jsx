import React, { useState } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../../redux/actions/userActions";

export default function AdminNav({ setIsSidebarOpen }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <header className="flex items-center justify-between px-4 py-2 bg-black shadow-md lg:justify-end">
      <div></div>
      <div className="relative">
        <button
          className="flex items-center p-2 space-x-2 bg-white rounded-full focus:outline-none"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        >
          <img
            className="w-8 h-8 rounded-full"
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEytaU1okXcPwqLgAzwfDimvvYST7la-GGYw&s"
            alt="Profile"
          />
          <span className="hidden text-sm font-medium text-gray-700 lg:block">
            Admin
          </span>
          <svg
            className="w-4 h-4 text-gray-700"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 w-fit mt-2 bg-white border border-gray-200 rounded-md shadow-lg">
            <button
              onClick={handleLogout}
              className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 flex gap-2 items-center"
            >
              Logout
              <IoLogOutOutline />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
