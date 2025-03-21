import React, { useState } from 'react';
import {earandface,earaids,safewht,safeamz,safeflp} from '../assets'
import { Link } from 'react-router-dom';
import { HomeCarousal } from '../components';


const HomePage = () => {


  return (
    <div className='w-11/12  mx-auto'>

    <section className='grid grid-cols-1 md:grid-cols-2 gap-10 overflow-hidden pt-5 md:pt-0 xl:-mt-20'>
        <div className='grid grid-cols-1 xl:grid-cols-5 gap-5 md:gap-0 xl:gap-10'>
          <div className='xl:col-span-2 h-full flex flex-col justify-center text-center'>
              <h1 className=' font-semibold'>Unit of GRAND VF PVT. LTD.</h1>
              <div className='flex flex-col gap-3 text-center  border-2 rounded-3xl w-full p-3'>
                  {/* <h3 className='text-3xl uppercase font-semibold'>shop now</h3> */}
                  <a href='https://wa.me/919207066699' target='_blank'><img className='h-16 object-contain rounded-2xl py-1 bg-white hover:bg-gray-200 duration-300 w-full' src={safewht} alt="" /></a>
                  <a href='https://amzn.in/d/bfwx3Ta' target='_blank'><img className='h-16 object-contain rounded-2xl py-1 bg-white hover:bg-gray-200 duration-300 w-full' src={safeamz} alt="" /></a>
                  <a href='#'><img className='h-16 object-contain rounded-2xl py-1 bg-white hover:bg-gray-200 duration-300 w-full' src={safeflp} alt="" /></a>
              </div>
          </div>
          <div className='xl:col-span-3 h-full flex flex-col justify-center text-center'>
            <h1 className='text-6xl md:text-4xl xl:text-6xl font-medium pb-2'>SAFE EARS</h1>
            <p className='text-base text-justify tracking-tight'>Safe Ears is a simple and a user friendly
              protective shield which can be placed around
              your ear while bathing , The safe ears is designed
              in such a way that water does not sweep inside
              your ears , thus safe guarding your ears from
              infection, pain, any kind of discharges, ear wax
              issues etc, and also can be used during pre and
              post surgery purposes to keep your ears dry and
              clean.</p>
              <Link to='/shop' className="bg-main hover:bg-yellow-600 duration-300 text-black px-10 py-2 w-fit mx-auto rounded-3xl font-semibold uppercase text-2xl mt-10">shop now</Link>
          </div>
        </div>
        <div className=''>
           <HomeCarousal/>
        </div>
    </section>
    </div>
  )
}

export default HomePage

// https://wa.me/+971569251238