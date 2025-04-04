import React, { useState } from "react";
import UserAvatar from "../assets/images/user.png";
import "react-phone-number-input/style.css"; // Import the required CSS for the phone input
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import PhoneInput from "react-phone-number-input";
import { useDispatch, useSelector } from "react-redux";
import { getPassedDateOnwardDateForInput } from "../Common/functions";
import { editUserProfile } from "../redux/actions/userActions";
import { cloudinary } from "../utils/cloudinaryBaseUrl";

const Profile = () => {
  const dispatch = useDispatch();
  const { user, loading, error } = useSelector((state) => state.user);

  const [imagePreview, setImagePreview] = useState();
  const [imageFile, setImageFile] = useState(null);

  const initialValues = {
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    email: user.email || "",
    phoneNumber: `+${user.phoneNumber}` || "",
    dateOfBirth: getPassedDateOnwardDateForInput(user.dateOfBirth) || "",
  };

  const schema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string()
      .required("Phone number is required")
      .matches(/^\+[1-9]\d{1,14}$/, "Enter a valid phone number"),
    dateOfBirth: Yup.date()
      .nullable()
      .typeError("Invalid date format. Please select a valid date."),
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  const phoneNumber = watch("phoneNumber"); // Watch phoneNumber value

  const onSubmit = (data) => {
    const formData = new FormData();
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("dateOfBirth", data.dateOfBirth);

    if (imageFile) {
      formData.append("profileImgURL", imageFile);
    }

    dispatch(editUserProfile(formData));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <section className="w-11/12 xl:w-10/12 mx-auto h-full overflow-hidden py-10 text-white">
      <div className="p-4">
        <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 text-white">
          <div className="flex flex-col md:flex-row md:items-center gap-5">
            <img
              className="h-40 w-40 rounded-md border-2 object-cover"
              src={
                imagePreview
                  ? imagePreview
                  : user.profileImgURL
                  ? `${cloudinary}/${user.profileImgURL}`
                  : UserAvatar
              }
              alt="Profile"
            />
            <label className="block">
              <span className="capitalize">Update Profile Photo</span>
              <input
                type="file"
                className="block pt-3 w-full text-sm 
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-violet-50 file:text-violet-700
                  hover:file:bg-violet-100"
                accept="image/*"
                onChange={handleFileChange}
              />
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block font-semibold mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-main"
                {...register("firstName")}
              />
              <p className="text-red-600 pt-1">{errors.firstName?.message}</p>
            </div>
            <div>
              <label htmlFor="lastName" className="block font-semibold mb-1">
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-main"
                {...register("lastName")}
              />
              <p className="text-red-600 pt-1">{errors.lastName?.message}</p>
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block font-semibold mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-main"
              {...register("email")}
            />
            <p className="text-red-600 pt-1">{errors.email?.message}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="phoneNumber" className="block font-semibold mb-1">
                Phone Number
              </label>
              <PhoneInput
                id="phoneNumber"
                name="phoneNumber"
                defaultCountry="IN"
                className="w-full p-3 border-2 border-gray-300 text-black rounded-md focus:ring-0"
                value={phoneNumber}
                onChange={(value) => setValue("phoneNumber", value)}
              />
              <p className="text-red-600 pt-1">{errors.phoneNumber?.message}</p>
            </div>
            <div>
              <label htmlFor="dateOfBirth" className="block font-semibold mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-main"
                {...register("dateOfBirth")}
              />
              <p className="text-red-600 pt-1">{errors.dateOfBirth?.message}</p>
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2 bg-main text-white rounded-md hover:bg-main-dark"
            disabled={loading}
          >
            {loading ? "Loading..." : "Edit Profile"}
          </button>
          {error && <p className="text-red-400">{error}</p>}
        </form>
      </div>
    </section>
  );
};

export default Profile;
