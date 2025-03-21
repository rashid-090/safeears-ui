import React from 'react';
import ReactPlayer from 'react-player'
import { FaYoutube } from "react-icons/fa6";
const OurVideosGallery=[
    {
        vidiId:`OVVGknTdgQI`
    },
    {
        vidiId:`cqBg6f9R9dU`
    },
   
]

const OurVideos = () => {
  return (
    <section className="w-11/12 xl:w-10/12 mx-auto py-10 h-full space-y-5">
        <div className='grid grid-cols-1 md:grid-cols-2 gap-10 xl:pt-20'>
            {OurVideosGallery?.map((data)=>(
            <div className='w-full h-full'>
                  <iframe className='w-full h-52 lg:h-60 xl:h-80' src={`https://www.youtube.com/embed/${data.vidiId}`} frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            ))}
        </div>
        <div className='grid place-items-center'>
            <a className='border border-main bg-white hover:bg-main hover:text-white duration-200 text-main px-5 h-12 rounded-full flex gap-2 items-center text-sm capitalize font-medium' href="https://youtube.com/playlist?list=PLNyfU5Q6ezR5M_j-F3l0x91DjPUt9QEfe&si=aCEGqWOZfmis625P" target='_blank'><p>view our playlist</p><FaYoutube className='text-2xl text-[#ff0000]'/></a>
        </div>
    </section>
  )
}

export default OurVideos