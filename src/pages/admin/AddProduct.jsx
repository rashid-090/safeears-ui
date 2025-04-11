import React, { useState } from "react";
import { useDropzone } from "react-dropzone";
import { IoMdCloseCircle } from "react-icons/io";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { createProduct } from "../../redux/actions/admin/productActions";

const AddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    mrpPrice: "",
    salePrice: "",
    offer: "",
    status: "",
  });

  const [sizes, setSizes] = useState([]); // To store selected sizes
  const [currentSize, setCurrentSize] = useState(""); // For adding new sizes
  const [imageURL, setImageURL] = useState(null);
  const [moreImageURLs, setMoreImageURLs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Size options - you can customize these
  const sizeOptions = ["S", "M", "L", "XL", "XXL", "XXXL"];

  // Single Image Upload (Primary Image)
  const singleImageDropzone = useDropzone({
    accept: "image/*",
    maxFiles: 1,
    onDrop: (acceptedFiles) => {
      setImageURL(acceptedFiles[0]);
    },
  });

  const removeSingleImage = () => {
    setImageURL(null);
  };

  const removeMultipleImage = (index) => {
    setMoreImageURLs((prev) => prev.filter((_, i) => i !== index));
  };

  // Multiple Images Dropzone
  const multipleImageDropzone = useDropzone({
    accept: "image/*",
    multiple: true,
    onDrop: (acceptedFiles) => {
      setMoreImageURLs((prev) => [...prev, ...acceptedFiles]);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSizeAdd = () => {
    if (currentSize && !sizes.includes(currentSize)) {
      setSizes([...sizes, currentSize]);
      setCurrentSize("");
    }
  };

  const handleSizeRemove = (sizeToRemove) => {
    setSizes(sizes.filter(size => size !== sizeToRemove));
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate that at least one size is selected
    if (sizes.length === 0) {
      toast.error("Please select at least one size");
      return;
    }

    // Validate that at least one image is uploaded
    if (!imageURL && moreImageURLs.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("description", formData.description);
      data.append("mrpPrice", formData.mrpPrice);
      data.append("salePrice", formData.salePrice);
      data.append("offer", formData.offer);
      data.append("status", formData.status);

      // Append sizes as attributes
      sizes.forEach(size => {
        data.append("attributes[]", JSON.stringify({
          name: "size",
          value: size,
          isHighlight: false
        }));
      });

      // Append single image
      if (imageURL) {
        data.append("imageURL", imageURL);
      }

      // Append multiple images
      moreImageURLs.forEach((file, index) => {
        data.append(`moreImageURL[${index}]`, file);
      });

      await dispatch(createProduct(data));
      toast.success("Product added successfully!");
      navigate('/admin/products');
    } catch (err) {
      console.error(err);
      toast.error("Error while adding product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-semibold">Add Product</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow-lg grid grid-cols-1 md:grid-cols-2 gap-5"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title
          </label>
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
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            MRP Price
          </label>
          <input
            type="number"
            name="mrpPrice"
            value={formData.mrpPrice}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Sale Price
          </label>
          <input
            type="number"
            name="salePrice"
            value={formData.salePrice}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stock Status
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
            required
          >
            <option value="">Select Product Status</option>
            <option value="in stock">In Stock</option>
            <option value="out of stock">Out of Stock</option>
          </select>
        </div>

        {/* Size Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Available Sizes
          </label>
          <div className="flex items-center mt-1">
            <select
              value={currentSize}
              onChange={(e) => setCurrentSize(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
            >
              <option value="">Select a size</option>
              {sizeOptions.map((size) => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={handleSizeAdd}
              className="ml-2 px-3 py-2 bg-main text-white rounded-md hover:bg-green-600"
            >
              Add
            </button>
          </div>

          {/* Display selected sizes */}
          {sizes.length > 0 && (
            <div className="mt-2">
              <p className="text-sm text-gray-500">Selected Sizes:</p>
              <div className="flex flex-wrap gap-2 mt-1">
                {sizes.map((size) => (
                  <div
                    key={size}
                    className="flex items-center bg-gray-100 px-2 py-1 rounded"
                  >
                    <span>{size}</span>
                    <button
                      type="button"
                      onClick={() => handleSizeRemove(size)}
                      className="ml-1 text-red-500"
                    >
                      <IoMdCloseCircle />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Single Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Primary Image
          </label>
          <div
            {...singleImageDropzone.getRootProps()}
            className="mt-1 w-full py-10 border-2 border-dashed border-gray-300 rounded-md flex justify-center items-center text-gray-500 cursor-pointer"
          >
            <input
              {...singleImageDropzone.getInputProps()}
              className="hidden"
            />
            {imageURL ? (
              <div className="relative">
                <img
                  src={URL.createObjectURL(imageURL)}
                  alt="Uploaded"
                  className="h-32 object-contain rounded-md"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeSingleImage();
                  }}
                  className="absolute text-xl -top-2 -right-2 text-red-500 bg-white rounded-full"
                >
                  <IoMdCloseCircle />
                </button>
              </div>
            ) : (
              <p>Drag & drop an image here, or click to select one</p>
            )}
          </div>
        </div>

        {/* Multiple Images Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Additional Images</label>
          <div {...multipleImageDropzone.getRootProps()} className="mt-1 w-full py-10 border-2 border-dashed border-gray-300 rounded-md flex justify-center items-center text-gray-500 cursor-pointer">
            <input {...multipleImageDropzone.getInputProps()} className="hidden" />
            {moreImageURLs.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {moreImageURLs.map((file, index) => (
                  <div key={index} className="relative">
                    <img src={URL.createObjectURL(file)} alt={`Uploaded ${index + 1}`} className="h-20 object-contain rounded-md" />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeMultipleImage(index);
                      }}
                      className="absolute text-xl text-red-500 bg-white rounded-full -top-2 -right-2"
                    >
                      <IoMdCloseCircle />
                    </button>
                  </div>
                ))}
              </div>
            ) : <p>Drag & drop images here, or click to select multiple</p>}
          </div>
        </div>

        <button
          type="submit"
          className="p-2 px-5 font-medium bg-main text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-main"
          disabled={isLoading}
        >
          {isLoading ? "Adding Product..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;