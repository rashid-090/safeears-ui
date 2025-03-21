import React, { useEffect, useState } from "react";
import { logo } from "../../assets";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../redux/actions/userActions";
import { updateError } from "../../redux/reducers/userSlice";

const AdminLogin = () => {
  const { user, loading, error } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  



  const schema = yup.object().shape({
    email: yup
      .string()
      .email("Email is not valid")
      .required("Please enter the email."),
    password: yup
      .string()
      .min(4, "Password must be at least 4 characters.")
      .max(15, "Password is too logn.")
      .required("Please enter the password."),
  });
  useEffect(() => {
    if (user) {
      if (!user.isEmailVerified) {
        navigate("/otp");
      } else {
        navigate("/");
      }
    }
    return () => {
      dispatch(updateError(""));
    };
  }, [user]);

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    dispatch(loginUser(data));

    console.log(data);
  };

  return (
    <section className="h-screen w-full flex justify-center items-center ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="pt-10 p-5 flex flex-col gap-5 bg-white text-black w-[95%] xl:w-[380px] shadow-2xl rounded-2xl pb-5"
      >
        <div className="bg-black p-3 grid place-items-center rounded-2xl -mt-16 w-[90%] mx-auto shadow-xl">
          <img className="h-20 object-cover" src={logo} alt="Logo" />
        </div>
        <div>
          <input
            className="border-2 w-full p-2 rounded-md outline-none placeholder:text-sm"
            type="email"
            placeholder="Email"
            {...register("email")}
          />
          <p className="w-full h-5 text-sm text-red-600">
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
          <p className="w-full h-5 text-sm text-red-600">
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
          className={`bg-main p-2 rounded-md text-black uppercase font-semibold mt-7 ${
            loading && "cursor-not-allowed"
          }`}
        >
          {loading ? "Loggin in" : "Login"}
        </button>
      </form>
    </section>
  );
};

export default AdminLogin;
