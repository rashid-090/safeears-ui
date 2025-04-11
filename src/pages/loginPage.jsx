import React, { useEffect, useState } from "react";
import { logo } from "../assets";
import { Link, useNavigate } from "react-router-dom";
import SignUp from "../components/SignUp";
import { useDispatch, useSelector } from "react-redux";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginUser } from "../redux/actions/userActions";
import { updateError } from "../redux/reducers/userSlice";
import { toast } from "react-hot-toast";
import LoginWithPhone from "../components/LoginWithPhone";

const LoginPage = () => {
  const { user, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Email is not valid")
      .required("Please enter the email."),
    password: yup
      .string()
      .min(4, "Password must be at least 4 characters.")

      .required("Please enter the password."),
  });

  useEffect(() => {
    if (user) {
      navigate("/");
    }
    return () => {
      dispatch(updateError(""));
    };
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    const res = await dispatch(loginUser(data));

    // console.log(res);
    // if (res.error) {
    //   toast.error(res.payload);
    // } else {
    //   toast.success("Login success");
    // }
  };

  const [authMethod, setAuthMethod] = useState("login")
  const [isLogin, setIsLogin] = useState(true);
  const [isLoginWithPhone, setIsLoginWithPhone] = useState(false)
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // Always initialize, even if not used in login form.

  return (
    <section className="w-11/12 xl:w-10/12 mx-auto h-screen flex flex-col justify-center items-center py-10">
      <div className="bg-white text-black text-center w-[95%] xl:w-[380px] shadow-2xl rounded-2xl pb-5">
        <div className="bg-black p-3 grid place-items-center rounded-2xl -mt-5 w-[90%] mx-auto shadow-xl">
          <Link to="/">
            <img className="h-20 object-cover" src={logo} alt="Logo" />
          </Link>
        </div>
        {authMethod === "login" ? (
          <form
            className="pt-10 p-5 flex flex-col gap-2"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div>
              <input
                className="border-2 w-full p-2 rounded-md outline-none placeholder:text-sm"
                type="email"
                placeholder="Email"
                {...register("email")}
              />
              <p className="w-full h-5 text-sm text-left py-2 text-red-600">
                {errors.email?.message}
              </p>
            </div>
            <div className="relative">
              <input
                className="border-2 w-full p-2 rounded-md outline-none placeholder:text-sm"
                type={passwordVisible ? "text" : "password"}
                placeholder="Password"
                {...register("password")}
              />
              <p className="w-full h-5 text-left py-2 text-sm text-red-600">
                {errors.password?.message}
              </p>
              <button
                type="button"
                className="absolute right-2 top-2 text-gray-500"
                onClick={() => setPasswordVisible(!passwordVisible)}
              >
                {passwordVisible ? "🙈" : "👁️"}
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className={`bg-main p-2 rounded-md text-black uppercase font-semibold mt-2 ${loading && "cursor-not-allowed"
                }`}
            >
              {loading ? "Loggin in" : "Login"}
            </button>
            {error && <p className="my-2 text-red-400">{error}</p>}
            <p
              className=" text-sm  text-blue-500 mt-2 underline hover:cursor-pointer"
              onClick={() => setAuthMethod("loginWithPhone")}
            >
              Login with Phone Number
            </p>
            <p
              className=" text-sm   hover:underline hover:cursor-pointer"
              onClick={() => navigate("/forgot-password")}
            >
              Forgot password?
            </p>
          </form>
        ) : authMethod === "signup" ? (
          <SignUp
            passwordVisible={passwordVisible}
            setPasswordVisible={setPasswordVisible}
            confirmPasswordVisible={confirmPasswordVisible}
            setConfirmPasswordVisible={setConfirmPasswordVisible}
          />
        )
          : authMethod === "loginWithPhone" ?
            <LoginWithPhone/> : ""

        }
        <span className="text-xs">
          {authMethod==="login" ? (
            <>
              Don't have an account?{" "}
              <button
                onClick={() => setAuthMethod("signup")}
                className="font-semibold text-blue-500 hover:underline"
              >
                Sign Up
              </button>
            </>
          ) :authMethod==="signup"? (
            <>
               <p
              className=" text-sm text-blue-500 mb-2 underline hover:cursor-pointer"
              onClick={() => setAuthMethod("loginWithPhone")}
            >
              Signup with Phone Number
            </p>
              Already have an account?{" "}
              <button
                onClick={() => setAuthMethod("login")}
                className="font-semibold text-blue-500 hover:underline"
              >
                Log In
              </button>
            </>
          ):authMethod==="loginWithPhone"?
          <>
          Already have an account?{" "}
          <button
            onClick={() => setAuthMethod("login")}
            className="font-semibold text-blue-500 hover:underline"
          >
            Log in with Email
          </button>
        </>: ""
        }
        </span>
      </div>
    </section>
  );
};

export default LoginPage;
