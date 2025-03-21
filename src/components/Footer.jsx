import React from "react";
import { FaWhatsapp } from "react-icons/fa6";
import {uklgo,indlgo,whtpicon} from '../assets'
import { FaFacebook } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";
import { FaYoutube } from "react-icons/fa6";
import { Link, useLocation } from "react-router-dom";

const Footer = () => {
  const { pathname } = useLocation();
  if (pathname === "/login") return null;
  return (
    <footer className="border-t-4 border-main py-5 flex items-center">
      <div className="fixed bottom-5 right-5">
        <a href="https://wa.me/919207066699" target="_blank"><img className="w-14 h-14 animate-pulse hover:animate-none hover:-translate-y-2 duration-300 cursor-pointer" src={whtpicon} alt="" /></a>
      </div>
      <div className="w-11/12 lg:w-10/12 mx-auto">
        <div className="text-base flex flex-col items-center lg:items-start gap-y-5 lg:flex-row justify-between">
          <div className="flex flex-col xl:flex-row items-center gap-2">
            <FaWhatsapp className="text-2xl"/>
            <p>Customer Support :</p>
            <span className="flex items-center divide-x-2">
            <a className="hover:underline px-2" href="https://wa.me/919207066699" target="_blank">+91 92070 66699</a>
            <a className="hover:underline px-2" href="https://wa.me/919207166699" target="_blank">+91 92071 66699</a>
            </span>
          </div>

          <div className="flex gap-3 items-center text-2xl">
              <a className="hover:scale-90 duration-200" href="https://www.facebook.com/profile.php?id=61560658988420" target="_blank"><FaFacebook/></a>
              <a className="hover:scale-90 duration-200" href="https://www.instagram.com/safe.ears.india/" target="_blank"><FaInstagram/></a>
              <a className="hover:scale-90 duration-200" href="http://www.youtube.com/@safeears" target="_blank"><FaYoutube/></a>
          </div>
          
          <div className="flex flex-col xl:flex-row text-[10px] md:text-base items-center gap-5">
            <div className="flex gap-2 items-center">
              <img className="h-8 w-8 object-cover" src={uklgo} alt="" />
              <p>Designed in United Kingdom</p>
            </div>
            <div className="flex gap-2 items-center">
              <img className="h-8 w-8 object-cover" src={indlgo} alt="" />
              <p>Made in India</p>
            </div>
          </div>
        </div>
        <div className="flex justify-center">
             <a href="http://Webboxdevelopers.com" target="_blank" className="capitalize mt-5 hover:underline text-xs xl:text-sm">designed by webboxdevelopers</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
