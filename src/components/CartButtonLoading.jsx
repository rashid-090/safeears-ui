import React from "react";

const CartButtonLoading = ({ width = "72px", height = "24px" }) => {
  return (
    <div
      class={`relative w-[${width}] h-[${height}] white rounded-lg overflow-hidden`}
    >
      <div class="absolute top-0 left-0 w-0 h-full bg-secondary animate-increment"></div>
    </div>
  );
};

export default CartButtonLoading;
