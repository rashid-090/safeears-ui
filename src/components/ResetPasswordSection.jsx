import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";
import { URL } from "../Common/api";
import { config } from "../Common/configurations";
import { useSelector } from "react-redux";

const ResetPasswordSection = ({ phone, email, setPasswordSec, setFinalMessage }) => {
  const [password, setPassword] = useState("");
  const [passwordAgain, setPasswordAgain] = useState("");
  const { user } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePasswordSubmit = async () => {
    if (password.trim() === "" || passwordAgain.trim() === "") {
      setError("All fields are required");
      return;
    }
    if (password !== passwordAgain) {
      setError("Password doesn't match");
      return;
    }

    setLoading(true);

    // Prepare the request payload dynamically
    const requestData = {
      password,
      passwordAgain,
      ...(phone ? { phoneNumber: String(phone) } : { email }),
    };
    

    try {
      const { data } = await axios.post(`${URL}/auth/set-new-password`, requestData, config);
      // console.log(data)

      if (data.success) {
        setPasswordSec(false);
        setFinalMessage(true);
        setError("");
        toast.success("Password reset successful");

        navigate(user ? "/" : "/login");
      }
    } catch (error) {
      setError(error.response?.data?.error || "Something went wrong");
      console.log(error)
    } finally {
      setLoading(false);
    }
  };


  const togglePasswordVisibility = (field) => {
    if (field === "password") {
      setShowPassword(!showPassword);
    } else if (field === "confirmPassword") {
      setShowConfirmPassword(!showConfirmPassword);
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-xs md:max-w-md w-full">
      <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">
        Reset Password
      </h2>
      <p className="text-center text-gray-600 mb-6">Enter your new password</p>

      <div className="mb-6 relative">
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          New Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            name="password"
            placeholder="Enter your new password"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-main 
                           text-gray-700 placeholder-gray-400 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("password")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>

      <div className="mb-6 relative">
        <label
          htmlFor="passwordAgain"
          className="block text-gray-700 text-sm font-bold mb-2"
        >
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            id="passwordAgain"
            name="passwordAgain"
            placeholder="Enter your new password again"
            value={passwordAgain}
            onChange={(e) => setPasswordAgain(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                           focus:outline-none focus:ring-2 focus:ring-main 
                           text-gray-700 placeholder-gray-400 pr-10"
          />
          <button
            type="button"
            onClick={() => togglePasswordVisibility("confirmPassword")}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>
      </div>
      {error && <p className="my-2 text-red-400">{error}</p>}
      <button
        onClick={handlePasswordSubmit}
        disabled={loading}
        className="w-full bg-main text-white py-2 md:py-3 
                       rounded-lg font-semibold 
                       hover:bg-opacity-90 transition duration-200"
      >
        {loading ? "Loading..." : "Reset Password"}
      </button>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          Remember your password?{" "}
          <p
            onClick={() => navigate("/login")}
            className="text-main hover:underline"
          >
            Back to Login
          </p>
        </p>
      </div>
    </div>
  );
};

export default ResetPasswordSection;
