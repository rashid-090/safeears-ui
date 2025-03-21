import React, { useState } from "react";
import UserAvatar from "../assets/images/user.png";

import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";

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
    phoneNumber: user.phoneNumber || "",
    dateOfBirth: getPassedDateOnwardDateForInput(user.dateOfBirth) || "",
  };

  const schema = Yup.object().shape({
    firstName: Yup.string().required("First Name is required"),
    lastName: Yup.string().required("Last Name is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    phoneNumber: Yup.string() // Use string first
      .transform((value) => (value.trim() === "" ? null : value)) // Transform empty strings to null
      .nullable() // Allow null values
      .matches(/^\d+$/, "Phone number should be digits") // Ensure it's only digits
      .min(10, "Phone number should be at least 10 digits") // Validate length
      .max(15, "Phone number should be at most 15 digits") // Optional: Maximum length
      .notRequired(), // Allow empty values if desired

    dateOfBirth: Yup.date()
      .nullable()
      .typeError("Invalid date format. Please select a valid date."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  // Handle form submission
  const onSubmit = (data) => {
    const formData = new FormData();

    // Append the form fields
    formData.append("firstName", data.firstName);
    formData.append("lastName", data.lastName);
    formData.append("email", data.email);
    formData.append("phoneNumber", data.phoneNumber);
    formData.append("dateOfBirth", data.dateOfBirth);

    // Append the image file if it exists
    if (imageFile) {
      formData.append("profileImgURL", imageFile);
    }

    console.log([...formData.entries()]); // For debugging: View FormData content

    // Dispatch the action
    dispatch(editUserProfile(formData));
  };

  // Handle file change
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 text-white"
        >
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

          {/* Profile fields */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="firstName" className="block font-semibold mb-1">
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                defaultValue={initialValues.firstName}
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
                defaultValue={initialValues.lastName}
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
              defaultValue={initialValues.email}
              className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-main"
              {...register("email")}
            />
            <p className="text-red-600 pt-1">{errors.email?.message}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label for="phoneNumber" className="block font-semibold mb-1">
                Phone number
              </label>
              <input
                type="number"
                id="phoneNumber"
                name="phoneNumber"
                defaultValue={initialValues.phoneNumber}
                className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-main [&::-webkit-inner-spin-button]:appearance-none"
                {...register("phoneNumber")}
              />
              <p className="w-full h-5 text-nowrap text-red-600 pt-1">
                {errors.phoneNumber?.message}
              </p>
            </div>
            <div>
              <label for="dateOfBirth" className="block font-semibold mb-1">
                Date of Birth
              </label>
              <input
                type="date"
                id="dateOfBirth"
                name="dateOfBirth"
                defaultValue={initialValues.dateOfBirth||""}
                className="w-full p-2 border border-gray-300 rounded-md outline-none focus:ring-2 focus:ring-main"
                {...register("dateOfBirth")}
              />
              <p className="w-full h-5 text-nowrap text-red-600 pt-1">
                {errors.dateOfBirth?.message}
              </p>
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
