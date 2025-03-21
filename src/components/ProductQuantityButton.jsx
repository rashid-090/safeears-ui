import React, { useState } from "react";
import { BsFillTrash3Fill } from "react-icons/bs";
import { FiMinus } from "react-icons/fi";
import { GoPlus } from "react-icons/go";
import { useDispatch, useSelector } from "react-redux";
import BarLoader from "react-spinners/BarLoader";
import {
  decrementCount,
  incrementCount,
} from "../redux/actions/user/cartActions";

const ProductQuantityButton = ({ item, toggleProductConfirm }) => {
  const { cart, loading, cartId, totalPrice } = useSelector(
    (state) => state.cart
  );
  const [buttonLoading, setButtonLoading] = useState(false);

  const dispatch = useDispatch();

  const dispatchDecrement = async (item) => {
    setButtonLoading(true);

    const res = await dispatch(
      decrementCount({ cartId, productId: item.product._id })
    );
    setButtonLoading(false);
  };

  const dispatchIncrement = async (item) => {
    setButtonLoading(true);
    const res = await dispatch(
      incrementCount({ cartId, productId: item.product._id })
    );
    setButtonLoading(false);
  };

  return (
    <div className="flex  items-center gap-5">
      <div
        className={`flex border border-black rounded-lg overflow-hidden text-sm ${
          buttonLoading && "!border-0"
        } `}
      >
        {buttonLoading ? (
          <BarLoader color="#00756b" width={"72px"} height={"24px"} />
        ) : (
          <>
            <button
              className={`w-6 grid place-items-center h-6 ${
                item.quantity === 1
                  ? "bg-black text-white cursor-not-allowed"
                  : "bg-black hover:bg-white text-white hover:text-black cursor-pointer"
              } duration-200`}
              disabled={item.quantity === 1 || buttonLoading}
              onClick={() => dispatchDecrement(item)}
            >
              <FiMinus />
            </button>
            <span className="w-6 grid place-items-center h-6">
              {item.quantity}
            </span>
            <button
              className={`w-6 grid place-items-center h-6 ${
                item.quantity === 6
                  ? "bg-black text-white cursor-not-allowed"
                  : "bg-black hover:bg-white text-white hover:text-black cursor-pointer"
              } duration-200`}
              onClick={() => dispatchIncrement(item)}
              disabled={item.quantity === 6 || buttonLoading}
            >
              <GoPlus />
            </button>
          </>
        )}
      </div>
      <button>
        <BsFillTrash3Fill
          onClick={() => toggleProductConfirm(item._id)}
          className="text-xl text-black hover:text-red-500 duration-300"
        />
      </button>
    </div>
  );
};

export default ProductQuantityButton;
