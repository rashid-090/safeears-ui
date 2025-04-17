// components/AddressForm.js
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaRupeeSign } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { createAddress, updateAddress } from "../redux/actions/user/addressActions";
import { getCart } from "../redux/actions/user/cartActions";

const AddressForm = ({ initialValues, onCancel, isEditing }) => {
  const schema = yup.object().shape({
    name: yup.string().required(),
    phoneNumber: yup
      .number("Enter correct mobile number.")
      .min(10, "Enter correct mobile number.")
      .required("Enter mobile number"),
    pinCode: yup
      .number()
      .required("Required")
      .moreThan(99999, "Pin code should be at-least 6 digit")
      .typeError("Pin code should be digits"),
    locality: yup.string().required(),
    address: yup.string().required(),
    addressType: yup.string().nullable(),
    city: yup.string().required("Required"),
    state: yup.string().required(),
    landMark: yup.string(),
    alternatePhoneNumber: yup.string(),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialValues,
  });

  const dispatch = useDispatch();
  const onSubmit = (data) => {
    try {
      console.log(data)
      const id = data._id
      dispatch(updateAddress({ id, formData: data }));
      dispatch(getCart());

    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="p-4 border mb-1 border-main flex flex-col items-center gap-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid grid-cols-1 md:grid-cols-2 gap-y-5 gap-3 w-full"
      >
        <div>
          <input
            className="border p-2 py-3 outline-none"
            type="text"
            placeholder="Name"
            {...register("name")}
          />
          <p className="w-full h-5 text-red-600">{errors.name?.message}</p>
        </div>
        <div>
          <input
            className="border p-2 py-3 outline-none"
            type="text"
            placeholder="10-digit mobile number"
            {...register("phoneNumber")}
          />
          <p className="w-full h-5 text-red-600">{errors.phoneNumber?.message}</p>
        </div>
        {
          console.log(errors)
        }
        <div>
          <input
            className="border p-2 py-3 outline-none"
            type="text"
            placeholder="Pincode"
            {...register("pinCode")}
          />
          <p className="w-full h-5 text-red-600">{errors.pinCode?.message}</p>
        </div>
        <div>
          <input
            className="border p-2 py-3 outline-none"
            type="text"
            placeholder="Locality"
            {...register("locality")}
          />
          <p className="w-full h-5 text-red-600">{errors.locality?.message}</p>
        </div>
        <div>
          <input
            className="border p-2 py-3 outline-none"
            type="text"
            placeholder="Address (Area and Street)"
            {...register("address")}
          />
          <p className="w-full h-5 text-red-600">{errors.address?.message}</p>
        </div>
        <div className="flex gap-10">
          <span className="flex items-center gap-2">
            <input
              id="home"
              type="radio"
              value="home"

              {...register("addressType")}
            />
            <label htmlFor="home" className="hover:cursor-pointer">
              Home
            </label>
          </span>
          <span className="flex items-center gap-2">
            <input
              id="work"
              type="radio"
              value="work"
              {...register("addressType")}
            />
            <label htmlFor="work" className="hover:cursor-pointer">
              Work
            </label>
          </span>
        </div>
        <div>
          <input
            className="border p-2 py-3 outline-none"
            type="text"
            placeholder="City/District/Town"
            {...register("city")}
          />
          <p className="w-full h-5 text-red-600">{errors.city?.message}</p>
        </div>
        <div>
          <input
            className="border p-2 py-3 outline-none"
            type="text"
            placeholder="State"
            {...register("state")}
          />
          <p className="w-full h-5 text-red-600">{errors.state?.message}</p>
        </div>
        <div>
          <input
            className="border p-2 py-3 outline-none"
            type="text"
            placeholder="Landmark (Optional)"
            {...register("landMark")}
          />
          <p className="w-full h-5 text-red-600">{errors.landMark?.message}</p>
        </div>
        <div>
          <input
            className="border p-2 py-3 outline-none"
            type="text"
            placeholder="Alternate Phone (Optional)"
            {...register("alternatePhoneNumber")}
          />
          <p className="w-full h-5 text-red-600">
            {errors.alternatePhoneNumber?.message}
          </p>
        </div>
        <div className="flex gap-4">
          <button
            type="submit"
            className="w-fit px-5 bg-main text-black font-semibold py-2 rounded-md"
          >
            {isEditing ? "Update" : "Save"}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="w-fit px-5 bg-gray-200 text-black font-semibold py-2 rounded-md"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddressForm;