import { useEffect, useState } from "react";
import { IoIosStar } from "react-icons/io";
import { FaRupeeSign } from "react-icons/fa";
import { FiMinus } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import { BsFillTrash3Fill } from "react-icons/bs";
import { logo } from "../assets";

import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import {
  createAddress,
  getAddresses,
} from "../redux/actions/user/addressActions";
import CheckoutAddressRow from "../components/CheckoutAddressRow";
import {
  decrementCount,
  getCart,
  incrementCount,
} from "../redux/actions/user/cartActions";
import CheckoutPaymentOption from "../components/CheckoutPaymentOption";
import { toast } from "react-toastify";
import axios from "axios";
import { URL } from "../Common/api";
import { config } from "../Common/configurations";
import Loading from "../components/Loading";
import { useNavigate } from "react-router-dom";
import { clearCartOnOrderPlaced } from "../redux/reducers/user/cartSlice";
import SingleProductOnCheckOut from "../components/SingleProductOnCheckOut";
import ClipLoader from "react-spinners/ClipLoader";

const Orders = () => {
  const [activeStep, setActiveStep] = useState(2);

  const [selectedAddress, setSelectedAddress] = useState("");
  const [selectedPayment, setSelectedPayment] = useState("");

  // Page switing
  const [orderPlacedLoading, setOrderPlacedLoading] = useState(false);
  const [orderData, setOrderData] = useState(false);

  const navigate = useNavigate();

  const initialValues = {
    name: "",
    phoneNumber: "",
    pinCode: "",
    locality: "",
    address: "",
    addressType: "",
    city: "",
    state: "",
    landMark: "",
    alternatePhoneNumber: "",
  };

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
    addressType: yup.string(),
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
  });

  const { addresses, loading } = useSelector((state) => state.address);
  const { cart, cartId, totalPrice, totalMrpPrice } = useSelector(
    (state) => state.cart
  );

  const finalTotal = totalPrice;

  // Function to calculate total savings
  function calculateSavings(mrpPrice, salePrice) {
    if (!mrpPrice || !salePrice) {
      console.error("Both MRP and Sale Price are required");
      return 0;
    }
    const savings = mrpPrice - salePrice;
    return savings > 0 ? savings : 0; // Ensure no negative savings
  }

  // Navigate to order-confirmation

  const navigateToOrderConfirmation = (orderD) => {
    if (orderD) {
      navigate("/order-confirmation", { state: orderD });
    }
  };

  const dispatch = useDispatch();
  const onSubmit = (data) => {
    try {
      dispatch(createAddress(data));
      dispatch(getCart());

      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    dispatch(getAddresses());
  }, []);

  const [createAddresses, setCreateAddresses] = useState(false);

  useEffect(() => {
    if (addresses.length > 0) {
      setSelectedAddress(addresses[0]._id);
    }
    setCreateAddresses(false);
  }, [addresses]);

  const handleSelectedPayment = (e) => {
    setSelectedPayment(e.target.value);
  };

  // Saving the order to db
  const saveOrder = async (response) => {
    setOrderPlacedLoading(true);

    try {
      // Make the first POST request to create the order
      const orderResponse = await axios.post(
        `${URL}/user/order`,
        {
          address: selectedAddress,
          paymentMode: selectedPayment,
        },
        config
      );

      const { order } = orderResponse.data;

      // Make the second POST request to verify payment with Razorpay and save that to database
      await axios.post(
        `${URL}/user/razor-verify`,
        { ...response, order: order._id },
        config
      );

      // Updating user side
      setOrderData(true);
      toast.success("Order Placed");
      setOrderPlacedLoading(false);
      // setConfirmationPage(true);
      navigateToOrderConfirmation(order);
      dispatch(clearCartOnOrderPlaced());
    } catch (error) {
      // Error Handling
      console.log(error);
      const errorMessage =
        error.response?.data?.error ||
        "Something went wrong. Please try again.";
      toast.error(errorMessage);
      setOrderPlacedLoading(false);
    }
  };

  // Initiating razor pay payment method or window
  const initiateRazorPayPayment = async () => {
    // Getting razor-pay secret key
    const {
      data: { key },
    } = await axios.get(`${URL}/user/razor-key`, config);

    // Convert total to paisa (multiply by 100)
    const amountInPaisa = Math.round(finalTotal * 100);

    // making razor-pay order
    const {
      data: { order },
    } = await axios.post(
      `${URL}/user/razor-order`,
      { amount: amountInPaisa }, // Send amount in paisa
      config
    );

    // setting razor pay configurations
    let options = {
      key: key,
      amount: amountInPaisa, // Use the same amount in paisa
      currency: "INR",
      name: "SafeEars",
      description: "Test Transaction",
      image: { logo },
      order_id: order.id,
      handler: function (response) {
        saveOrder(response);
      },
      prefill: {
        name: "Gaurav Kumar",
        email: "gaurav.kumar@example.com",
        contact: "9000090000",
      },
      notes: {
        address: "Razor pay Corporate Office",
      },
      theme: {
        color: "#2b2b30",
      },
    };

    // enabling razor-pay payment screen
    const razor = new window.Razorpay(options);

    razor.open();

    // If failed toast it.
    razor.on("payment.failed", function (response) {
      toast.error(response.error.code);
      toast.error(response.error.description);
      toast.error(response.error.source);
      toast.error(response.error.step);
      toast.error(response.error.reason);
      toast.error(response.error.metadata.order_id);
      toast.error(response.error.metadata.payment_id);
      setOrderPlacedLoading(false);
    });
  };

  const placeOrder = async () => {
    // Validating before placing an order
    if (cart.length === 0) {
      toast.error("Add product to cart");
      return;
    }
    if (!selectedAddress) {
      toast.error("Delivery address not found");
      return;
    }
    if (!selectedPayment) {
      toast.error("Please select a payment mode");
      return;
    }

    console.log("cart", cart);
    console.log("Address", selectedAddress);
    console.log("Payment", selectedPayment);

    if (selectedPayment === "razorPay") {
      initiateRazorPayPayment();
      return;
    }

    if (
      selectedPayment === "cashOnDelivery" ||
      selectedPayment === "myWallet"
    ) {
      saveOrderOnCashDeliveryOrMyWallet();
    }
  };

  const goToNextStep = () => {
    if (activeStep < 4) {
      setActiveStep(activeStep + 1);
    }
  };

  const goTOPrevStep = () => {
    if (activeStep > 1) {
      setActiveStep(activeStep - 1);
    }
  };

  const toggleAddress = () => {
    setCreateAddresses(!createAddresses);
  };

  useEffect(() => {
    if (orderData) {
      navigate(-1);
    }
  }, [orderData]);

  return (
    <>
      {orderPlacedLoading ? (
        <Loading />
      ) : (
        <div className="w-[95%] md:w-[80%] xl:w-[50%] mx-auto p-3 xl:p-10 bg-white text-black md:rounded-xl xl:rounded-[2rem] shadow-lg flex flex-col gap-2 my-10">
          {/* Step 1 */}

          {/* Step 2 */}
          <div>
            <div className="flex items-center justify-between p-3 bg-main text-white cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="bg-white text-main font-bold w-10 h-10 flex items-center justify-center">
                  2
                </span>
                <p>DELIVERY ADDRESS</p>
              </span>
              <span>{activeStep === 2 ? "-" : "+"}</span>
            </div>
            {activeStep === 2 && (
              <div>
                <div className="bg-white p-5 rounded">
                  {loading ? (
                    <div className="w-full text-center">
                      <ClipLoader color={"#00756b"} />
                    </div>
                  ) : addresses?.length > 0 ? (
                    <>
                      <h2 className="my-1 font-semibold ">Your addresses</h2>
                      {addresses?.map((item, index) => {
                        return (
                          <CheckoutAddressRow
                            item={item}
                            key={index}
                            selectedAddress={selectedAddress}
                            setSelectedAddress={setSelectedAddress}
                          />
                        );
                      })}
                    </>
                  ) : (
                    <p className="text-center">No addresses found.</p>
                  )}
                  <div className="my-5 text-white">
                    <button
                      className="text-black bg-gray-200 p-3 rounded"
                      onClick={toggleAddress}
                    >
                      Add a new Address
                    </button>
                  </div>
                </div>
                {createAddresses && (
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
                          defaultValue={initialValues.name}
                        />
                        <p className="w-full h-5 text-red-600">
                          {errors.name?.message}
                        </p>
                      </div>
                      <div>
                        <input
                          className="border p-2 py-3 outline-none"
                          type="text"
                          placeholder="10-digit mobile number"
                          {...register("phoneNumber")}
                          defaultValue={initialValues.phoneNumber}
                        />
                        <p className="w-full h-5 text-red-600">
                          {errors.phoneNumber?.message}
                        </p>
                      </div>

                      <div>
                        <input
                          className="border p-2 py-3 outline-none"
                          type="text"
                          placeholder="Pincode"
                          {...register("pinCode")}
                          defaultValue={initialValues.pinCode}
                        />
                        <p className="w-full h-5 text-red-600">
                          {errors.pinCode?.message}
                        </p>
                      </div>
                      <div>
                        <input
                          className="border p-2 py-3 outline-none"
                          type="text"
                          placeholder="Locality"
                          {...register("locality")}
                          defaultValue={initialValues.locality}
                        />
                        <p className="w-full h-5 text-red-600">
                          {errors.locality?.message}
                        </p>
                      </div>
                      <div>
                        <input
                          className="border p-2 py-3 outline-none"
                          type="text"
                          placeholder="Address (Area and Street)"
                          {...register("address")}
                          defaultValue={initialValues.address}
                        />
                        <p className="w-full h-5 text-red-600">
                          {errors.address?.message}
                        </p>
                      </div>
                      <div className="flex gap-10">
                        <span className="flex items-center gap-2 ">
                          <input id="home" type="radio" name="option" />
                          <label
                            htmlFor="home"
                            className="hover:cursor-pointer"
                          >
                            Home
                          </label>
                        </span>
                        <span className="flex items-center gap-2 ">
                          <input id="work" type="radio" name="option" />
                          <label
                            htmlFor="work"
                            className="hover:cursor-pointer"
                          >
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
                          defaultValue={initialValues.city}
                        />
                        <p className="w-full h-5 text-red-600">
                          {errors.city?.message}
                        </p>
                      </div>
                      <div>
                        <input
                          className="border p-2 py-3 outline-none"
                          type="text"
                          placeholder="State"
                          {...register("state")}
                          defaultValue={initialValues.state}
                        />
                        <p className="w-full h-5 text-red-600">
                          {errors.state?.message}
                        </p>
                      </div>
                      <div>
                        <input
                          className="border p-2 py-3 outline-none"
                          type="text"
                          placeholder="Landmark (Optional)"
                          {...register("landMark")}
                          defaultValue={initialValues.landMark}
                        />
                        <p className="w-full h-5 text-red-600">
                          {errors.landMark?.message}
                        </p>
                      </div>
                      <div>
                        <input
                          className="border p-2 py-3 outline-none"
                          type="text"
                          placeholder="Alternate Phone (Optional)"
                          {...register("alternatePhoneNumber")}
                          defaultValue={initialValues.alternatePhoneNumber}
                        />
                        <p className="w-full h-5 text-red-600">
                          {errors.alternatePhoneNumber?.message}
                        </p>
                      </div>
                      <button
                        type="submit"
                        className="w-fit px-5 bg-main text-black font-semibold py-2 rounded-md"
                        // onClick={goToNextStep}
                      >
                        Save
                      </button>
                    </form>
                  </div>
                )}
                <div className="w-full flex justify-center gap-10 ">
                  <button
                    type="submit"
                    className="w-fit px-5 bg-main text-black font-semibold py-2 rounded-md"
                    onClick={() => {
                      if (selectedAddress) {
                        goToNextStep();
                      }
                    }}
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center justify-between p-3 bg-main text-white cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="bg-white text-main font-bold w-10 h-10 flex items-center justify-center">
                  3
                </span>
                <p>ORDER SUMMARY</p>
              </span>
              <span>{activeStep === 3 ? "-" : "+"}</span>
            </div>
            {activeStep === 3 && (
              <>
                {cart &&
                  cart.map((item, index) => (
                    <SingleProductOnCheckOut
                      key={index}
                      item={item}
                      cartId={cartId}
                    />
                  ))}

                {cart?.length !== 0 ? (
                  <div className="p-4 border border-t-0 border-main flex flex-col items-center gap-5">
                    <div className="py-5 divide-y-2 divide-gray-100">
                      <h3 className="text-gray-500 text-xl pb-3 font-semibold">
                        Price Details
                      </h3>
                      <div className="flex justify-between items-center py-3 text-black">
                        <p className="text-sm">Price ({cart?.length} item)</p>
                        <p className="flex items-center">
                          <FaRupeeSign />
                          {totalPrice}
                        </p>
                      </div>
                      <div className="flex justify-between items-center py-3 text-black">
                        <p className="text-sm">Delivery Charges</p>
                        <div className="flex gap-1">
                          <div className="relative flex">
                            <FaRupeeSign /> 80
                            <span className="absolute top-[40%] left-0 rotate-12 h-[1.5px] w-full bg-red-400"></span>
                          </div>
                          <span className="text-green-500 font-bold">Free</span>
                        </div>
                      </div>
                      <div className="pt-5">
                        <div className="flex justify-between items-center">
                          <p className="font-semibold text-xl">Total Payable</p>
                          <p className="flex items-center">
                            <FaRupeeSign />
                            {totalPrice}
                          </p>
                        </div>
                        <p className="text-green-600 pt-2 font-semibold flex items-center">
                          Your Total Saving on this order <FaRupeeSign />{" "}
                          {totalMrpPrice - finalTotal}
                        </p>
                      </div>
                    </div>
                    <div className="flex justify-center gap-10">
                      <button
                        type="submit"
                        className="w-fit px-5 bg-red-500 text-white font-semibold py-2 rounded-md"
                        onClick={() => {
                          goTOPrevStep();
                        }}
                      >
                        Go Back
                      </button>

                      <button
                        className="w-fit px-5 bg-main text-black font-semibold py-2 rounded-md"
                        onClick={goToNextStep}
                      >
                        Continue
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full py-10">
                    <h2 className="text-2xl font-semibold text-gray-700 mb-5">
                      No products in cart
                    </h2>
                    <button
                      onClick={() => navigate("/shop")}
                      className="px-6 py-3 bg-secondary text-white font-medium rounded-md hover:bg-secondary-hover transition"
                    >
                      Go to Shop
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {/* Step 4 */}
          <div>
            <div className="flex items-center justify-between p-3 bg-main text-white cursor-pointer">
              <span className="flex items-center gap-2">
                <span className="bg-white text-main font-bold w-10 h-10 flex items-center justify-center">
                  4
                </span>
                <p>PAYMENT OPTIONS</p>
              </span>
              <span>{activeStep === 4 ? "-" : "+"}</span>
            </div>
            {activeStep === 4 && (
              <div className="p-4 border border-t-0 border-main flex flex-col items-center gap-2">
                <p>Choose your payment method here.</p>
                <CheckoutPaymentOption
                  handleSelectedPayment={handleSelectedPayment}
                  selectedPayment={selectedPayment}
                />
                <div className="flex justify-center gap-10">
                  <button
                    className="w-fit px-5 bg-red-500 text-white font-semibold py-2 rounded-md"
                    onClick={() => {
                      goTOPrevStep();
                    }}
                  >
                    Go Back
                  </button>

                  <button
                    className="w-fit px-10 bg-green-500 text-white font-semibold py-2 rounded-md"
                    onClick={placeOrder}
                  >
                    Pay
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Orders;
