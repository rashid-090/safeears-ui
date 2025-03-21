import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { commonRequest, URL } from "../Common/api";
import { appJson, config } from "../Common/configurations";
import { useSelector } from "react-redux";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Toggle password visibility for different fields
  const togglePasswordVisibility = (field) => {
    switch (field) {
      case "currentPassword":
        setShowCurrentPassword(!showCurrentPassword);
        break;
      case "newPassword":
        setShowNewPassword(!showNewPassword);
        break;
      case "confirmNewPassword":
        setShowConfirmNewPassword(!showConfirmNewPassword);
        break;
      default:
        break;
    }
  };

  const handlePasswordReset = async () => {
    // Reset previous errors
    setError("");

    // Validation checks
    if (
      currentPassword.trim() === "" ||
      newPassword.trim() === "" ||
      confirmNewPassword.trim() === ""
    ) {
      setError("All fields are required");
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match");
      return;
    }

    // Prevent setting the same password
    if (currentPassword === newPassword) {
      setError("New password must be different from current password");
      return;
    }

    const value = {
      currentPassword: currentPassword,
      password: newPassword,
      passwordAgain: confirmNewPassword,
    };

    const data = await commonRequest(
      "POST",
      "/user/change-password",
      {
        ...value,
      },
      appJson
    );
    if (data.success) {
      toast.success("Password Updated");
      navigate("/");
    } else {
      toast.error(data.response.data.error);
      setError(data.response.data.error);
    }
  };

  return (
    <div className="bg-gradient-to-r from-[#007669] via-[#00726f] to-[#006b7c] flex items-center justify-center min-h-[80vh]">
      <div className="bg-white shadow-lg rounded-lg p-8 max-w-xs md:max-w-md w-full">
        <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">
          Reset Password
        </h2>
        <p className="text-center text-gray-600 mb-6">
          Update your account password
        </p>

        {/* Current Password Input */}
        <div className="mb-6 relative">
          <label
            htmlFor="currentPassword"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Current Password
          </label>
          <div className="relative">
            <input
              type={showCurrentPassword ? "text" : "password"}
              id="currentPassword"
              name="currentPassword"
              placeholder="Enter current password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-main 
                     text-gray-700 placeholder-gray-400 pr-10"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("currentPassword")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* New Password Input */}
        <div className="mb-6 relative">
          <label
            htmlFor="newPassword"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              id="newPassword"
              name="newPassword"
              placeholder="Enter new password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-main 
                     text-gray-700 placeholder-gray-400 pr-10"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("newPassword")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Confirm New Password Input */}
        <div className="mb-6 relative">
          <label
            htmlFor="confirmNewPassword"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              type={showConfirmNewPassword ? "text" : "password"}
              id="confirmNewPassword"
              name="confirmNewPassword"
              placeholder="Confirm new password"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-main 
                     text-gray-700 placeholder-gray-400 pr-10"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => togglePasswordVisibility("confirmNewPassword")}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
            >
              {showConfirmNewPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && <p className="my-2 text-red-400 text-center">{error}</p>}

        {/* Submit Button */}
        <button
          onClick={handlePasswordReset}
          disabled={loading}
          className="w-full bg-main text-white py-2 md:py-3 
                   rounded-lg font-semibold 
                   hover:bg-opacity-90 transition duration-200"
        >
          {loading ? "Reseting..." : "Reset Password"}
        </button>

        {/* Back to Profile Link */}
        <div className="text-center mt-6">
          <p
            className="   text-gray-600 hover:underline hover:cursor-pointer"
            onClick={() => navigate("/forgot-password")}
          >
            Forgot password?
          </p>
          <p className="text-gray-600 mt-2">
            Changed your mind?{" "}
            <span
              onClick={() => navigate("/")}
              className="text-main hover:underline cursor-pointer"
            >
              Back to Home
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
