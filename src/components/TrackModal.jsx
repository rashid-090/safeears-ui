import React from 'react';
import { IoIosClose } from "react-icons/io";


const TrackModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    const handleBackgroundClick = (e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      };
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center" onClick={handleBackgroundClick}>
      <div className="bg-white text-black rounded shadow-lg w-[90%] xl:w-1/3 relative">
        <IoIosClose className='text-4xl absolute top-2 right-2 hover:text-red-500 cursor-pointer'  onClick={onClose}/>
        <div className='pt-12 p-8 text-center'>
            <h2 className="text-2xl mb-4">Track Your orders</h2>
            <div className='flex flex-col gap-3'>
                <input className='p-2 outline outline-1 rounded-sm focus:outline-1 focus:outline-main' type="text" placeholder='Enter Refernce Id' />
                <button className='h-10 bg-main rounded-sm text-white hover:bg-yellow-600 duration-200'>Track</button>
            </div>
        </div>

      </div>
    </div>
  )
}

export default TrackModal