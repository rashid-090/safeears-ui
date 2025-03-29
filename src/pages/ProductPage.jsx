import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { allProducts } from "../components/data";
import { FaRupeeSign } from "react-icons/fa";
import { GoPlus } from "react-icons/go";
import { FiMinus } from "react-icons/fi";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { cloudinary } from "../utils/cloudinaryBaseUrl";
import axios from "axios";
import JustLoading from "../components/JustLoading";
import { appJson, config } from "../Common/configurations";
import toast from "react-hot-toast";
import { commonRequest, URL } from "../Common/api";
import { getCart } from "../redux/actions/user/cartActions";
import { toggleCart } from "../redux/reducers/userSlice";
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import Rating from "../components/Rating";
import { IoIosStar, IoIosStarOutline } from "react-icons/io";
import ReviewsList from "../components/ReviewList";


function ProductPage() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  let [product, setProduct] = useState({});
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState(false);
  let [currentImage, setCurrentImage] = useState([]);
  const [flag, setFlag] = useState(false)
  const [hasRated, setHasRated] = useState(false);


  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${URL}/user/product/${id}`, {
          withCredentials: true,
        });

        // console.log(data)
        if (data) {
          setProduct(data.product);
          setLoading(false);
          const allImages = [data.product.imageURL, ...data.product.moreImageURL];

          setCurrentImage(allImages);  // This will store the imageURL and all images from moreImageURL
        }
      } catch (error) {
        setLoading(false);
        setError(error);
      }
    };
    loadData();
  }, [id]);

  let [count, setCount] = useState(1);

  const increment = async () => {
    setCount((c) => c + 1);
  };

  const decrement = () => {
    if (count > 1) {
      setCount((c) => c - 1);
    }
  };

  const [cartLoading, setCartLoading] = useState(false);
  const addToCart = async () => {
    if (!user) {
      return navigate("/login");
    }
    setCartLoading(true);

    await axios
      .post(
        `${URL}/user/cart`,
        {
          product: id,
          quantity: count,
        },
        { ...config, withCredentials: true }
      )
      .then((data) => {
        // console.log(data);

        toast.success("Added to cart");
        setCartLoading(false);
      })
      .catch((error) => {
        const err = error.response.data.error;
        setCartLoading(false);
      });

    dispatch(getCart());
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to the previous page
  };

  const { cart } = useSelector((state) => state.cart);

  const goToCart = () => {
    dispatch(toggleCart());
  };

  const renderStars = (ratings) => {
    // Check if ratings array is not empty
    const totalStars = 5;
    const rating = ratings?.length > 0 ? ratings[0]?.rating : 0; // Default to 0 if no rating

    const fullStars = Math.floor(rating);
    const emptyStars = totalStars - fullStars;

    return (
      <>
        {[...Array(fullStars)].map((_, index) => (
          <IoIosStar size={15} key={index} className="text-main" />
        ))}
        {[...Array(emptyStars)].map((_, index) => (
          <IoIosStarOutline size={15} key={index + fullStars} className="text-main" />
        ))}
      </>
    );
  };

  return (
    <>
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <JustLoading size={20} />
        </div>
      ) : product ? (
        <div className="grid place-items-center w-full py-10 p-5 gap-y-20  relative">

          <div className="bg-white relative text-black w-full md:w-fit p-5 py-10 xl:p-16 rounded-[2rem] flex flex-col md:flex-row gap-10 md:gap-8 items-center">
            <button
              onClick={handleBackClick}
              className="absolute bg-gray-200 hover:bg-gray-300 duration-300 h-8 grid place-items-center rounded-full w-8 left-5 top-5"
            >
              <MdOutlineKeyboardBackspace />
            </button>
            <div className="overflow-hidden h-full w-full md:h-48 md:w-48 relative rounded-2xl mt-10 xl:mt-0">

              <CarouselProvider
                naturalSlideWidth={100}
                naturalSlideHeight={100}
                totalSlides={currentImage?.length}
                interval={3000}
                infinite
                isPlaying
              >
                <Slider>
                  {
                    currentImage?.map((image, i) => (
                      <Slide key={i}
                        index={0}>
                        <img
                          className="w-full h-full object-cover rounded-2xl hover:opacity-90 duration-300"
                          src={`${cloudinary}/${image}`}
                          alt={product?.name}
                          loading="lazy"
                        />

                      </Slide>

                    ))
                  }

                </Slider>
                {
                  currentImage?.length > 1 &&
                  <div className="absolute inset-0 flex items-center justify-between px-2">
                    <ButtonBack className="bg-black bg-opacity-10 text-white p-2 rounded-full hover:bg-opacity-75">
                      ❮
                    </ButtonBack>
                    <ButtonNext className="bg-black bg-opacity-10 text-white p-2 rounded-full hover:bg-opacity-75">
                      ❯
                    </ButtonNext>
                  </div>
                }
              </CarouselProvider>


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
                {product?.name}
              </h1>
              <div className="flex  font-bold gap-2 text-base">
                <p className="flex">
                  <FaRupeeSign /> {product?.salePrice}
                </p>
                <div className="relative text-gray-400 flex">
                  <FaRupeeSign /> {product?.mrpPrice}
                  <span className="absolute top-[40%] left-0 rotate-12 h-[1.5px] w-full bg-red-400"></span>
                </div>
                <p className="text-[#69b886]">
                  {Math.round(
                    ((product.mrpPrice - product.salePrice) /
                      product.mrpPrice) *
                    100
                  )}
                  % off
                </p>
              </div>
              <div className="text-center text-sm font-bold text-[#69b886] capitalize">
                <p className="text-xs">{product?.status}</p>
                <p className="text-[9px] text-center justify-center font-medium flex gap-1 capitalize items-center">
                  {product?.ratings ? renderStars(product?.ratings) : "No reviews yet"}
                </p>
                <div className="h-[2px] w-full bg-gray-300 mb-1" />
                <p className="text-[#69b886] uppercase">regular size</p>

              </div>
            </div>
            <div className="flex flex-col items-center gap-7">
              <div className="flex border border-black rounded-lg overflow-hidden text-sm">
                {cart?.some((item) => item.product._id === product._id) ? (
                  ""
                ) : (
                  <>
                    <button
                      className={`w-6 grid place-items-center h-6 ${product.quantity === 1
                        ? "bg-black text-white cursor-not-allowed"
                        : "bg-black hover:bg-white text-white hover:text-black cursor-pointer"
                        } duration-200`}
                      onClick={decrement}
                      disabled={product.quantity === 1}
                    >
                      <FiMinus />
                    </button>
                    <span className="w-6 grid place-items-center h-6">
                      {count}
                    </span>
                    <button
                      className={`w-6 grid place-items-center h-6 ${product.quantity === 6
                        ? "bg-black text-white cursor-not-allowed"
                        : "bg-black hover:bg-white text-white hover:text-black cursor-pointer"
                        } duration-200`}
                      onClick={increment}
                      disabled={product.quantity === 6}
                    >
                      <GoPlus />
                    </button>
                  </>
                )}
              </div>
              {cartLoading ? (
                <button
                  disabled={cartLoading}
                  className="text-xs p-2 text-white bg-black hover:bg-main duration-200 w-full py-1 rounded-lg capitalize font-medium"
                >
                  Adding to cart
                </button>
              ) : cart?.length !== 0 &&
                cart?.some((item) => item.product._id === product._id) ? (
                <button
                  onClick={() => goToCart()}
                  className="text-xs p-2 text-white bg-black hover:bg-main duration-200 w-full py-1 rounded-lg capitalize font-medium"
                >
                  Go to cart
                </button>
              ) : (
                <button
                  onClick={() => addToCart(product._id)}
                  className="text-xs p-2 text-white bg-black hover:bg-main duration-200 w-full py-1 rounded-lg capitalize font-medium"
                >
                  Add to cart
                </button>
              )}
            </div>
          </div>

          {/* shopping */}
          <div>
            <Link
              to={"/shop"}
              className="bg-main text-black font-semibold text-lg hover:bg-yellow-600 duration-300 px-10 w-fit py-2 rounded-2xl"
            >
              Continue Shopping
            </Link>
          </div>
          <div className=" bg-white text-black w-full md:w-[50%] max-w-[500px] p-5 rounded-2xl">

            {user ? <Rating hasRated={hasRated} setHasRated={setHasRated} productId={product._id} flag={flag} setFlag={setFlag} userId={user._id} /> : <div className="w-fit mx-auto"><Link to={'/login'} className="bg-main text-black  text-sm capitalize hover:bg-yellow-600 duration-300 px-10 w-fit mx-auto py-2 rounded-2xl">Login to rate this product</Link></div>}
            {console.log(product)}
            {
              product?.ratings &&
              <ReviewsList setHasRated={setHasRated} flag={flag} setFlag={setFlag} reviews={product?.ratings} productId={product._id} currentUserId={user?._id} />
            }
          </div>
          <div className=" bg-white text-black w-full md:w-[50%] max-w-[500px] rounded-md">

          </div>
        </div>
      ) : (
        <p>Product not found</p>
      )}
    </>
  );
}

export default ProductPage;
