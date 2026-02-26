import { useState, useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { HiMiniArrowSmallLeft, HiMiniArrowSmallRight } from "react-icons/hi2";
import axios from "axios";
import { URL } from "../Common/api";
import { cloudinary } from "../utils/cloudinaryBaseUrl";
// You can remove ClipLoader if you use the Skeleton approach below
// import ClipLoader from "react-spinners/ClipLoader"; 

// Modified arrows to accept className for easier hiding
const NextArrow = ({ onClick, className, style }) => (
  <div
    className={`hidden absolute right-0 -bottom-7 transform -translate-y-1/2 z-10 cursor-pointer bg-gray-800 text-white rounded-full p-1 hover:bg-gray-900 transition-colors ${className}`}
    style={{ ...style, display: onClick ? "block" : "none" }}
    onClick={onClick}
  >
    <HiMiniArrowSmallRight className="text-base xl:text-lg" />
  </div>
);

const PrevArrow = ({ onClick, className, style }) => (
  <div
    className={`hidden absolute right-10 -bottom-7 transform -translate-y-1/2 z-10 cursor-pointer bg-gray-800 text-white rounded-full p-1 hover:bg-gray-900 transition-colors ${className}`}
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
        setBanners(Array.isArray(data.banners) ? data.banners : []);
      } catch (error) {
        console.error("Error fetching banners:", error);
        setBanners([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  const settings = {
    dots: banners.length > 1,
    infinite: banners.length > 1,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: banners.length > 1,
    autoplaySpeed: 3000,
    afterChange: (current) => setActiveSlide(current),
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
          className={`w-3 h-3 rounded-full ${colorClass} ${
            activeSlide === i ? "scale-125 transform transition-transform" : ""
          } hover:bg-opacity-70 transition-colors duration-300 cursor-pointer`}
        ></div>
      );
    },
  };

  // --- NEW LOADING STATE: SKELETON LOADER ---
  if (loading) {
    return (
      <div className="pt-16 w-full animate-pulse px-4">
        {/* Top Slider Skeleton (4 items to match slidesToShow: 4) */}
        <div className="flex justify-between gap-4 mb-5 overflow-hidden">
          {[1, 2, 3, 4].map((item) => (
            <div 
              key={item} 
              className="w-1/4 h-24 md:h-32 bg-gray-200 rounded-lg"
            ></div>
          ))}
        </div>

        {/* Bottom Main Image Skeleton */}
        <div className="w-full flex justify-center mt-5">
          <div className="h-[300px] md:h-[400px] w-full md:w-3/4 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }

  if (banners.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-gray-400">
        {/* Optional: Add text here if you want */}
      </div>
    );
  }

  return (
    <div className="pt-8 relative">
      <Slider key={banners.length} {...settings}>
        {banners.map((banner, index) => (
          <div
            key={banner._id}
            className={`transition-transform duration-300 relative outline-none ${
              activeSlide === index ? "scale-125 z-10" : ""
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