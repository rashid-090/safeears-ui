import React from 'react';
import { useNavigate } from 'react-router-dom';

let done = 'https://www.sfu.ca/siat/student_projects/iat339_2022_summer/enoc/P2_thunderousCats/public_html/img/confirmationPage/checkMark.png'

const Construct = () => {
    const navigate = useNavigate();
  return (
    <div className='h-screen w-full flex flex-col justify-center text-center items-center'>
      <h4 className='-mt-40 text-3xl xl:text-5xl capitalize font-black text-main'>Under construction</h4>
      <a target='_blank' href='https://wa.me/+919207166699' className='mt-5 text-2xl capitalize animate-bounce  hover:underline'>contact us</a>
 </div>
  )
}

export default Construct