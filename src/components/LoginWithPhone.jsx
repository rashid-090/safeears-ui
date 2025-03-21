import React, { useState } from 'react';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css'; // Import the required CSS for the phone input
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from '../utils/firebase'; // Updated import path
import { ClipLoader } from 'react-spinners'; // Import the ClipLoader for loading spinner
import axios from 'axios';
import { URL } from '../Common/api';
import { useNavigate } from 'react-router-dom';
import { loginUserWithPhone } from '../redux/actions/userActions';
import { useDispatch } from 'react-redux';

const LoginWithPhone = () => {
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [verificationCode, setVerificationCode] = useState('');
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [isOtpVerified, setIsOtpVerified] = useState(false); // To track if OTP is verified
    const [createUser, setCreateUser] = useState(false);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [otpError, setOtpError] = useState(''); // For handling OTP errors
    const [isLoading, setIsLoading] = useState(false); // To handle loading state for buttons


    const dispatch = useDispatch();
    const navigate = useNavigate()
    // Send OTP to the provided phone number
    const sendOtp = async () => {
        console.log("Phone number", phoneNumber);

        try {
            setIsLoading(true); // Set loading state to true when the OTP is being sent
            // Initialize reCAPTCHA verifier
            // const recaptcha = new RecaptchaVerifier(auth, "recaptcha", {});
            // const confirmation = await signInWithPhoneNumber(auth, phoneNumber, recaptcha);
            // setConfirmationResult(confirmation);

            const res = await axios.post(`${URL}/auth/forget-password-mobile`, { phoneNumber })
            if (res.status) {
                setIsOtpSent(true);
                setOtpError(''); // Clear any previous OTP errors
                setIsLoading(false); // Stop loading once OTP is sent
            }


        } catch (err) {
            console.error('Error sending OTP:', err);
            setIsLoading(false); // Stop loading if an error occurs
        }
    };

    // Verify OTP and log the user in
    const verifyOtp = async () => {
        setIsLoading(true); // Show loading indicator

        try {
            const res = await axios.post(`${URL}/auth/validate-otp`, { email: phoneNumber, otp: verificationCode })

            if (res.status) {
                axios.post(`${URL}/auth/validate-phone`, { phoneNumber })
                    .then((res) => {
                        console.log(res.data.status);

                        if (res.data.status === "exists") {
                            // If user exists, log them in
                            dispatch(loginUserWithPhone({ phoneNumber })) // Same function as email login
                                .then(() => {
                                    navigate('/');
                                })
                                .catch((err) => console.log(err));
                        } else {
                            // If user doesn't exist, ask for first name and last name
                            setCreateUser(true);
                        }
                    })
                    .catch((err) => console.log(err));

                setIsOtpVerified(true);
                setOtpError('');
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setOtpError('Incorrect OTP. Please try again.');
            setIsLoading(false);
        } finally {

        }

        // confirmationResult.confirm(verificationCode)
        //     .then((result) => {
        //         console.log('User verified:', result.user);

        //         axios.post(`${URL}/auth/validate-phone`, { phoneNumber })
        //             .then((res) => {
        //                 console.log(res.data.status);

        //                 if (res.data.status === "exists") {
        //                     // If user exists, log them in
        //                     dispatch(loginUserWithPhone({ phoneNumber })) // Same function as email login
        //                         .then(() => {
        //                             navigate('/');
        //                         })
        //                         .catch((err) => console.log(err));
        //                 } else {
        //                     // If user doesn't exist, ask for first name and last name
        //                     setCreateUser(true);
        //                 }
        //             })
        //             .catch((err) => console.log(err));

        //         setIsOtpVerified(true);
        //         setOtpError('');
        //         setIsLoading(false);
        //     })
        //     .catch((error) => {
        //         console.error('Error verifying OTP:', error);
        //         setOtpError('Incorrect OTP. Please try again.');
        //         setIsLoading(false);
        //     });
    };

    // Handle name input submission
    const handleNameSubmit = () => {
        dispatch(loginUserWithPhone({ phoneNumber, firstName, lastName })) // Same function as email login
            .then(() => {
                // navigate('/');
                // window.location.reload()
            })
            .catch((err) => console.log(err));


    };

    return (
        <div className="flex flex-col items-center justify-center p-4">
            <h3 className="text-2xl font-semibold text-gray-800 mb-6">Login/Signup<br/> with Mobile Number</h3>

            {/* Phone number input with country code set to India */}
            {!isOtpSent && !isOtpVerified && (
                <div className="w-full max-w-xs mb-4">
                    <PhoneInput
                        placeholder="Enter your mobile number"
                        value={phoneNumber}
                        onChange={setPhoneNumber}
                        defaultCountry="IN"
                        className="w-full p-3 border-2 border-gray-300 rounded-md focus:ring-0 "
                    />
                </div>
            )}

            {/* Message when OTP is sent */}
            {isOtpSent && !isOtpVerified && (
                <div className="text-center text-gray-700 mb-4">
                    OTP sent to <strong>{phoneNumber}</strong>. Please check your messages.
                </div>
            )}

            {/* reCAPTCHA div - hidden after OTP is sent */}
            {!isOtpSent && <div id='recaptcha' className="mb-4"></div>}

            {/* Button to send OTP */}
            {!isOtpSent && !isOtpVerified ? (
                <button
                    disabled={!phoneNumber || isLoading} // Disable if no phone number is entered or if loading
                    onClick={sendOtp}
                    className="w-full max-w-xs bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 disabled:bg-gray-300"
                >
                    {isLoading ? (
                        <ClipLoader size={20} color="white" loading={isLoading} />
                    ) : (
                        'Send OTP'
                    )}
                </button>
            ) : null}

            {/* OTP Input and error message */}
            {isOtpSent && !isOtpVerified && (
                <div className="w-full max-w-xs mb-4">
                    <input
                        type="text"
                        placeholder="Enter OTP"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        className="w-full p-3 border-2 border-gray-300 rounded-md mb-4"
                    />
                    <button
                        onClick={verifyOtp}
                        className="w-full max-w-xs bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        disabled={isLoading} // Disable if loading
                    >
                        {isLoading ? (
                            <ClipLoader size={20} color="white" loading={isLoading} />
                        ) : (
                            'Verify OTP'
                        )}
                    </button>
                    {/* Show OTP error message if OTP is incorrect */}
                    {otpError && <div className="text-red-500 text-sm mt-2">{otpError}</div>}
                </div>
            )}

            {/* Name input form after OTP is verified */}
            {(isOtpVerified && createUser) && (
                <div className="w-full max-w-xs mt-4">
                    <input
                        className="border-2 w-full p-2 rounded-md outline-none placeholder:text-sm mb-4"
                        type="text"
                        placeholder="Your First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <input
                        className="border-2 w-full p-2 rounded-md outline-none placeholder:text-sm mb-4"
                        type="text"
                        placeholder="Last name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <button
                        onClick={handleNameSubmit}
                        className="w-full max-w-xs bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        Create Account
                    </button>
                </div>
            )}
        </div>
    );
};

export default LoginWithPhone;
