import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { URL } from "../../Common/api";
import { useDropzone } from "react-dropzone";
import { IoMdCloseCircle } from "react-icons/io";

const AddDoctor = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        hospital: "",
        specialization: "",
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);
    const [hospitals, setHospitals] = useState([]);

    // Fetch Hospitals for Dropdown
    useEffect(() => {
        const fetchHospitals = async () => {
            try {
                const { data } = await axios.get(`${URL}/admin/hospitals`, { withCredentials: true });
                setHospitals(data.hospitals);
            } catch (error) {
                console.error("Error fetching hospitals:", error);
            }
        };
        fetchHospitals();
    }, []);

    const onDrop = (acceptedFiles) => {
        setImage(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: "image/*",
        multiple: false,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.hospital) {
            toast.error("Please fill all required fields");
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append("name", formData.name);
        data.append("hospital", formData.hospital);
        data.append("specialization", formData.specialization);
        if (image) {
            data.append("image", image);
        }

        try {
            await axios.post(`${URL}/admin/doctor`, data, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            toast.success("Doctor added successfully");
            navigate("/admin/doctors");
        } catch (error) {
            console.error("Error adding doctor:", error);
            toast.error("Failed to add doctor");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-semibold">Add Doctor</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg max-w-2xl">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Hospital</label>
                        <select
                            name="hospital"
                            value={formData.hospital}
                            onChange={handleChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
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
                    
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-main text-white p-2 rounded-md hover:bg-yellow-600 transition"
                    >
                        {loading ? "Adding..." : "Add Doctor"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddDoctor;
