import React from "react";

const ConfirmModal = ({ title, positiveAction, negativeAction }) => {
  return (
    <div className="w-full h-screen bg-slate-600 fixed top-0 left-0 z-[9999999] bg-opacity-50 flex items-center justify-center">
      <div className="px-20 py-5 bg-white rounded-xl text-black text-center">
        <h1>{title}</h1>
        <div className="flex gap-5 mt-5">
          <button
            className="admin-button-fl p-1 bg-main rounded-lg text-white"
            onClick={negativeAction}
          >
            Cancel
          </button>
          <button
            className="admin-button-fl bg-red-500  p-1 rounded-lg text-white"
            onClick={positiveAction}
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
