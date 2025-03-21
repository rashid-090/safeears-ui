import { useState } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { HiMiniArrowSmallLeft } from "react-icons/hi2";
import { HiMiniArrowSmallRight } from "react-icons/hi2";

import bb1 from "../assets/new/bb1.png";
import bb2 from "../assets/new/bb2.png";
import bb3 from "../assets/new/bb3.png";
import bb4 from "../assets/new/bb4.png";

import mbg1 from "../assets/new/b1.webp";
import mbg2 from "../assets/new/b2.webp";
import mbg3 from "../assets/new/b3.webp";
import mbg4 from "../assets/new/b4.webp";

const NextArrow = ({ onClick }) => (
  <div
    className="hidden md:block absolute right-0 -bottom-7 transform -translate-y-1/2 z-10 cursor-pointer bg-gray-800 text-white rounded-full p-1  hover:bg-gray-900 transition-colors"
    onClick={onClick}
  >
        <HiMiniArrowSmallRight className="text-base xl:text-lg"/>
   
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div
    className="hidden md:block absolute right-10 -bottom-7 transform -translate-y-1/2 z-10 cursor-pointer bg-gray-800 text-white rounded-full p-1  hover:bg-gray-900 transition-colors"
    onClick={onClick}
  >
 <HiMiniArrowSmallLeft className="text-base xl:text-lg"/>
  </div>
);

const ImageCarousel = () => {
  const [activeSlide, setActiveSlide] = useState(0);

  const images = [bb1, bb2, bb3, bb4];
  const mainImages = [mbg1, mbg2, mbg3, mbg4];

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    afterChange: (current) => setActiveSlide(current),
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
    customPaging: (i) => {
      const colors = [
        "bg-[#c1d0db]",
        "bg-[#1f2626]",
        "bg-[#b89b91]",
        "bg-[#45403d]",
      ];
      return (
        <div
          className={`w-3 h-3 rounded-full ${colors[i]} ${
            activeSlide === i ? "scale-125 transform transition-transform" : ""
          } hover:bg-opacity-70 transition-colors duration-300 cursor-pointer`}
        ></div>
      );
    },
  };

  return (
    <div className="pt-8 relative">
      <Slider {...settings}>
        {images.map((image, index) => (
          <div
            key={index}
            className={`transition-transform duration-300 relative ${
              activeSlide === index ? "scale-125 z-10" : ""
            }`}
          >
            <img
              src={image}
              alt={`Image ${index + 1}`}
              className="w-full h-auto p-3 md:p-5 pointer-events-none"
            />
          </div>
        ))}
      </Slider>

      <div className="w-full mt-5 grid place-items-center -mb-5 md:-mb-0">
        <img
          className="h-[400px] object-contain"
          src={mainImages[activeSlide]}
          alt="Main Image"
        />
      </div>
    </div>
  );
};

export default ImageCarousel;
