import React, { useState } from "react";
import { FaRupeeSign } from "react-icons/fa";
import { IoIosStar } from "react-icons/io";
import prod1 from "../assets/new/brel.png";
import { FiMinus } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import { BsFillTrash3Fill } from "react-icons/bs";
import {
  decrementCount,
  deleteOneProduct,
  getCart,
  incrementCount,
} from "../redux/actions/user/cartActions";
import { useDispatch } from "react-redux";
import CartButtonLoading from "./CartButtonLoading";
import ConfirmModal from "./ConfirmModal";
import BarLoader from "react-spinners/BarLoader";

const SingleProductOnCheckOut = ({ item, cartId }) => {
  const dispatch = useDispatch();
  const [buttonLoading, setButtonLoading] = useState(false);

  const dispatchDeleteProduct = () => {
    console.log(cartId, productId);

    dispatch(deleteOneProduct({ cartId, productId }));
    dispatch(getCart());
    toggleProductConfirm("");
  };

  const dispatchIncrement = async (item) => {
    setButtonLoading(true);
    const res = await dispatch(
      incrementCount({ cartId, productId: item.product._id })
    );
    setButtonLoading(false);
  };

  const dispatchDecrement = async (item) => {
    setButtonLoading(true);
    const res = await dispatch(
      decrementCount({ cartId, productId: item.product._id })
    );
    setButtonLoading(false);
  };

  // Modal for deleting one product from cart
  const [showProductConfirm, setShowProductConfirm] = useState(false);
  const [productId, setProductId] = useState();
  const toggleProductConfirm = (id) => {
    setProductId(id);
    setShowProductConfirm(!showProductConfirm);
  };

  return (
    <>
      {showProductConfirm && (
        <ConfirmModal
          title="Confirm Delete?"
          positiveAction={dispatchDeleteProduct}
          negativeAction={() => toggleProductConfirm("")}
        />
      )}
      <div className="p-4 border border-t-0 border-main flex flex-col items-center gap-5">
        <div className="divide-y-2 space-y-10">
          <div className="flex flex-col md:flex-row gap-5 items-center">
            <div className="overflow-hidden h-full w-full md:h-48 md:w-48 relative rounded-2xl">
              <img
                className="w-full h-full object-cover rounded-2xl hover:opacity-90 duration-300"
                src={prod1}
                alt=""
                loading="lazy"
              />
              <span className="absolute text-base md:text-xs w-full py-2 xl:py-1 text-center capitalize font-semibold bottom-0 right-0 bg-main text-black">
                keep your ears dry
              </span>
            </div>
            <div className="flex flex-col items-center gap-2 md:gap-1">
              <p className="text-xs font-medium flex gap-1 capitalize items-center">
                <IoIosStar className="text-main text-base" />
                Be first to review
              </p>
              <h1 className="text-lg font-semibold capitalize cursor-pointer">
                {item.product.name}
              </h1>
              <div className="flex font-bold gap-2 text-base">
                <p className="flex">
                  <FaRupeeSign /> {item.product.salePrice}
                </p>
                <div className="relative text-gray-400 flex">
                  <FaRupeeSign /> {item.product.mrpPrice}
                  <span className="absolute top-[40%] left-0 rotate-12 h-[1.5px] w-full bg-red-400"></span>
                </div>
                <p className="text-[#69b886]">
                  {Math.round(
                    ((item.product.mrpPrice - item.product.salePrice) /
                      item.product.mrpPrice) *
                      100
                  )}{" "}
                  % off
                </p>
              </div>
              <div className="text-center text-sm font-bold text-[#69b886] capitalize">
                <p className="text-sm text-black">
                  Total price {item.quantity * item.product.salePrice}
                </p>
                <p className="text-xs">In Stock</p>
                <div className="h-[2px] w-full bg-gray-300 mb-1" />
                <p className="text-[#69b886] uppercase">Regular size</p>
              </div>
            </div>

            <div className="flex flex-col items-center gap-5">
              <div className="flex border rounded-lg overflow-hidden">
                {buttonLoading ? (
                  <BarLoader color="#00756b" width={"72px"} height={"24px"} />
                ) : (
                  <>
                    <button
                      className={`w-6 grid place-items-center  ${
                        item.quantity === 1
                          ? "bg-black text-white cursor-not-allowed"
                          : "bg-black hover:bg-white text-white hover:text-black cursor-pointer"
                      } duration-200`}
                      disabled={item.quantity === 1}
                      onClick={() => dispatchDecrement(item)}
                    >
                      <FiMinus />
                    </button>
                    <span className="w-7 grid place-items-center h-7">
                      {item.quantity}
                    </span>
                    <button
                      className={`w-6 grid place-items-center ${
                        item.quantity === 6
                          ? "bg-black text-white cursor-not-allowed"
                          : "bg-black hover:bg-white text-white hover:text-black cursor-pointer"
                      } duration-200`}
                      onClick={() => dispatchIncrement(item)}
                      disabled={item.quantity === 6}
                    >
                      <GoPlus />
                    </button>
                  </>
                )}
              </div>
              <button>
                <BsFillTrash3Fill
                  className="text-3xl hover:text-red-500 duration-300"
                  onClick={() => toggleProductConfirm(item._id)}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProductOnCheckOut;
