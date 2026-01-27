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

const AdminDoctors = () => {
    const [doctors, setDoctors] = useState([]);
    const [hospitals, setHospitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editDoctor, setEditDoctor] = useState(null);
    const [deleteDoctor, setDeleteDoctor] = useState(null);
    const [flag, setFlag] = useState(false);
    const [imagePreview, setImagePreview] = useState(null);

    const commonPadding = { padding: "8px 16px" };

    // Fetch Doctors and Hospitals
    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const [doctorsRes, hospitalsRes] = await Promise.all([
                    axios.get(`${URL}/admin/doctors`, { withCredentials: true }),
                    axios.get(`${URL}/admin/hospitals`, { withCredentials: true }) // Needed for edit dropdown
                ]);
                setDoctors(doctorsRes.data.doctors);
                setHospitals(hospitalsRes.data.hospitals);
            } catch (error) {
                console.error("Error fetching data:", error);
                // toast.error("Failed to fetch data");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [flag]);

    // Handle Delete
    const handleDelete_Submit = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`${URL}/admin/doctor/${deleteDoctor._id}`, { withCredentials: true });
            toast.success("Doctor deleted successfully");
            setFlag((prev) => !prev);
            setDeleteDoctor(null);
        } catch (error) {
            console.error("Error deleting doctor:", error);
            toast.error("Failed to delete doctor");
        }
    };

    // Handle Edit Input Change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditDoctor({ ...editDoctor, [name]: value });
    };

    // Handle Edit File Change
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setEditDoctor({ ...editDoctor, image: file });
            setImagePreview(window.URL.createObjectURL(file));
        }
    };

    // Handle Edit Submit
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("name", editDoctor.name);
        if (editDoctor.hospital && editDoctor.hospital._id) {
            formData.append("hospital", editDoctor.hospital._id); // Send ID if object
        } else {
            formData.append("hospital", editDoctor.hospital); // Send ID if string
        }

        formData.append("specialization", editDoctor.specialization || "");
        if (editDoctor.isActive !== undefined) {
            formData.append("isActive", editDoctor.isActive);
        }

        if (editDoctor.image instanceof File) {
            formData.append("image", editDoctor.image);
        }

        try {
            await axios.patch(`${URL}/admin/doctor/${editDoctor._id}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            toast.success("Doctor updated successfully");
            setFlag((prev) => !prev);
            setEditDoctor(null);
        } catch (error) {
            console.error("Error updating doctor:", error);
            toast.error("Failed to update doctor");
        }
    };

    return (
        <div className="p-4">
            <div className="flex items-center justify-between w-full mb-4">
                <h1 className="text-2xl font-semibold">Doctor Management</h1>
                <Link
                    to="/admin/add-doctor"
                    className="w-fit bg-main flex text-sm font-medium gap-2 items-center text-white p-2 px-4 hover:bg-yellow-600 duration-150 rounded-md"
                >
                    <MdFormatListBulletedAdd className="text-xl" /> Add Doctor
                </Link>
            </div>

            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={commonPadding}><h2 className="font-medium">#</h2></TableCell>
                            <TableCell sx={commonPadding}><h2 className="font-medium">Name</h2></TableCell>
                            <TableCell sx={commonPadding}><h2 className="font-medium">Hospital</h2></TableCell>
                            <TableCell sx={commonPadding}><h2 className="font-medium">Status</h2></TableCell>
                            <TableCell sx={commonPadding}><h2 className="font-medium">Actions</h2></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {loading ? (
                            <TableRow>
                                <TableCell colSpan={6} align="center">
                                    <ClipLoader />
                                </TableCell>
                            </TableRow>
                        ) : (
                            doctors.map((doctor, index) => (
                                <TableRow key={doctor._id}>
                                    <TableCell sx={commonPadding}>{index + 1}</TableCell>
                                    <TableCell sx={commonPadding}>{doctor.name}</TableCell>
                                    <TableCell sx={commonPadding}>{doctor.hospital?.name || "N/A"}</TableCell>
                                    <TableCell sx={commonPadding}>{doctor.isActive ? "Active" : "Inactive"}</TableCell>
                                    <TableCell sx={commonPadding}>
                                        <div className="flex gap-2">
                                            <button
                                                className="bg-gray-200 hover:text-white duration-100 hover:bg-yellow-500 p-2 rounded"
                                                onClick={() => {
                                                    // Ensure hospital ID is set correctly for select dropdown
                                                    const doctorToEdit = {
                                                        ...doctor,
                                                        hospital: doctor.hospital?._id || ""
                                                    };
                                                    setEditDoctor(doctorToEdit);
                                                    setImagePreview(`${cloudinary}/${doctor.image}`);
                                                }}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="bg-gray-200 hover:text-white duration-100 hover:bg-red-500 p-2 rounded"
                                                onClick={() => setDeleteDoctor(doctor)}
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
            {editDoctor && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative">
                        <h2 className="text-xl font-semibold mb-4">Edit Doctor</h2>
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={editDoctor.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium">Hospital</label>
                                <select
                                    name="hospital"
                                    value={editDoctor.hospital} // Expecting ID here
                                    onChange={handleInputChange}
                                    className="w-full p-2 border rounded"
                                    required
                                >
                                    <option value="">Select Hospital</option>
                                    {hospitals.map((hospital) => (
                                        <option key={hospital._id} value={hospital._id}>
                                            {hospital.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium">Status</label>
                                <select
                                    name="isActive"
                                    value={editDoctor.isActive}
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
                                    onClick={() => setEditDoctor(null)}
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
                            onClick={() => setEditDoctor(null)}
                            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
                        >
                            <MdClose size={24} />
                        </button>
                    </div>
                </div>
            )}

            {/* Delete Popup */}
            {deleteDoctor && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
                        <h2 className="text-lg font-semibold mb-4">Delete Doctor?</h2>
                        <p>Are you sure you want to delete <strong>{deleteDoctor.name}</strong>?</p>
                        <div className="flex justify-end gap-2 mt-4">
                            <button
                                onClick={() => setDeleteDoctor(null)}
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

export default AdminDoctors;
