// components/CheckoutAddressRow.js
import { useState } from "react";
import { FaEdit, FaEye, FaTrash } from "react-icons/fa";
import AddressForm from "./AddressForm";
import { useDispatch } from "react-redux";
import { updateAddress, deleteAddress } from "../redux/actions/user/addressActions";

const CheckoutAddressRow = ({
  item,
  selectedAddress,
  setSelectedAddress,
  onEditSuccess,
}) => {
  const dispatch = useDispatch();
  const [isViewing, setIsViewing] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleUpdateAddress = (data) => {
    dispatch(updateAddress(item._id, data)).then(() => {
      setIsEditing(false);
      if (onEditSuccess) onEditSuccess();
    });
  };

  const handleDeleteAddress = () => {
    dispatch(deleteAddress(item._id)).then(() => {
      setShowDeleteConfirm(false);
      if (onEditSuccess) onEditSuccess();
      // Deselect if this was the selected address
      if (selectedAddress === item._id) {
        setSelectedAddress(null);
      }
    });
  };

  return (
    <div className="border border-main p-3 my-2 rounded">
      <div className="flex items-center gap-3">
        <input
          type="radio"
          name="address"
          checked={selectedAddress === item._id}
          onChange={() => setSelectedAddress(item._id)}
        />
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <p className="font-semibold">{item.name}</p>
              <p className="text-gray-600">{item.address}</p>
              <p className="text-gray-600">
                {item.locality}, {item.city}, {item.state} - {item.pinCode}
              </p>
              <p className="text-gray-600">Phone: {item.phoneNumber}</p>
              {item.alternatePhoneNumber && (
                <p className="text-gray-600">
                  Alternate Phone: {item.alternatePhoneNumber}
                </p>
              )}
              {item.landMark && (
                <p className="text-gray-600">Landmark: {item.landMark}</p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setIsViewing(!isViewing)}
                className="text-main hover:text-main-dark"
                title="View details"
              >
                <FaEye size={18} />
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="text-blue-600 hover:text-blue-800"
                title="Edit address"
              >
                <FaEdit size={18} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="text-red-600 hover:text-red-800"
                title="Delete address"
              >
                <FaTrash size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {isViewing && (
        <div className="mt-3 p-3 bg-gray-50 rounded">
          <h4 className="font-semibold mb-2">Address Details:</h4>
          <p>
            <span className="font-medium">Name:</span> {item.name}
          </p>
          <p>
            <span className="font-medium">Address:</span> {item.address}
          </p>
          <p>
            <span className="font-medium">Locality:</span> {item.locality}
          </p>
          <p>
            <span className="font-medium">City:</span> {item.city}
          </p>
          <p>
            <span className="font-medium">State:</span> {item.state}
          </p>
          <p>
            <span className="font-medium">Pincode:</span> {item.pinCode}
          </p>
          <p>
            <span className="font-medium">Phone:</span> {item.phoneNumber}
          </p>
          {item.alternatePhoneNumber && (
            <p>
              <span className="font-medium">Alternate Phone:</span>{" "}
              {item.alternatePhoneNumber}
            </p>
          )}
          {item.landMark && (
            <p>
              <span className="font-medium">Landmark:</span> {item.landMark}
            </p>
          )}
          <p>
            <span className="font-medium">Address Type:</span>{" "}
            {item.addressType || "Not specified"}
          </p>
          <button
            onClick={() => setIsViewing(false)}
            className="mt-2 text-sm text-blue-600 hover:underline"
          >
            Close details
          </button>
        </div>
      )}

      {isEditing && (
        <AddressForm
          initialValues={item}
          onSubmit={handleUpdateAddress}
          onCancel={() => setIsEditing(false)}
          isEditing={true}
        />
      )}

      {showDeleteConfirm && (
        <div className="mt-3 p-4 bg-red-50 rounded border border-red-200">
          <h4 className="font-semibold text-red-700 mb-3">
            Confirm Address Deletion
          </h4>
          <p className="mb-4">
            Are you sure you want to delete this address? This action cannot be
            undone.
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={() => setShowDeleteConfirm(false)}
              className="px-4 py-2 text-sm bg-gray-200 hover:bg-gray-300 rounded"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAddress}
              className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded"
            >
              Delete Address
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutAddressRow;