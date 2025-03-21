import React, { useState, useEffect } from "react";
import { FaEye } from "react-icons/fa";
import { FaEdit } from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { MdClose } from "react-icons/md";
import { MdFormatListBulletedAdd } from "react-icons/md";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Paper,
  IconButton,
  Button,
} from "@mui/material";
import { Link, useSearchParams } from "react-router-dom";
import { cloudinary } from "../../utils/cloudinaryBaseUrl";
import { toast } from "react-toastify";
import { IoMdCloseCircle } from "react-icons/io";
import {
  getProducts,
  updateProduct,
} from "../../redux/actions/admin/productActions";
import { useDispatch, useSelector } from "react-redux";
import { URL } from "../../Common/api";
import axios from "axios";
import Loading from "../../components/Loading";
import ClipLoader from "react-spinners/ClipLoader";

const AdminProducts = () => {
  const [rowsPerPage, setRowsPerPage] = useState(6);
  const [selectedProduct, setSelectedProduct] = useState(null); // To track selected product
  const [editProduct, setEditProduct] = useState(null); // To track the product being edited
  const [deleteProduct, setDeleteProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [flag, setFlag] = useState(false);
  const [newImagePreviews, setNewImagePreviews] = useState([]);
  const dispatch = useDispatch();

  const { products, loading, error, totalAvailableProducts } = useSelector(
    (state) => state.products
  );

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilter = (type, value) => {
    const params = new URLSearchParams(window.location.search);
    if (value === "") {
      if (type === "page") {
        setPage(1);
      }
      params.delete(type);
    } else {
      if (type === "page" && value === 1) {
        params.delete(type);
        setPage(1);
      } else {
        params.set(type, value);
        if (type === "page") {
          setPage(value);
        }
      }
    }
    setSearchParams(params.toString() ? "?" + params.toString() : "");
  };

  // Removing filters
  const removeFilters = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete("search");
    params.delete("page");
    params.delete("status");
    params.delete("startingDate");
    params.delete("endingDate");
    setSearch("");
    setStartingDate("");
    setEndingDate("");
    setSearchParams(params);
  };

  // Getting products details
  useEffect(() => {
    dispatch(getProducts(searchParams));
    const params = new URLSearchParams(window.location.search);
    const pageNumber = params.get("page");
    setPage(parseInt(pageNumber || 1));
  }, [searchParams, flag]);

  // Close the popup when clicked outside
  const handleClosePopup = (e) => {
    if (e.target.id === "popup-overlay") {
      setSelectedProduct(null);
      setEditProduct(null); // Close the edit popup as well
      setDeleteProduct(null); // Close the edit popup as well
    }
  };

  // Add event listener for outside click
  useEffect(() => {
    if (selectedProduct || editProduct || deleteProduct) {
      document.addEventListener("click", handleClosePopup);
    }
    return () => {
      document.removeEventListener("click", handleClosePopup);
    };
  }, [selectedProduct, editProduct, deleteProduct]);

  const handleView = (id) => {
    const product = products.find((prod) => prod._id === id);
    console.log(id);

    setSelectedProduct(product);
  };

  const handleEdit = async (id) => {
    const product = products.find((prod) => prod._id === id);
    setEditProduct(product);
    console.log(product)


  };

  const handleDelete = async (id) => {
    const product = products.find((prod) => prod._id === id);
    setDeleteProduct(product);

    // setDeleteProduct(null); // Close the edit popup after submission
  };

  const handleDeleteSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.delete(
        `${URL}/admin/product/${deleteProduct._id}`,
        { withCredentials: true }
      );
      console.log(res);
      if (res.status) {
        toast.success("Product deleted successfully.");
        setFlag((prev) => !prev);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error while deleting product.");
    } finally {
      setDeleteProduct(null);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    console.log(editProduct);

    try {
      // const res = await axios.patch(
      //   `${URL}/admin/product/${editProduct._id}`,
      //   editProduct
      // );

      const res = await dispatch(updateProduct({ id: editProduct._id, formData: editProduct }));
      console.log(res);
      setNewImagePreviews([])
      toast.success(`${editProduct.name} Product updated success`);
      setFlag((prev) => !prev);
    } catch (err) {
      console.log(err);
      toast.error("Error while updating product.");
    }
    // setFlag((prev)=>!prev)
    // alert(`Product with ID: ${editProduct._id} has been updated.`);
    setEditProduct(null); // Close the edit popup after submission
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditProduct({
      ...editProduct,
      [name]: value,
    });
  };

  const commonPadding = { padding: "8px 16px" };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e) => {
        setEditProduct((prev) => ({
          ...prev,
          imageURL: file, // Store the file
          imagePreview: e.target.result, // Store the preview
        }));
      };

      reader.readAsDataURL(file);
    }
  };


  const handleMultipleFilesChange = (event) => {
    const files = Array.from(event.target.files);
    if (files.length > 0) {
      // Get current previews
      const currentPreviews = [...newImagePreviews];
      const newPreviews = [];

      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newPreviews.push(e.target.result);
          // If we've processed all new files, update state with both old and new previews
          if (newPreviews.length === files.length) {
            setNewImagePreviews([...currentPreviews, ...newPreviews]);
          }
        };
        reader.readAsDataURL(file);
      });

      // Similar approach for the actual files
      setEditProduct((prev) => ({
        ...prev,
        moreImageURLs: [...(prev.moreImageURLs || []), ...files],
      }));
    }
  };
  const handleRemoveMultipleImage = (index) => {
    setEditProduct((prev) => ({
      ...prev,
      moreImageURL: prev.moreImageURL.filter((_, i) => i !== index),
    }));
  };

  const handleRemoveNewImagePreview = (index) => {
    // Remove the URL.revokeObjectURL line since we're using FileReader data URLs

    setNewImagePreviews(prev => prev.filter((_, i) => i !== index));

    // Also remove the file from the moreImageURLs array
    setEditProduct((prev) => ({
      ...prev,
      moreImageURLs: prev.moreImageURLs.filter((_, i) => i !== index),
    }));
  };



  const handleRemoveImage = (key) => {
    setEditProduct((prev) => ({ ...prev, [key]: null }));
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between w-full mb-4">
        <h1 className="text-2xl font-semibold">All Products</h1>
        <Link
          to="/admin/add-product"
          className="w-fit bg-main flex text-sm font-medium gap-2 items-center text-white p-2 px-4 hover:bg-yellow-600 duration-150 rounded-md"
        >
          <MdFormatListBulletedAdd className="text-xl" /> Add Product
        </Link>
      </div>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table" className="min-h-72">
          <TableHead>
            <TableRow>
              <TableCell sx={commonPadding}>
                <h2 className="font-medium">ID</h2>
              </TableCell>
              <TableCell sx={commonPadding}>
                <h2 className="font-medium">Product</h2>
              </TableCell>
              <TableCell sx={commonPadding}>
                <h2 className="font-medium">Offer Price</h2>
              </TableCell>
              <TableCell sx={commonPadding}>
                <h2 className="font-medium">Original Price</h2>
              </TableCell>
              <TableCell sx={commonPadding}>
                <h2 className="font-medium">Discount</h2>
              </TableCell>
              <TableCell sx={commonPadding}>
                <h2 className="font-medium">Stock</h2>
              </TableCell>
              <TableCell sx={commonPadding}>
                <h2 className="font-medium">Actions</h2>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody className="relative ">
            {loading ? (
              <TableRow className="relative   ">
                <div className="absolute z-[9999] w-full h-full  items-center  flex justify-center">
                  <ClipLoader />
                </div>
              </TableRow>
            ) : (
              products?.map((product, i) => (
                <TableRow key={product._id}>
                  <TableCell sx={commonPadding}>{i + 1}</TableCell>{" "}
                  {/* Product ID */}
                  <TableCell
                    sx={commonPadding}
                    onClick={() => handleView(product._id)}
                    className="hover:bg-gray-100 cursor-pointer"
                  >
                    <div className="flex items-center capitalize">
                      <img
                        src={`${cloudinary}/${product.imageURL}`}
                        alt={product.name}
                        className="h-14 w-14 rounded-full object-cover mr-4"
                      />
                      {product.name}
                    </div>
                  </TableCell>
                  <TableCell sx={commonPadding}>₹{product.salePrice}</TableCell>
                  <TableCell sx={commonPadding}>
                    <span className="line-through">₹{product.mrpPrice}</span>
                  </TableCell>
                  <TableCell sx={commonPadding}>
                    {Math.round(
                      ((product.mrpPrice - product.salePrice) /
                        product.mrpPrice) *
                      100
                    )}
                    %
                  </TableCell>
                  <TableCell className="capitalize" sx={commonPadding}>
                    {product.status}
                  </TableCell>
                  <TableCell sx={{ padding: "0px 16px" }}>
                    <div className="flex items-center justify-start gap-5">
                      <button
                        className="bg-gray-200 hover:text-white duration-100 hover:bg-blue-500 p-2"
                        onClick={() => handleView(product._id)}
                      >
                        <FaEye />
                      </button>
                      <button
                        className="bg-gray-200 hover:text-white duration-100 hover:bg-yellow-500 p-2"
                        onClick={() => handleEdit(product._id)}
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="bg-gray-200 hover:text-white duration-100 hover:bg-red-500 p-2"
                        onClick={() => handleDelete(product._id)}
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

      {/* Pagination */}

      {/* Product Details Popup */}
      {selectedProduct && (
        <div
          id="popup-overlay"
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full flex flex-col items-center gap-2 capitalize relative">
            <h2 className="text-xl font-semibold mb-4">Product Details</h2>
            <img
              className="h-52 object-contain rounded-2xl"
              src={`  ${cloudinary}/${selectedProduct.imageURL}`}
              alt={selectedProduct.name}
            />
            <p>
              <strong>ID:</strong> {selectedProduct._id}
            </p>
            <p>
              <strong>Title:</strong> {selectedProduct.name}
            </p>
            <p>
              <strong>Offer Price:</strong> ₹{selectedProduct.salePrice}
            </p>
            <p>
              <strong>Original Price:</strong> ₹{selectedProduct.mrpPrice}
            </p>
            <p>
              <strong>Discount:</strong>{" "}
              {Math.round(
                ((selectedProduct.mrpPrice - selectedProduct.salePrice) /
                  selectedProduct.mrpPrice) *
                100
              )}
              %
            </p>
            <p>
              <strong>Stock:</strong> {selectedProduct.status}
            </p>
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 w-fit bg-main hover:bg-yellow-400 duration-200 rounded-md p-1 "
            >
              <MdClose />
            </button>
          </div>
        </div>
      )}

      {/* Edit Product Popup */}
      {editProduct && (
        <div
          id="popup-overlay"
          className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50 overflow-auto"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full flex flex-col gap-4 relative">
            <h2 className="text-xl font-semibold mb-4">Edit Product</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="font-medium">Title</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editProduct.name}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-main"
                />
              </div>

              <div>
                <label className="font-medium">Offer Price</label>
                <input
                  type="number"
                  name="salePrice"
                  defaultValue={editProduct.salePrice}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-main"
                />
              </div>

              <div>
                <label className="font-medium">Original Price</label>
                <input
                  type="number"
                  name="mrpPrice"
                  defaultValue={editProduct.mrpPrice}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-main"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Stock Status
                </label>
                <select
                  name="status"
                  defaultValue={editProduct.status}
                  onChange={handleInputChange}
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main"
                  required
                >
                  <option value="">Select Product Status</option>
                  <option value="in stock">In Stock</option>
                  <option value="out of stock">Out of Stock</option>
                </select>
              </div>

              {/* Image URL */}
              <div>
                <label className="font-medium">Primary Image</label>
                {editProduct.imagePreview ? (
                  <div className="relative">
                    <img
                      src={editProduct.imagePreview}
                      alt="Primary"
                      className="h-32 object-contain rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveImage("imageURL")}
                      className="absolute text-xl -top-2 -right-2 text-red-500 bg-white rounded-full"
                    >
                      <IoMdCloseCircle />
                    </button>
                  </div>

                ) :
                  editProduct.imageURL ? (
                    <div className="relative">
                      <img
                        src={`  ${cloudinary}/${editProduct.imageURL}`}
                        alt="Primary"
                        className="h-32 object-contain rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage("imageURL")}
                        className="absolute text-xl -top-2 -right-2 text-red-500 bg-white rounded-full"
                      >
                        <IoMdCloseCircle />
                      </button>
                    </div>
                  ) : ""

                }


                <input
                  type="file"
                  name="imageURL"
                  onChange={handleFileChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-main"
                />
              </div>

              {/* Multiple Images */}
              <div>
                <label className="font-medium">Additional Images</label>

                {/* Display existing images */}
                <div className="flex flex-wrap gap-2 mb-2">
                  {editProduct.moreImageURL && editProduct.moreImageURL.length > 0 && (
                    <>
                      {editProduct.moreImageURL.map((url, index) => (
                        <div key={index} className="relative">
                          <img
                            src={`${cloudinary}/${url}`}
                            alt={`Additional ${index + 1}`}
                            className="h-20 object-contain rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveMultipleImage(index)}
                            className="absolute text-xl -top-2 -right-2 text-red-500 bg-white rounded-full"
                          >
                            <IoMdCloseCircle />
                          </button>
                        </div>
                      ))}

                    </>

                  )}
                  {newImagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-20 object-contain rounded-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveNewImagePreview(index)}
                        className="absolute text-xl -top-2 -right-2 text-red-500 bg-white rounded-full"
                      >
                        <IoMdCloseCircle />
                      </button>
                    </div>
                  ))}
                </div>
                {/* Preview for newly selected images */}
                {newImagePreviews && newImagePreviews.length > 0 && (
                  <div className="mt-2">

                    <div className="flex flex-wrap gap-2">

                    </div>
                  </div>
                )}

                {/* File input for uploading new images */}
                <input
                  type="file"
                  name="moreImageURL"
                  multiple
                  onChange={handleMultipleFilesChange}
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-main"
                />


              </div>

              <div className="flex justify-between items-center text-sm">
                <button
                  type="button"
                  onClick={() => setEditProduct(null)}
                  className="bg-main text-white p-2 rounded-md hover:bg-red-600 flex gap-2 items-center"
                >
                  <MdClose />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-main text-white p-2 rounded-md hover:bg-green-600"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteProduct && (
        <div
          id="popup-overlay"
          className="fixed inset-0 bg-gray-600 bg-opacity-50 w-full flex justify-center items-center z-50"
        >
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-lg w-full flex flex-col gap-4 relative">
            <h2 className="text-xl font-semibold mb-4">
              Are You Sure Want to Delete This Product
            </h2>
            <form onSubmit={handleDeleteSubmit} className="space-y-4">
              <img
                className="h-52 object-contain rounded-2xl"
                src={`  ${cloudinary}/${deleteProduct.imageURL}`}
                alt={deleteProduct.name}
              />
              <p>
                <strong>ID:</strong> {deleteProduct._id}
              </p>
              <p>
                <strong>Title:</strong> {deleteProduct.name}
              </p>
              <p>
                <strong>Offer Price:</strong> ₹{deleteProduct.salePrice}
              </p>
              <p>
                <strong>Original Price:</strong> ₹{deleteProduct.mrpPrice}
              </p>
              <p>
                <strong>Discount:</strong>{" "}
                {Math.round(
                  ((deleteProduct.mrpPrice - deleteProduct.salePrice) /
                    deleteProduct.mrpPrice) *
                  100
                )}
                %
              </p>
              <p>
                <strong>Stock:</strong> {deleteProduct.status}
              </p>
              <div className="flex justify-between items-center text-sm">
                <button
                  type="button"
                  onClick={() => setDeleteProduct(null)}
                  className="bg-main text-white p-2 rounded-md hover:bg-gray-200 flex gap-2 items-center"
                >
                  <MdClose />
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-red-600 text-white p-2 rounded-md hover:bg-red-500"
                >
                  Delete
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
