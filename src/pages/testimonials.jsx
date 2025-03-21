
import React, { useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import {usrimage} from '../assets'

import {MdKeyboardArrowLeft , MdKeyboardArrowRight } from "react-icons/md";

import { PiQuotesFill } from "react-icons/pi";


const TestimonialData = [
    {
        usimg:usrimage,
        descrption:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
        name:`john`
    },
    {
        usimg:usrimage,
        descrption:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
        name:`john`
    },
    {
        usimg:usrimage,
        descrption:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
        name:`john`
    },
    {
        usimg:usrimage,
        descrption:`Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book.`,
        name:`john`
    },
]
const Testimonials = () => {
  const [_, setInit] = useState();
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <div className="bg-black text-white min-h-[80vh] sm:min-h-0 py-32">

    <div className="relative h-full w-11/12 xl:w-10/12 mx-auto">
        <div className='flex flex-col gap-3 pb-5 text-center'>
            {/* <h1 className='text-base uppercase '>testimonials</h1> */}
            <h2 className='text-3xl xl:text-4xl font-semibold capitalize'>what the peaple think about us</h2>
        </div>
      <Swiper
        slidesPerView={1}
        loop={true}
        spaceBetween={10}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        navigation={{
          prevEl: prevRef.current,
          nextEl: nextRef.current,
        }}
        pagination={false}
        breakpoints={{
          640: {
            slidesPerView: 1,
            spaceBetween: 10,
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 10,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 20,
          },
        }}
        onInit={() => setInit(true)}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper z-10"
      >
        {/* swiper content */}
        {TestimonialData?.map((data,i)=>(
            <SwiperSlide className="text-left  px-5 py-10 rounded-3xl relative bg-main text-white" key={i}>
                <div className="flex gap-3 items-center">
                    <img className="w-14 rounded-full h-14" src={data.usimg} alt="" />
                    <p className="text-base capitalize font-medium">{data.name}</p>
                </div>
                <p className="text-sm pt-2">{data.descrption}</p>
            </SwiperSlide>
        ))}
        {/* swiper content */}
      </Swiper>
      {/* Navigations */}
      <div className=" flex gap-5  absolute top-[50%] left-[50%] -translate-x-[50%] -bottom-60 xl:-bottom-52 z-20">
        <button className="" ref={prevRef}>
          <MdKeyboardArrowLeft className="text-xl p-1 text-main bg-white w-8 h-8 rounded-full" />
        </button>
        <button className="" ref={nextRef}>
          <MdKeyboardArrowRight className="text-xl p-1 text-main bg-white w-8 h-8 rounded-full" />
        </button>
      </div>
    </div>
    
    </div>
  );
};

export default Testimonials;
