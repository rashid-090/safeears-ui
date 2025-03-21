import React from 'react';
import { CarouselProvider, Slider, Slide, ButtonBack, ButtonNext } from 'pure-react-carousel';
import 'pure-react-carousel/dist/react-carousel.es.css';
import { earaids } from '../assets';
import { RiDoubleQuotesL } from "react-icons/ri";
import { useEffect } from 'react';
import axios from 'axios';
import { URL } from '../Common/api';
import { useState } from 'react';


const AboutUs = () => {


  const [testimonials, setTestimonials] = useState([])


  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`${URL}/user/testimonials`)
      if (res.status) {
        setTestimonials(res?.data?.testimonials)
      }
    }

    fetchData()
  }, [])

  return (
    <section className='w-11/12 xl:w-10/12 mx-auto h-full py-10 md:py-0'>
      <div className='grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-10 mb-16'>
        <div className='xl:col-span-2 flex justify-end items-end'>
          <img className='aspect-square object-contain' src={earaids} loading='lazy' alt="safeears" />
        </div>
        <div className='xl:col-span-3 flex items-center'>
          <p className='text-lg'>Safe Ears is a simple and a user friendly protective shield which can be placed around your ear while bathing. The Safe Ears is designed in such a way that water does not sweep inside your ears, thus safe guarding your ears from infection, pain, any kind of discharges, ear wax issues etc, and also can be used during pre and post surgery purposes to keep your ears dry and clean.</p>
        </div>
      </div>

      {

        testimonials?.length !== 0 &&

        <div className='mt-8'>
          <h2 className='text-2xl font-semibold text-center mb-8'>What Our Customers Say</h2>
          <CarouselProvider
            naturalSlideWidth={100}
            naturalSlideHeight={150}
            totalSlides={testimonials.length}
            isPlaying={true}
            interval={5000}
            infinite={true}
            className='relative'
          >
            <Slider className='rounded-lg overflow-hidden h-[600px] sm:h-[450px]   md:h-56'>
              {testimonials.map((testimonial, index) => (
                <Slide index={index} key={testimonial._id}>
                  <div className='p-6 text-center flex flex-col justify-center items-center relative'>
                    <span className="text-6xl text-main absolute top-0 left-0 leading-none font-serif"><RiDoubleQuotesL /></span>
                    <p className='text-lg italic mb-4 px-10'>{testimonial.text}</p>
                    <p className='font-medium text-main'>- {testimonial.name}</p>
                  </div>
                </Slide>
              ))}
            </Slider>
          </CarouselProvider>
        </div>
      }
    </section>
  );
};

export default AboutUs;