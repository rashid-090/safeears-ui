import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FaTrash, FaToggleOn, FaToggleOff, FaSave } from "react-icons/fa";
import { MdFormatListBulletedAdd } from "react-icons/md";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { URL } from "../../Common/api";
import { cloudinary } from "../../utils/cloudinaryBaseUrl";
import ClipLoader from "react-spinners/ClipLoader";

const AdminBanners = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [flag, setFlag] = useState(false);

    // Fetch Banners
    useEffect(() => {
        const fetchBanners = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${URL}/admin/banners`, { withCredentials: true });
                setBanners(data.banners);
            } catch (error) {
                console.error("Error fetching banners:", error);
                // toast.error("Failed to fetch banners");
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, [flag]);

    // Handle Drag End
    const handleOnDragEnd = (result) => {
        if (!result.destination) return;

        const items = Array.from(banners);
        const [reorderedItem] = items.splice(result.source.index, 1);
        items.splice(result.destination.index, 0, reorderedItem);

        setBanners(items);
    };

    // Save Reordered List
    const saveOrder = async () => {
        try {
            const orderedIds = banners.map((banner) => banner._id);
            await axios.patch(
                `${URL}/admin/banner/order`,
                { orderedIds },
                { withCredentials: true }
            );
            toast.success("Banner order updated successfully!");
        } catch (error) {
            console.error("Error saving banner order:", error);
            toast.error("Failed to save banner order");
        }
    };

    // Toggle Status
    const toggleStatus = async (id, currentStatus) => {
        try {
            await axios.patch(
                `${URL}/admin/banner/${id}/status`,
                { isActive: !currentStatus },
                { withCredentials: true }
            );
            toast.success("Banner status updated!");
            setFlag((prev) => !prev);
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    // Delete Banner
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this banner?")) return;
        try {
            await axios.delete(`${URL}/admin/banner/${id}`, { withCredentials: true });
            toast.success("Banner deleted successfully!");
            setFlag((prev) => !prev);
        } catch (error) {
            console.error("Error deleting banner:", error);
            toast.error("Failed to delete banner");
        }
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between w-full mb-4">
                <h1 className="text-2xl font-semibold">Banner Management</h1>
                <div className="flex gap-2">
                    <button
                        onClick={saveOrder}
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center gap-2"
                    >
                        <FaSave /> Save Order
                    </button>
                    <Link
                        to="/admin/add-banner"
                        className="bg-main text-white px-4 py-2 rounded-md hover:bg-yellow-600 flex items-center gap-2"
                    >
                        <MdFormatListBulletedAdd /> Add Banner
                    </Link>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center mt-10">
                    <ClipLoader />
                </div>
            ) : (
                <DragDropContext onDragEnd={handleOnDragEnd}>
                    <Droppable droppableId="banners">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="grid grid-cols-1 gap-4"
                            >
                                {banners.map((banner, index) => (
                                    <Draggable
                                        key={banner._id}
                                        draggableId={banner._id}
                                        index={index}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <span className="font-bold text-gray-500">#{index + 1}</span>
                                                    <div className="flex flex-row gap-2">
                                                        <div className="flex flex-col items-center gap-2">
                                                            <span className="text-xs font-bold bg-gray-200 px-2 py-1 rounded">TOP</span>
                                                            <img
                                                                src={`${cloudinary}/${banner.topImage}`}
                                                                alt="Top"
                                                                className="h-32 w-32 object-contain rounded border"
                                                            />
                                                        </div>
                                                        <div className="flex flex-col items-center gap-2">
                                                            <span className="text-xs font-bold bg-gray-200 px-2 py-1 rounded">BTM</span>
                                                            <img
                                                                src={`${cloudinary}/${banner.bottomImage}`}
                                                                alt="Bottom"
                                                                className="h-32 w-32 object-contain rounded border"
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-4">
                                                    <button
                                                        onClick={() => toggleStatus(banner._id, banner.isActive)}
                                                        className={`text-2xl ${banner.isActive ? "text-green-500" : "text-gray-400"
                                                            }`}
                                                        title="Toggle Status"
                                                    >
                                                        {banner.isActive ? <FaToggleOn /> : <FaToggleOff />}
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(banner._id)}
                                                        className="text-red-500 hover:text-red-700 text-xl"
                                                        title="Delete Banner"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            )}

            {banners.length === 0 && !loading && (
                <div className="text-center text-gray-500 mt-10">
                    No banners found. Add one to get started.
                </div>
            )}
        </div>
    );
};

export default AdminBanners;
