import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import OTPSection from "../components/OTPSection";
import EnterEmailSection from "../components/EnterEmailSection";
import ResetPasswordSection from "../components/ResetPasswordSection";
import SentEmailOtpSection from "../components/SentEmailOtpSection";
import { useSelector } from "react-redux";
import MobileOTPSection from "../components/MobileOTPSection";

const ForgotPassword = () => {
  const { user, loading } = useSelector((state) => state.user);

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmationResult, setConfirmationResult] = useState()

  const [emailSec, setEmailSec] = useState(true);
  const [otpSec, setOTPSec] = useState(false);
  const [mobileOTPSec, setMobileOTPSec] = useState(false);
  const [passwordSec, setPasswordSec] = useState(false);
  const [finalMessage, setFinalMessage] = useState(false);
  const [otpExpired, setOTPExpired] = useState(false);

  const [userLoggedIn, setUserLoggedIn] = useState(false);

  useEffect(() => {
    if (user) {
      setUserLoggedIn(true);
    } else {
      setUserLoggedIn(false);
    }
  }, [user, loading]);



  return (
    <div className="bg-gradient-to-r from-[#007669] via-[#00726f] to-[#006b7c] flex items-center justify-center min-h-[80vh]">
      {loading && <p>Loading...</p>}
      {emailSec && userLoggedIn && (
        <SentEmailOtpSection
          setConfirmationResult={setConfirmationResult}
          setEmailSec={setEmailSec}
          setOTPSec={setOTPSec}
          email={email}
          setEmail={setEmail}
          setPhone={setPhone}
          phone={phone}
          setMobileOTPSec={setMobileOTPSec}
        />
      )}

      {emailSec && !userLoggedIn && (
        <EnterEmailSection
          setEmailSec={setEmailSec}
          setOTPSec={setOTPSec}
          email={email}
          setEmail={setEmail}
        />
      )}

      {otpSec && (
        <OTPSection
          email={email}
          setOTPSec={setOTPSec}
          setPasswordSec={setPasswordSec}
          setOTPExpired={setOTPExpired}
        />
      )}
      {mobileOTPSec && (
        <MobileOTPSection
          setMobileOTPSec={setMobileOTPSec}
          confirmationResult={confirmationResult}
          phone={phone}
          setOTPSec={setOTPSec}
          setPasswordSec={setPasswordSec}
          setOTPExpired={setOTPExpired}
        />
      )}
      {passwordSec && (
        <ResetPasswordSection
          phone={phone}
          email={email}
          setFinalMessage={setFinalMessage}
          setPasswordSec={setPasswordSec}
        />
      )}
    </div>
  );
};

export default ForgotPassword;
