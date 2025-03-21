import React from "react";
import { signUpUser } from "../redux/actions/userActions";

import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const SignUp = ({
  setPasswordVisible,
  passwordVisible,
  setConfirmPasswordVisible,
  confirmPasswordVisible,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, loading, error } = useSelector((state) => state.user);

  const schema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email().required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
      ),
    passwordAgain: Yup.string()
      .required("Password is required")
      .oneOf([Yup.ref("password"), null], "Password must match"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const dispatchSignUp = async (data) => {
    let formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("passwordAgain", data.passwordAgain);
    formData.append("phoneNumber", data.phoneNumber);
    if (data.profileImgURL) {
      formData.append("profileImgURL", data.profileImgURL);
    }

    const res = await dispatch(signUpUser(data));
    console.log(res);
  };

  const onSubmit = (value) => {
    console.log(value);
    dispatchSignUp(value);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="pt-10 p-5 flex flex-col gap-5"
    >
      <div>
        <input
          className="border-2 w-full p-2 rounded-md outline-none placeholder:text-sm"
          type="text"
          placeholder="First Name"
          {...register("firstName")}
        />
        <p className="w-full h-5  text-left text-sm text-red-600">
          {errors.firstName?.message}
        </p>
      </div>
      <div>
        <input
          className="border-2   w-full p-2 rounded-md outline-none placeholder:text-sm"
          type="text"
          placeholder="Last Name"
          {...register("lastName")}
        />
        <p className="w-full h-5 text-left text-sm text-red-600">
          {errors.lastName?.message}
        </p>
      </div>
      <div>
        <input
          className="border-2 w-full p-2 rounded-md outline-none placeholder:text-sm"
          type="email"
          placeholder="Email"
          {...register("email")}
        />
        <p className="w-full text-left h-5 text-sm text-red-600">
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
        <p className="w-full text-left h-5 text-sm text-red-600">
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
      <div className="relative">
        <input
          className="border-2 w-full p-2 rounded-md outline-none placeholder:text-sm"
          type={confirmPasswordVisible ? "text" : "password"}
          placeholder="Re-Type Password"
          {...register("passwordAgain")}
        />
        <p className="w-full text-left h-5 text-sm text-red-600">
          {errors.passwordAgain?.message}
        </p>
        <button
          type="button"
          className="absolute right-2 top-2 text-gray-500"
          onClick={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
        >
          {confirmPasswordVisible ? "🙈" : "👁️"}
        </button>
      </div>
      <button
        type="submit"
        className="bg-main p-2 rounded-md text-black uppercase font-semibold mt-7"
      >
        Sign Up
      </button>
      {error && <p className="my-2 text-red-400">{error}</p>}
    </form>
  );
};

export default SignUp;
