import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { URL } from "../Common/api";
import { config } from "../Common/configurations";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth } from "../utils/firebase";

const SentEmailOtpSection = ({ setEmailSec, setOTPSec, setEmail, email, setPhone, phone, setConfirmationResult, setMobileOTPSec }) => {
  const [selectedMethod, setSelectedMethod] = useState("email");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const navigate = useNavigate();
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user) {
      setEmail(user?.email || "");
      setPhone(user?.phoneNumber || "");
    }
  }, [user]);

  // Mask Email Function
  const maskEmail = (email) => {
    if (!email) return "";
    const [username, domain] = email.split("@");
    const maskedUsername =
      username.length > 2
        ? username[0] +
        username[1] +
        "*".repeat(username.length - 3) +
        username[username.length - 1]
        : username;
    return `${maskedUsername}@${domain}`;
  };

  // Mask Phone Function
  // Function to mask phone number
  const maskPhone = (phone) => {
    if (!phone) return "";
    const phoneStr = String(phone); // Ensure it's a string
    return phoneStr.replace(/(\d{2})\d{6}(\d{2})/, "$1******$2");
  };


  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);


    let payload;
    if (selectedMethod === "email" && email) {
      payload = { email };
      axios
        .post(`${URL}/auth/forget-password`, payload, config)
        .then(({ data }) => {
          if (data.success) {
            setEmailSec(false);
            setOTPSec(true);
            toast.success(data.msg);
          }
        })
        .catch(({ response }) => {
          setError(response?.data?.error || "Something went wrong");
        })
        .finally(() => {
          setLoading(false);
        });
    } else if (selectedMethod === "phone" && phone) {
      payload = { phone };

      try {

        const res = await axios.post(`${URL}/auth/forget-password-mobile`, { phoneNumber: `+${phone}` })

        if (res.status) {


          // const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
          // const confirmation = await signInWithPhoneNumber(auth, "+" + phone, recaptcha);

          // setConfirmationResult(confirmation)
          setPhone(phone)
          setEmailSec(false);
          setMobileOTPSec(true);
          toast.success("Otp sent");
        }
      } catch (err) {
        console.log(err)
      } finally {
        setLoading(false);
      }
    } else {
      setError("Please select a valid method to receive OTP.");
      return;
    }



  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8 max-w-xs md:max-w-md w-full">
      <h2 className="text-xl md:text-2xl font-bold text-center text-gray-800 mb-6">
        Reset Password
      </h2>
      <p className="text-center text-gray-600 mb-6">
        We'll send an OTP to verify your identity
      </p>

      {/* If user has both email and phone, let them select */}
      {email && phone ? (
        <div className="mb-4">
          <p className="text-gray-700 font-semibold text-center">
            Select Verification Method
          </p>
          <div className="mt-4 space-y-3">
            <label
              className={`flex items-center justify-between border-2 px-4 py-3 rounded-lg cursor-pointer transition duration-200 ${selectedMethod === "email"
                ? "border-main bg-main/10"
                : "border-gray-300 "
                }`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="verificationMethod"
                  value="email"
                  checked={selectedMethod === "email"}
                  onChange={() => setSelectedMethod("email")}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 flex items-center justify-center border-2 rounded-full ${selectedMethod === "email" ? "border-main" : "border-gray-400"
                    }`}
                >
                  {selectedMethod === "email" && (
                    <div className="w-3 h-3 bg-main rounded-full"></div>
                  )}
                </div>
                <span className="text-gray-700 font-regular">{maskEmail(email)}</span>
              </div>
            </label>

            <label
              className={`flex items-center justify-between border-2 px-4 py-3 rounded-lg cursor-pointer transition duration-200 ${selectedMethod === "phone"
                ? "border-main bg-main/10"
                : "border-gray-300 "
                }`}
            >
              <div className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="verificationMethod"
                  value="phone"
                  checked={selectedMethod === "phone"}
                  onChange={() => setSelectedMethod("phone")}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 flex items-center justify-center border-2 rounded-full ${selectedMethod === "phone" ? "border-main" : "border-gray-400"
                    }`}
                >
                  {selectedMethod === "phone" && (
                    <div className="w-3 h-3 bg-main rounded-full"></div>
                  )}
                </div>
                <span className="text-gray-700 font-regular">{maskPhone(phone)}</span>
              </div>
            </label>
          </div>
        </div>

      ) : (
        // If user has only email or only phone, show only that method
        <div className="mb-4 text-center">
          <p className="text-gray-700 font-semibold">Confirm Your Identity</p>
          {email && <p className="text-gray-500 mt-2">{maskEmail(email)}</p>}
          {phone && <p className="text-gray-500 mt-2">{maskPhone(phone)}</p>}
        </div>
      )}

      {error && <p className="my-2 text-red-400 text-center">{error}</p>}
      {/* reCAPTCHA div - hidden after OTP is sent */}
      {<div id='recaptcha' className="mb-4"></div>}
      <button
        onClick={handleOtpSubmit}
        disabled={loading}
        className="w-full bg-main text-white py-2 md:py-3 rounded-lg font-semibold mt-4 hover:bg-opacity-90 transition duration-200"
      >
        {loading ? "Sending..." : "Send OTP"}
      </button>

      <div className="text-center mt-6">
        <p className="text-gray-600">
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
  );
};

export default SentEmailOtpSection;
