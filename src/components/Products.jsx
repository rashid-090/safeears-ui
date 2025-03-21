import React, { useEffect, useState } from "react";
import { IoIosStar } from "react-icons/io";
import { FaRupeeSign } from "react-icons/fa";
import { FaEye } from "react-icons/fa";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { cloudinary } from "../utils/cloudinaryBaseUrl";
import { toast } from "react-toastify";
import { commonRequest, URL } from "../Common/api";
import { appJson, config } from "../Common/configurations";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { getCart } from "../redux/actions/user/cartActions";
import JustLoading from "./JustLoading";
import Loading from "./Loading";
import Product from "./Product.jsx";
// import {allProducts} from "../components/data";
const Products = () => {
  const { user } = useSelector((state) => state.user);
  const navigate = useNavigate("");
  const [isLoading, setIsLoading] = useState(false);
  // const [cart, setCart] = useState([]);
  const [allProducts, setAllProducts] = useState();
  useEffect(() => {
    const loadData = async () => {
      const res = await commonRequest("GET", "/user/products", null, appJson);
      if (res?.products) {
        console.log(res?.products);
        setAllProducts(res?.products);
      }
    };
    loadData();
  }, []);

  const [cartLoading, setCartLoading] = useState(false);

  const dispatch = useDispatch();

  const { cart, loading } = useSelector((state) => state.cart);

  // setCart(cart);
  return (
    <div className="  grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 place-items-center gap-5 md:gap-10 xl:gap-5 text-black">
      {allProducts ? (
        allProducts?.map((dt, i) => <Product key={i} item={dt} />)
      ) : (
        <Skeleton variant="rectangular" height={100} count={3} />
      )}
    </div>
  );
};

export default Products;
