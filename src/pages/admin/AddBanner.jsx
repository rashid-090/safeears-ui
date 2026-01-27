import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { URL } from "../../Common/api";
import { useDropzone } from "react-dropzone";
import { IoMdCloseCircle } from "react-icons/io";

const AddBanner = () => {
    const navigate = useNavigate();
    const [topImage, setTopImage] = useState(null);
    const [bottomImage, setBottomImage] = useState(null);
    const [loading, setLoading] = useState(false);

    // Dropzone for Top Image
    const onDropTop = (acceptedFiles) => setTopImage(acceptedFiles[0]);
    const { getRootProps: getRootTop, getInputProps: getInputTop } = useDropzone({
        onDrop: onDropTop,
        accept: "image/*",
        multiple: false,
    });

    // Dropzone for Bottom Image
    const onDropBottom = (acceptedFiles) => setBottomImage(acceptedFiles[0]);
    const { getRootProps: getRootBottom, getInputProps: getInputBottom } = useDropzone({
        onDrop: onDropBottom,
        accept: "image/*",
        multiple: false,
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!topImage || !bottomImage) {
            toast.error("Please upload both Top and Bottom images");
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append("topImage", topImage);
        data.append("bottomImage", bottomImage);

        try {
            await axios.post(`${URL}/admin/banner`, data, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            toast.success("Banner added successfully");
            navigate("/admin/banners");
        } catch (error) {
            console.error("Error adding banner:", error);
            toast.error("Failed to add banner");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-semibold">Add New Banner</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-8">

                {/* Top Image Upload */}
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">Top Image</label>
                    <div
                        {...getRootTop()}
                        className="w-full h-64 border-2 border-dashed border-gray-300 rounded-md flex justify-center items-center text-gray-500 cursor-pointer relative bg-gray-50 hover:bg-gray-100 transition"
                    >
                        <input {...getInputTop()} />
                        {topImage ? (
                            <div className="relative w-full h-full p-2">
                                <img
                                    src={window.URL.createObjectURL(topImage)}
                                    alt="Top Preview"
                                    className="w-full h-full object-contain rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setTopImage(null);
                                    }}
                                    className="absolute top-2 right-2 text-red-500 bg-white rounded-full shadow-md"
                                >
                                    <IoMdCloseCircle size={28} />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center p-4">
                                <p className="font-semibold">Click or Drag & Drop</p>
                                <p className="text-sm">Upload Top Banner Image</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Bottom Image Upload */}
                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2">Bottom Image</label>
                    <div
                        {...getRootBottom()}
                        className="w-full h-64 border-2 border-dashed border-gray-300 rounded-md flex justify-center items-center text-gray-500 cursor-pointer relative bg-gray-50 hover:bg-gray-100 transition"
                    >
                        <input {...getInputBottom()} />
                        {bottomImage ? (
                            <div className="relative w-full h-full p-2">
                                <img
                                    src={window.URL.createObjectURL(bottomImage)}
                                    alt="Bottom Preview"
                                    className="w-full h-full object-contain rounded-md"
                                />
                                <button
                                    type="button"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setBottomImage(null);
                                    }}
                                    className="absolute top-2 right-2 text-red-500 bg-white rounded-full shadow-md"
                                >
                                    <IoMdCloseCircle size={28} />
                                </button>
                            </div>
                        ) : (
                            <div className="text-center p-4">
                                <p className="font-semibold">Click or Drag & Drop</p>
                                <p className="text-sm">Upload Bottom Banner Image</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="md:col-span-2 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-8 py-3 bg-main text-white font-semibold rounded-md hover:bg-yellow-600 transition shadow-md disabled:opacity-50"
                    >
                        {loading ? "Uploading..." : "Save Banner"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddBanner;
