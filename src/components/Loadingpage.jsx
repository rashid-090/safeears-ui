import React from "react";
import PuffLoader from "react-spinners/PuffLoader";

function Loader() {
  return (
    <>
      <div className="fixed z-[999999] bg-gradient-to-r from-[#007669] via-[#00726f] to-[#006b7c] top-0 left-0 right-0 bottom-0 h-screen w-full grid place-items-center">
        <PuffLoader color="rgb(248, 177, 51)" size={50} />
      </div>
    </>
  );
}

export default Loader;
