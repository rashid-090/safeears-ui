import React, { useState } from "react";
import { earaids } from "../assets";
import { Products } from "../components";
import { useDispatch, useSelector } from "react-redux";
import { toggleCart } from "../redux/reducers/userSlice";

const Shop = () => {
  const dispatch = useDispatch();

  const goToCart = () => {
    dispatch(toggleCart());
  };

  const { cart, loading } = useSelector((state) => state.cart);
  return (
    <section className="w-11/12 xl:w-10/12 mx-auto h-full  overflow-hidden pt-10 md:pt-0 ">
      <div className="flex flex-col-reverse gap-y-10 lg:flex-row h-full w-full">
        <div className="basis-1/2 flex justify-center items-end h-full border-b-4 border-main">
          <img
            className="h-[500px] object-contain object-bottom"
            src={earaids}
            alt=""
            loading="lazy"
          />
        </div>
        <div className="basis-1/2 grid grid-cols-1 md:grid-cols-2 place-items-center gap-y-10">
          {/* 1 */}
          <div className="flex flex-col gap-0 items-center">
            <h3 className="uppercase font-semibold text-2xl">mega sale</h3>
            <div className="flex items-center gap-3">
              <h2 className="text-8xl font-semibold">30</h2>
              <span className="flex flex-col">
                <p className="font-semibold uppercase">up to</p>
                <p className="text-5xl font-semibold">%</p>
              </span>
            </div>
            <h2 className="text-3xl font-semibold uppercase">single side</h2>
            <span className="bg-main px-10 uppercase text-lg text-black font-semibold py-2 rounded-md">
              limited time offer
            </span>

            <div className="flex flex-col items-center border rounded-xl mt-3 px-10 py-1">
              <p className="text-lg font-semibold">Offer Price: 699/-</p>
              <p className="text-sm font-medium flex gap-1">
                Price Before:
                <div className="relative">
                  <div className="h-[2px] top-2 rotate-[23deg] w-10 absolute bg-red-500"></div>
                  990/-
                </div>
              </p>
            </div>
          </div>
          {/* 1 */}

          {/* 2 */}
          <div className="flex flex-col gap-0 items-center">
            <h3 className="uppercase font-semibold text-2xl">mega sale</h3>
            <div className="flex items-center gap-3">
              <h2 className="text-8xl font-semibold">50</h2>
              <span className="flex flex-col">
                <p className="font-semibold uppercase">up to</p>
                <p className="text-5xl font-semibold">%</p>
              </span>
            </div>
            <h2 className="text-3xl font-semibold uppercase">dual side</h2>
            <span className="bg-main px-10 uppercase text-lg text-black font-semibold py-2 rounded-md">
              limited time offer
            </span>

            <div className="flex flex-col items-center border rounded-xl mt-3 px-10 py-1">
              <p className="text-lg font-semibold">Offer Price: 999/-</p>
              <p className="text-sm font-medium flex gap-1">
                Price Before:
                <div className="relative">
                  <div className="h-[2px] top-2 rotate-[23deg] w-10 absolute bg-red-500"></div>
                  1999/-
                </div>
              </p>
            </div>
          </div>
          {/* 2 */}

          <div className="md:col-span-2 grid place-items-center w-full h-full ">
            <a
              href="#prod"
              className="bg-main hover:bg-yellow-600 duration-300 text-black px-10 py-2 rounded-3xl font-semibold uppercase text-2xl "
            >
              shop now
            </a>
          </div>
        </div>
      </div>

      <div className="py-10 xl:py-20" id="prod">
        <Products />
      </div>

      {!loading && cart?.length !== 0 && (
        <div className=" grid place-items-center w-full h-full pb-10">
          <button
            onClick={goToCart}
            className="bg-main hover:bg-yellow-600 duration-300 text-black px-10 py-2 rounded-3xl font-semibold uppercase text-2xl "
          >
            go to cart
          </button>
        </div>
      )}
    </section>
  );
};

export default Shop;
