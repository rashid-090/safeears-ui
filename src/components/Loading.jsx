import React from "react";

const Loading = () => {
  return (
    <div className="flex  items-center justify-center h-screen w-full absolute top-0 left-0 bg-white opacity-10">
      <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500"></div>
    </div>
  );
};

export default Loading;
