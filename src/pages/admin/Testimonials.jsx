import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import ReactModal from "react-modal";
import toast from "react-hot-toast";
import axios from "axios";
import { URL } from "../../Common/api";
import { config } from "../../Common/configurations";

const Testimonials = () => {
    const [testimonials, setTestimonials] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [testimonialToDelete, setTestimonialToDelete] = useState(null);
    const [editingTestimonial, setEditingTestimonial] = useState(null);
    const [name, setName] = useState("");
    const [text, setText] = useState("");
    const [error, setError] = useState("");
    const [isReordering, setIsReordering] = useState(false);

    useEffect(() => {
        fetchTestimonials();
    }, []);
    
    const fetchTestimonials = async () => {
        try {
            const res = await axios.get(`${URL}/admin/testimonials`, config);
            if (res.status === 200) {
                // Sort testimonials by order if available
                const sortedTestimonials = res.data.testimonials.sort((a, b) => 
                    (a.order || 0) - (b.order || 0)
                );
                setTestimonials(sortedTestimonials);
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to fetch testimonials");
        }
    };

    const handleSaveTestimonial = async () => {
        if (text.trim().length < 10) {
            setError("Testimonial text must be at least 10 characters.");
            return;
        }
        setError("");
    
        try {
            let res;
            if (editingTestimonial) {
                // Keep the existing order when editing
                const currentOrder = editingTestimonial.order || 
                    testimonials.findIndex(t => t._id === editingTestimonial._id) + 1;
                
                res = await axios.put(
                    `${URL}/admin/testimonial/${editingTestimonial._id}`, 
                    { name, text, order: currentOrder }, 
                    config
                );
            } else {
                // For new testimonials, set order to 1 and increment all others
                // First, create the new testimonial with order 1
                res = await axios.post(
                    `${URL}/admin/testimonial`, 
                    { name, text, order: 1 }, 
                    config
                );
                
                // Then, if successful, get all testimonials and reorder them
                if (res.status) {
                    // Get all testimonials including the new one
                    const allTestimonialsRes = await axios.get(`${URL}/admin/testimonials`, config);
                    if (allTestimonialsRes.status === 200) {
                        const allTestimonials = allTestimonialsRes.data.testimonials;
                        // Find the new testimonial (should be the one with order 1)
                        const newTestimonialId = res.data.testimonial._id;
                        
                        // Create a new ordered array with the new testimonial first
                        const reorderedIds = [newTestimonialId];
                        // Add all other testimonial IDs
                        allTestimonials.forEach(testimonial => {
                            if (testimonial._id !== newTestimonialId) {
                                reorderedIds.push(testimonial._id);
                            }
                        });
                        
                        // Update the order in the backend
                        await axios.post(
                            `${URL}/admin/testimonial/order`, 
                            { testimonialIds: reorderedIds }, 
                            config
                        );
                    }
                }
            }
    
            if (res.status) {
                toast.success(editingTestimonial ? "Testimonial updated." : "Testimonial added.");
                
                // Refresh testimonials from server to ensure order is correct
                await fetchTestimonials();
                
                setShowModal(false);
                setName("");
                setText("");
                setEditingTestimonial(null);
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to save testimonial");
        }
    };

    const openDeleteConfirmation = (testimonial) => {
        setTestimonialToDelete(testimonial);
        setShowDeleteConfirmation(true);
    };

    const handleDelete = async () => {
        if (!testimonialToDelete) return;
        
        try {
            const res = await axios.delete(`${URL}/admin/testimonial/${testimonialToDelete._id}`, config);
            if (res.status === 200) {
                // Remove from local state
                setTestimonials(testimonials.filter(t => t._id !== testimonialToDelete._id));
                toast.success("Testimonial deleted successfully.");
                setShowDeleteConfirmation(false);
                setTestimonialToDelete(null);
            }
        } catch (err) {
            console.log(err);
            toast.error("Failed to delete testimonial");
        }
    };

    const handleDragEnd = async (result) => {
        const { destination, source } = result;
        if (!destination || destination.index === source.index) return;

        setIsReordering(true);

        // Update local state for immediate UI feedback
        const reorderedTestimonials = [...testimonials];
        const [movedItem] = reorderedTestimonials.splice(source.index, 1);
        reorderedTestimonials.splice(destination.index, 0, movedItem);
        setTestimonials(reorderedTestimonials);

        // Prepare data for API - send complete ordered list with IDs
        const orderedIds = reorderedTestimonials.map(testimonial => testimonial._id);

        try {
            // Send just the ordered IDs to the backend
            await axios.post(
                `${URL}/admin/testimonial/order`, 
                { testimonialIds: orderedIds }, 
                config
            );
            
        } catch (err) {
            console.log(err);
            toast.error("Failed to update testimonial order");
            // Revert to original order on error
            fetchTestimonials();
        } finally {
            setIsReordering(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4">
            <h2 className="text-center text-2xl font-bold mb-6">Testimonials</h2>
            <button
                onClick={() => { setShowModal(true); setEditingTestimonial(null); setName(""); setText(""); }}
                className="mb-6 bg-main text-white py-2 px-4 rounded-md hover:bg-opacity-80"
                disabled={isReordering}
            >
                Add Testimonial
            </button>

            <div className="mb-4 bg-blue-50 p-3 rounded border border-blue-200">
                <p className="text-blue-700 text-sm font-medium">
                    <span className="font-bold">Tip:</span> Drag and drop testimonials to rearrange their order. The order will be saved automatically.
                </p>
            </div>

            

            <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="droppable">
                    {(provided) => (
                        <div {...provided.droppableProps} ref={provided.innerRef}>
                            {testimonials.length === 0 ? (
                                <h1 className="text-center text-gray-500 py-8">No Testimonials</h1>
                            ) : (
                                testimonials.map((testimonial, index) => (
                                    <Draggable 
                                        key={testimonial._id} 
                                        draggableId={testimonial._id} 
                                        index={index}
                                        isDragDisabled={isReordering}
                                    >
                                        {(provided) => (
                                            <div
                                                className="bg-white p-4 mb-4 rounded shadow-md border-l-4 border-main"
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <p className="font-semibold">{testimonial.name}</p>
                                                        <p className="mt-2">{testimonial.text}</p>
                                                    </div>
                                                    <div className="text-gray-400 text-sm">
                                                        Order: {index + 1}
                                                    </div>
                                                </div>
                                                <div className="flex justify-end space-x-2 mt-2">
                                                    <button
                                                        onClick={() => { 
                                                            setEditingTestimonial(testimonial); 
                                                            setName(testimonial.name); 
                                                            setText(testimonial.text); 
                                                            setShowModal(true); 
                                                        }}
                                                        className="text-main hover:underline"
                                                        disabled={isReordering}
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => openDeleteConfirmation(testimonial)}
                                                        className="text-red-500 hover:underline"
                                                        disabled={isReordering}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))
                            )}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </DragDropContext>

            {/* Add/Edit Testimonial Modal */}
            <ReactModal
                isOpen={showModal}
                onRequestClose={() => setShowModal(false)}
                contentLabel="Add/Edit Testimonial"
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "black"
                    },
                    content: {
                        position: "static",
                        maxWidth: "500px",
                        width: "90%",
                        padding: "20px",
                        borderRadius: "8px",
                        margin: "auto",
                    },
                }}
            >
                <h2 className="text-center text-xl font-bold mb-4">{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</h2>
                <div>
                    <label htmlFor="name" className="block text-gray-700">Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        value={name} 
                        onChange={(e) => setName(e.target.value)} 
                        placeholder="Enter name"  
                        className="w-full px-3 py-2 border rounded-lg mb-4 outline-main" 
                    />
                </div>
                <div>
                    <label htmlFor="text" className="block text-gray-700">Testimonial Text</label>
                    <textarea 
                        id="text" 
                        value={text} 
                        onChange={(e) => setText(e.target.value)} 
                        placeholder="Testimonial" 
                        className="w-full px-3 py-2 border outline-main rounded-lg mb-4" 
                        rows="4"
                    ></textarea>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <div className="flex justify-between mt-4">
                    <button 
                        onClick={() => setShowModal(false)} 
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-opacity-80"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleSaveTestimonial} 
                        className="bg-main text-white py-2 px-4 rounded-md hover:bg-opacity-80"
                    >
                        Save Testimonial
                    </button>
                </div>
            </ReactModal>

            {/* Delete Confirmation Modal */}
            <ReactModal
                isOpen={showDeleteConfirmation}
                onRequestClose={() => setShowDeleteConfirmation(false)}
                contentLabel="Confirm Delete"
                style={{
                    overlay: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        color: "black"
                    },
                    content: {
                        position: "static",
                        maxWidth: "400px",
                        width: "90%",
                        padding: "20px",
                        borderRadius: "8px",
                        margin: "auto",
                    },
                }}
            >
                <h2 className="text-center text-xl font-bold mb-4">Confirm Delete</h2>
                <p className="text-center mb-6">
                    Are you sure you want to delete the testimonial from {testimonialToDelete?.name}?
                    This action cannot be undone.
                </p>
                <div className="flex justify-center space-x-4">
                    <button 
                        onClick={() => setShowDeleteConfirmation(false)} 
                        className="bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-opacity-80"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleDelete} 
                        className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-opacity-80"
                    >
                        Delete
                    </button>
                </div>
            </ReactModal>
        </div>
    );
};

export default Testimonials;