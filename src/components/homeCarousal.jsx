import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { HiMiniArrowSmallLeft, HiMiniArrowSmallRight } from "react-icons/hi2";
import axios from "axios";
import { URL } from "../Common/api";
import { cloudinary } from "../utils/cloudinaryBaseUrl";
import ClipLoader from "react-spinners/ClipLoader";

// Modified arrows to accept className for easier hiding
const NextArrow = ({ onClick, className, style }) => (
  <div
    className={`hidden  absolute right-0 -bottom-7 transform -translate-y-1/2 z-10 cursor-pointer bg-gray-800 text-white rounded-full p-1 hover:bg-gray-900 transition-colors ${className}`}
    style={{ ...style, display: onClick ? "block" : "none" }} // extra safety
    onClick={onClick}
  >
    <HiMiniArrowSmallRight className="text-base xl:text-lg" />
  </div>
);

const PrevArrow = ({ onClick, className, style }) => (
  <div
    className={`hidden  absolute right-10 -bottom-7 transform -translate-y-1/2 z-10 cursor-pointer bg-gray-800 text-white rounded-full p-1 hover:bg-gray-900 transition-colors ${className}`}
    style={{ ...style, display: onClick ? "block" : "none" }}
    onClick={onClick}
  >
    <HiMiniArrowSmallLeft className="text-base xl:text-lg" />
  </div>
);

const ImageCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const { data } = await axios.get(`${URL}/user/banners`);
        // Ensure banners is always an array
        setBanners(Array.isArray(data.banners) ? data.banners : []);
      } catch (error) {
        console.error("Error fetching banners:", error);
        setBanners([]); // Set empty array on error
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // --- FIX START: Dynamic Settings ---
  const settings = {
    dots: banners.length > 1, // Hide dots if only 1 image
    infinite: banners.length > 1, // CRITICAL: Disable infinite loop for single items
    speed: 500,
    // Optional: Adjust slidesToShow if you want the single image to be larger or centered
    // Keeping it 4 means a single image will take up 25% of the width (left aligned)
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: banners.length > 1, // Disable autoplay for single items
    autoplaySpeed: 3000,
    afterChange: (current) => setActiveSlide(current),
    // Only show arrows if we have enough items to scroll
    nextArrow: banners.length > 4 ? <NextArrow /> : null,
    prevArrow: banners.length > 4 ? <PrevArrow /> : null,
    customPaging: (i) => {
      const colors = [
        "bg-[#c1d0db]",
        "bg-[#1f2626]",
        "bg-[#b89b91]",
        "bg-[#45403d]",
      ];
      const colorClass = colors[i % colors.length];
      return (
        <div
          className={`w-3 h-3 rounded-full ${colorClass} ${activeSlide === i ? "scale-125 transform transition-transform" : ""
            } hover:bg-opacity-70 transition-colors duration-300 cursor-pointer`}
        ></div>
      );
    },
  };
  // --- FIX END ---

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[400px]">
        <ClipLoader size={50} color={"#00756b"} />
      </div>
    );
  }

  // --- FIX: Manage "No Images Found" ---
  if (banners.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-gray-400">

      </div>
    );
    // return null; // Uncomment this line if you prefer to hide the section entirely
  }

  return (
    <div className="pt-8 relative">
      {/* Key is important! If banners length changes, it forces Slider to re-render correctly */}
      <Slider key={banners.length} {...settings}>
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            // Added 'outline-none' to remove focus border on click
            className={`transition-transform duration-300 relative outline-none ${activeSlide === index ? "scale-125 z-10" : ""
              }`}
          >
            <img
              src={`${cloudinary}/${banner.topImage}`}
              alt={`Banner ${index + 1}`}
              className="w-full h-auto p-3 md:p-5 pointer-events-none object-contain block mx-auto"
            />
          </div>
        ))}
      </Slider>

      <div className="w-full mt-5 grid place-items-center -mb-5 md:-mb-0">
        {/* Added check to ensure banner exists before accessing bottomImage */}
        {banners[activeSlide] && (
          <img
            className="h-[400px] object-contain transition-opacity duration-500"
            src={`${cloudinary}/${banners[activeSlide]?.bottomImage}`}
            alt="Main Banner"
          />
        )}
      </div>
    </div>
  );
};

export default ImageCarousel;