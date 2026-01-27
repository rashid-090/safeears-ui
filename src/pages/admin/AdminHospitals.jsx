import React, { useState, useEffect } from "react";
import { FaEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { MdClose, MdFormatListBulletedAdd } from "react-icons/md";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
} from "@mui/material";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { URL } from "../../Common/api";
import { cloudinary } from "../../utils/cloudinaryBaseUrl";
import ClipLoader from "react-spinners/ClipLoader";

const AdminHospitals = () => {
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editHospital, setEditHospital] = useState(null);
    const [deleteHospital, setDeleteHospital] = useState(null);
    const [flag, setFlag] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const commonPadding = { padding: "8px 16px" };

    // Fetch Hospitals
    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                setLoading(true);
                const { data } = await axios.get(`${URL}/admin/hospitals`, { withCredentials: true });
                setHospitals(data.hospitals);
            } catch (error) {
                console.error("Error fetching hospitals:", error);
                // toast.error("Failed to fetch hospitals");
            } finally {
                setLoading(false);
            }
        };
        fetchHospitals();
    }, [flag]);

    // Handle Delete
    const handleDelete_Submit = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`${URL}/admin/hospital/${deleteHospital._id}`, { withCredentials: true });
            toast.success("Hospital deleted successfully");
            setFlag((prev) => !prev);
            setDeleteHospital(null);
        } catch (error) {
            console.error("Error deleting hospital:", error);
            toast.error("Failed to delete hospital");
        }
    };

    // Handle Edit Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditHospital({ ...editHospital, [name]: value });
    };

    // Handle Edit File Change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditHospital({ ...editHospital, image: file });
            setImagePreview(window.URL.createObjectURL(file));
        }
    };

    // Handle Edit Submit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", editHospital.name);
        if (editHospital.isActive !== undefined) {
            formData.append("isActive", editHospital.isActive);
        }

        if (editHospital.image instanceof File) {
            formData.append("image", editHospital.image);
        }

        try {
            await axios.patch(`${URL}/admin/hospital/${editHospital._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            toast.success("Hospital updated successfully");
            setFlag((prev) => !prev);
            setEditHospital(null);
        } catch (error) {
            console.error("Error updating hospital:", error);
            toast.error("Failed to update hospital");
        }
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between w-full mb-4">
                <h1 className="text-2xl font-semibold">Hospital Management</h1>
                <Link
                    to="/admin/add-hospital"
                    className="w-fit bg-main flex text-sm font-medium gap-2 items-center text-white p-2 px-4 hover:bg-yellow-600 duration-150 rounded-md"
                >
                    <MdFormatListBulletedAdd className="text-xl" /> Add Hospital
                </Link>
            </div>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={commonPadding}><h2 className="font-medium">#</h2></TableCell>
                            <TableCell sx={commonPadding}><h2 className="font-medium">Name</h2></TableCell>
                            <TableCell sx={commonPadding}><h2 className="font-medium">Status</h2></TableCell>
                            <TableCell sx={commonPadding}><h2 className="font-medium">Actions</h2></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={5} align="center">
                                    <ClipLoader />
                                </TableCell>
                            </TableRow>
                        ) : (
                            hospitals.map((hospital, index) => (
                                <TableRow key={hospital._id}>
                                    <TableCell sx={commonPadding}>{index + 1}</TableCell>
                                    
                                    <TableCell sx={commonPadding}>{hospital.name}</TableCell>
                                    <TableCell sx={commonPadding}>{hospital.isActive ? "Active" : "Inactive"}</TableCell>
                                    <TableCell sx={commonPadding}>
                                        <div className="flex gap-2">
                                            <button
                                                className="bg-gray-200 hover:text-white duration-100 hover:bg-yellow-500 p-2 rounded"
                                                onClick={() => {
                                                    setEditHospital(hospital);
                                                    setImagePreview(`${cloudinary}/${hospital.image}`);
                                                }}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="bg-gray-200 hover:text-white duration-100 hover:bg-red-500 p-2 rounded"
                                                onClick={() => setDeleteHospital(hospital)}
                                            >
                                                <IoTrashOutline />
                                            </button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Edit Popup */}
            {editHospital && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
                        <h2 className="text-xl font-semibold mb-4">Edit Hospital</h2>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editHospital.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                           
                            <div>
                                <label className="block text-sm font-medium">Status</label>
                                <select
                                    name="isActive"
                                    value={editHospital.isActive}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                >
                                    <option value={true}>Active</option>
                                    <option value={false}>Inactive</option>
                                </select>
                            </div>

                           
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setEditHospital(null)}
                                    className="px-4 py-2 bg-gray-200 rounded"
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="px-4 py-2 bg-main text-white rounded">
                                    Update
                                </button>
                            </div>
                        </form>
                        <button
                            onClick={() => setEditHospital(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                        >
                            <MdClose size={24} />
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Popup */}
            {deleteHospital && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-lg font-semibold mb-4">Delete Hospital?</h2>
                        <p>Are you sure you want to delete <strong>{deleteHospital.name}</strong>?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setDeleteHospital(null)}
                                className="px-4 py-2 bg-gray-200 rounded"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete_Submit}
                                className="px-4 py-2 bg-red-600 text-white rounded"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminHospitals;
