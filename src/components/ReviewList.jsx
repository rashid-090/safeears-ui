import React, { useState, useEffect } from "react";
import ReactStars from "react-stars";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { URL } from "../Common/api";
import { cloudinary } from "../utils/cloudinaryBaseUrl";
import { BsThreeDotsVertical } from "react-icons/bs";
import { RiDeleteBin6Line } from "react-icons/ri";
import { config } from "../Common/configurations";

const ReviewsList = ({ productId, currentUserId ,flag, setHasRated }) => {

    const [loading, setLoading] = useState(false);
    const [reviews, setReviews] = useState([])
    const [openMenuId, setOpenMenuId] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

    useEffect(() => {

        fetchData()
    }, [productId, flag]);
    console.log("Product id ", productId)



    const fetchData = async () => {
        try {
            const { data } = await axios.get(`${URL}/user/product/${productId}`, config);

            // console.log(data)
            if (data) {
                setReviews(data.product.ratings);
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleDeleteReview = async (reviewId) => {
        // console.log(reviewId);
        // return console.log(productId);

        try {
            await axios.delete(`${URL}/user/product/${productId}/delete-review/${reviewId}`, config);
            toast.success("Review deleted successfully");
            setShowDeleteConfirm(null);
            setHasRated(false)
            fetchData()
        } catch (error) {
            console.error("Error deleting review:", error);
            toast.error("Failed to delete review");
        }
    };

    const toggleMenu = (id) => {
        setOpenMenuId(openMenuId === id ? null : id);
        // Close any open delete confirmation
        if (showDeleteConfirm && showDeleteConfirm !== id) {
            setShowDeleteConfirm(null);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    if (loading) {
        return (
            <div className="w-full flex justify-center py-4">
                <div className="w-6 h-6 border-2 border-main border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="w-full mt-6 px-2">
            <h3 className="text-sm font-semibold mb-3 text-black border-b pb-2">
                Customer Reviews ({reviews?.length})
            </h3>

            {reviews.length === 0 ? (
                <p className="text-xs text-gray-500 text-center py-4">No reviews yet. Be the first to review this product!</p>
            ) : (
                <div className="space-y-4">
                    {reviews.slice().reverse().map((review) => (
                        <motion.div
                            key={review._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-gray-50 rounded-lg p-3 relative"
                        >
                            <div className="flex justify-between items-start">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-200">
                                        {review.userId?.profileImgURL ? (
                                            <img
                                                src={`${cloudinary}/${review.userId.profileImgURL}`}
                                                alt={review.userId.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full grid place-items-center bg-main text-black font-semibold">
                                                {review.userId.firstName.charAt(0).toUpperCase()}
                                            </div>
                                        )}
                                    </div>
                                    <div>
                                        <h4 className="text-xs font-semibold">{review.userId.firstName}</h4>
                                        <div className="flex items-center gap-2">
                                            <ReactStars
                                                count={5}
                                                value={review.rating}
                                                size={12}
                                                color2={"#FFD700"}
                                                edit={false}
                                            />
                                            {/* <span className="text-[10px] text-gray-500">
                                                {formatDate(review.createdAt)}
                                            </span> */}
                                        </div>
                                    </div>
                                </div>

                                {currentUserId && review.userId._id === currentUserId && (
                                    <div className="relative">
                                        <button
                                            onClick={() => toggleMenu(review._id)}
                                            className="text-gray-500 hover:text-black p-1 rounded-full hover:bg-gray-200 transition duration-200"
                                        >
                                            <BsThreeDotsVertical size={16} />
                                        </button>

                                        <AnimatePresence>
                                            {openMenuId === review._id && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.95 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    transition={{ duration: 0.1 }}
                                                    className="absolute right-0 top-8 z-10 bg-white shadow-md rounded-md py-1 w-28"
                                                >
                                                    <button
                                                        onClick={() => {
                                                            setShowDeleteConfirm(review._id);
                                                            setOpenMenuId(null);
                                                        }}
                                                        className="flex items-center gap-2 w-full px-3 py-2 text-xs text-left text-red-600 hover:bg-gray-100"
                                                    >
                                                        <RiDeleteBin6Line size={14} />
                                                        Delete
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        <AnimatePresence>
                                            {showDeleteConfirm === review._id && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
                                                    onClick={() => setShowDeleteConfirm(null)}
                                                >
                                                    <motion.div
                                                        initial={{ scale: 0.9 }}
                                                        animate={{ scale: 1 }}
                                                        exit={{ scale: 0.9 }}
                                                        className="bg-white rounded-lg p-4 max-w-xs w-full mx-4"
                                                        onClick={(e) => e.stopPropagation()}
                                                    >
                                                        <h4 className="text-sm font-semibold mb-2">Delete Review?</h4>
                                                        <p className="text-xs text-gray-600 mb-4">
                                                            Are you sure you want to delete this review? This action cannot be undone.
                                                        </p>
                                                        <div className="flex justify-end gap-2">
                                                            <button
                                                                onClick={() => setShowDeleteConfirm(null)}
                                                                className="text-xs px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-100"
                                                            >
                                                                Cancel
                                                            </button>
                                                            <button
                                                                onClick={() => handleDeleteReview(review._id)}
                                                                className="text-xs px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700"
                                                            >
                                                                Delete
                                                            </button>
                                                        </div>
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                )}
                            </div>

                            <p className="text-xs mt-2 text-gray-700">{review.comment}</p>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ReviewsList;
