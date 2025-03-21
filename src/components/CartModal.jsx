// components/CartModal.js
import React, { useEffect, useState } from "react";
import { IoIosCloseCircle, IoIosStar } from "react-icons/io";
import prod1 from "../assets/new/brer.png";
import { FaRupeeSign } from "react-icons/fa";
import { FiMinus } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import { BsFillTrash3Fill } from "react-icons/bs";
import { cloudinary } from "../utils/cloudinaryBaseUrl";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  decrementCount,
  deleteOneProduct,
  getCart,
  incrementCount,
} from "../redux/actions/user/cartActions";
import { calculateTotalPrice } from "../redux/reducers/user/cartSlice";
import ConfirmModal from "./ConfirmModal";
import toast from "react-hot-toast";
import EmptyCart from "./EmptyCart";
import CartButtonLoading from "./CartButtonLoading";
import { closeCart, toggleCart } from "../redux/reducers/userSlice";
import BarLoader from "react-spinners/BarLoader";
import ProductQuantityButton from "./ProductQuantityButton";

const CartModal = () => {
  const { user, cartOpen } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cart, loading, cartId, totalPrice } = useSelector(
    (state) => state.cart
  );


  useEffect(() => {
    if (user) {
      dispatch(getCart());
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      dispatch(calculateTotalPrice());
    }
  }, [cart, user]);

  // Modal for deleting entire cart
  // Deleting entire cart
  const deleteCart = () => {
    toggleConfirm();
    dispatch(deleteEntireCart(cartId));
  };

  const [showConfirm, setShowConfirm] = useState(false);
  const toggleConfirm = () => {
    if (cart.length > 0) {
      setShowConfirm(!showConfirm);
    } else {
      toast.error("Nothing in the cart");
    }
  };

  const onClose = () => {
    dispatch(toggleCart());
    console.log(cartOpen);
  };





  const [productId, setProductId] = useState("");

  const dispatchDeleteProduct = () => {
    console.log(cartId, productId);

    dispatch(deleteOneProduct({ cartId, productId }));
    dispatch(getCart());
    toggleProductConfirm("");
  };

  // Modal for deleting one product from cart
  const [showProductConfirm, setShowProductConfirm] = useState(false);
  const toggleProductConfirm = (id) => {
    setProductId(id);
    setShowProductConfirm(!showProductConfirm);
  };

  return (
    <>
      {showConfirm && (
        <ConfirmModal
          title="Confirm Clearing Cart?"
          positiveAction={deleteCart}
          negativeAction={toggleConfirm}
        />
      )}
      {showProductConfirm && (
        <ConfirmModal
          title="Confirm Delete?"
          positiveAction={dispatchDeleteProduct}
          negativeAction={() => toggleProductConfirm("")}
        />
      )}
      {/* Modal */}
      <div
        className={`fixed top-0 right-0 h-full w-full xl:w-[400px] bg-white shadow-lg transition-transform duration-300 z-[99999] ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-2 left-2 text-black hover:text-red-500 duration-200 text-3xl md:text-2xl"
        >
          <IoIosCloseCircle />
        </button>

        {/* Modal Content */}
        <div className="py-20 p-5 text-black flex h-full flex-col justify-between gap-5 overflow-y-scroll">
          <div className="divide-x-2 flex justify-between flex-col gap-2">
            {/* products */}

            {cart
              ? cart.map((item) => {
                  return (
                    <div
                      key={item._id}
                      className="flex flex-row gap-3  items-center justify-center bg-gray-200  border p-3 rounded-2xl"
                    >
                      <div className="overflow-hidden h-20 w-20 relative rounded-2xl">
                        <img
                          className="w-full h-full object-cover rounded-2xl hover:opacity-90 duration-300"
                          src={`${cloudinary}/${item?.product?.imageURL}`}
                          alt=""
                          loading="lazy"
                        />
                      </div>
                      <div className="flex flex-col items-center gap-2">
                        <h1 className="text-sm font-semibold capitalize cursor-pointer">
                          {item?.product?.name}
                        </h1>
                        <div className="flex  font-semibold gap-2 text-xs">
                          <p className="flex">
                            <FaRupeeSign /> {item.product.salePrice}
                          </p>
                          <div className="relative text-gray-400 flex">
                            <FaRupeeSign /> {item.product.mrpPrice}
                            <span className="absolute top-[40%] left-0 rotate-12 h-[1.5px] w-full bg-red-400"></span>
                          </div>
                          <p className="text-[#69b886]">
                            {Math.round(
                              ((item.product.mrpPrice -
                                item.product.salePrice) /
                                item.product.mrpPrice) *
                                100
                            )}{" "}
                            % off
                          </p>
                        </div>
                        <div className=" w-full">
                          <p className="text-xs text-start ">
                            Total : {item.product.salePrice * item.quantity}
                          </p>
                        </div>
                        <ProductQuantityButton toggleProductConfirm={toggleProductConfirm} item={item}/>
                      </div>
                    </div>
                  );
                })
              : null}
            {cart?.length === 0 && <EmptyCart closeCart={onClose} />}
          </div>
          <div>
            {cart?.length !== 0 && (
              <div className="flex justify-between items-center py-3 border-t border-gray-300">
                <span className="text-lg font-semibold">Total:</span>
                <span className="text-lg font-bold flex items-center">
                  <FaRupeeSign /> {totalPrice}
                </span>
              </div>
            )}
            <button
              disabled={cart?.length === 0}
              onClick={() => {
                if (cart?.length > 0) {
                  navigate("/checkout");
                  onClose();
                } else {
                  toast.error("No product in cart");
                }
              }}
              className={`bg-main hover:bg-yellow-600 duration-300 w-full text-black text-xl font-semibold py-2    rounded-xl ${
                cart?.length === 0 && " hover:cursor-not-allowed"
              } `}
            >
              Place Orders
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {cartOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={onClose}
        ></div>
      )}
    </>
  );
};

export default CartModal;
