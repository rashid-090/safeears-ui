import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { URL } from "../Common/api";
import { config } from "../Common/configurations";
import { useNavigate } from "react-router-dom";

const EnterEmailSection = ({ email, setEmail, setEmailSec, setOTPSec }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (email.trim() === "") {
      setError("Enter an email to continue");
      return;
    }
    setLoading(true);
    axios
      .post(`${URL}/auth/forget-password`, { email }, config)
      .then(({ data }) => {
        if (data.success) {
          setEmailSec(false);
          setOTPSec(true);
          setLoading(false);
          toast.success(data.msg);
        }
      })
      .catch(({ response }) => {
        setError(response.data.error);
        setLoading(false);
      });
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-xs md:max-w-md w-full">
      <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">
        Forgot Password
      </h2>
      <p className="text-center text-gray-600 mb-6">
        Enter your email to reset your password
      </p>
      <form>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg 
                     focus:outline-none focus:ring-2 focus:ring-main 
                     text-gray-700 placeholder-gray-400"
          />
        </div>
        {error && <p className="my-2 text-red-400">{error}</p>}
        <button
          onClick={handleEmailSubmit}
          disabled={loading}
          className="w-full bg-main text-white py-2 md:py-3 
                   rounded-lg font-semibold 
                   hover:bg-opacity-90 transition duration-200"
        >
          Send OTP
        </button>
      </form>
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

export default EnterEmailSection;
