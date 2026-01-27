import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { URL } from "../../Common/api";
import { useDropzone } from "react-dropzone";
import { IoMdCloseCircle } from "react-icons/io";

const AddHospital = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: "",
        location: "",
    });
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(false);

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
        if (!formData.name ) {
            toast.error("Please fill all required fields");
            return;
        }

        setLoading(true);
        const data = new FormData();
        data.append("name", formData.name);
        if (image) {
            data.append("image", image);
        }

        try {
            await axios.post(`${URL}/admin/hospital`, data, {
                headers: { "Content-Type": "multipart/form-data" },
                withCredentials: true,
            });
            toast.success("Hospital added successfully");
            navigate("/admin/hospitals");
        } catch (error) {
            console.error("Error adding hospital:", error);
            toast.error("Failed to add hospital");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-4 space-y-6">
            <h1 className="text-2xl font-semibold">Add Hospital</h1>
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
                   

                 

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-main text-white p-2 rounded-md hover:bg-yellow-600 transition"
                    >
                        {loading ? "Adding..." : "Add Hospital"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddHospital;
