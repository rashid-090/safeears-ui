import React, { useState, useEffect } from "react";
import ReactStars from "react-stars";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import toast from "react-hot-toast";
import { URL } from "../Common/api";
import { config } from "../Common/configurations";

const Rating = ({ productId, userId, setFlag, hasRated, setHasRated }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [showCommentBox, setShowCommentBox] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);



  // Fetch existing rating when the component mounts
  useEffect(() => {

    if (productId) {
      setRating(0)

      axios.get(`${URL}/user/product/${productId}`)
        .then(res => {
          const product = res.data;
          // console.log(res)
          // console.log("User id ", userId)

          // Ensure product and ratings exist
          // Filter ratings to get the one that belongs to the logged-in user
          const userRatings = product.product.ratings.filter(r => r.userId?._id === userId);

          if (userRatings.length > 0) {
            setHasRated(true);
            setRating(userRatings[0].rating); // Set the first matching rating
          }

        })
        .catch(err => console.error("Error fetching product:", err));
    }
  }, [productId, userId._id, hasRated]);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
    setShowCommentBox(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post(
        `${URL}/user/rate/${productId}`,
        {
          rating,
          comment
        },
        config
      );
      setFlag((prev) => !prev)
      toast.success("Thank you for your feedback!");
      setHasRated(true);
      setShowCommentBox(false);
      setIsSubmitting(false);
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("Failed to submit rating. Please try again.");
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full mt-2">
      <h3 className="text-xl font-medium pt-5 text-center">Rate this product</h3>

      {hasRated ? (
        <div className="flex flex-col items-center">
          <ReactStars
            count={5}
            value={rating}
            size={50}
            color2={"#FFD700"}
            edit={false}
            disabled={true}
          />
          <p className="text-base mb-2 text-green-600">Thank you for your feedback!</p>
        </div>
      ) : (
        <div className="flex flex-col items-center">
          <ReactStars
            count={5}
            value={rating}
            onChange={handleRatingChange}
            size={50}
            color2={"#FFD700"}
          // half={false}
          />

          <AnimatePresence>
            {showCommentBox && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full "
              >
                <form onSubmit={handleSubmit} className="flex flex-col gap-2 p-5 items-center">
                  <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full p-2 text-xs border rounded-lg focus:outline-none focus:ring-2 focus:ring-main"
                    rows={3}
                    required
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`text-xs p-4 text-white bg-black hover:bg-main duration-200 w-fit text-center py-3  rounded-lg capitalize font-medium ${isSubmitting ? "opacity-70 cursor-not-allowed" : ""
                      }`}
                  >
                    {isSubmitting ? "Submitting..." : "Submit Review"}
                  </button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default Rating;