import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { db } from "../../firebase/config";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { FiEdit, FiTrash2, FiCheck } from "react-icons/fi"; // Importing the icons

const DashboardHome = () => {
  const [totalData, setTotalData] = useState(0);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingRow, setEditingRow] = useState(null); // Track which row is being edited
  const [editedData, setEditedData] = useState({}); // Store the edited data

  // Fetch data from Firestore
  useEffect(() => {
    const fetchData = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "materialTrackingId")
        );
        setTotalData(querySnapshot.size); // Set the total data count
        const fetchedData = querySnapshot.docs.map((doc) => ({
          id: doc.id, // Save the document ID for deletion
          ...doc.data(),
        }));
        setData(fetchedData); // Set the data in the state
      } catch (err) {
        console.error("Error fetching data:", err);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Handle Delete Action
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this data?"
    );
    if (isConfirmed) {
      try {
        await deleteDoc(doc(db, "materialTrackingId", id));
        setData(data.filter((entry) => entry.id !== id)); // Remove deleted data from state
        setTotalData(totalData - 1); // Update total data count
        alert("Data deleted successfully!");
      } catch (error) {
        console.error("Error deleting document: ", error);
        alert("Error deleting data. Please try again.");
      }
    }
  };

  // Handle Edit Action
  const handleEdit = (id) => {
    setEditingRow(id);
    const rowData = data.find((entry) => entry.id === id);
    setEditedData(rowData); // Set the current row data to editedData
  };

  // Handle Change in Editable Fields
  const handleChange = (e, field) => {
    setEditedData({
      ...editedData,
      [field]: e.target.value,
    });
  };

  // Handle Submit Action
  const handleSubmit = async (id) => {
    try {
      const docRef = doc(db, "materialTrackingId", id);
      await updateDoc(docRef, editedData); // Update Firestore document
      setData(
        data.map((entry) =>
          entry.id === id ? { ...entry, ...editedData } : entry
        )
      ); // Update state
      setEditingRow(null); // Exit edit mode
      alert("Data updated successfully!");
    } catch (error) {
      console.error("Error updating document: ", error);
      alert("Error updating data. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl w-full bg-white shadow-lg rounded-lg p-6 space-y-6">
        {/* Total data count and buttons */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-lg font-medium text-gray-700">
            Total Data: {totalData}
          </p>
        </div>

        {/* Buttons to navigate to upload routes */}
        <div className="space-x-4">
          <Link to="/dashboard/uploadExcel">
            <button className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md">
              Bulk Upload
            </button>
          </Link>
          <Link to="/dashboard/uploadForm">
            <button className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-md">
              Single Upload
            </button>
          </Link>
        </div>

        {/* Data Table */}
        <div className="mt-6 overflow-x-auto">
          {loading ? (
            <div className="text-center text-gray-500">Loading...</div>
          ) : (
            <table className="min-w-full table-auto">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Sl No
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Student Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Mobile Number
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Batch Name
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Tracking ID
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Address
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Courier Partner
                  </th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {data.map((entry, index) => (
                  <tr key={entry.id} className="border-b">
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {editingRow === entry.id ? (
                        <input
                          type="text"
                          value={editedData.name || ""}
                          onChange={(e) => handleChange(e, "name")}
                          className="border px-2 py-1 rounded-md"
                        />
                      ) : (
                        entry.name
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {editingRow === entry.id ? (
                        <input
                          type="text"
                          value={editedData.mobileNumber || ""}
                          onChange={(e) => handleChange(e, "mobileNumber")}
                          className="border px-2 py-1 rounded-md"
                        />
                      ) : (
                        entry.mobileNumber
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {editingRow === entry.id ? (
                        <input
                          type="text"
                          value={editedData.batchName || ""}
                          onChange={(e) => handleChange(e, "batchName")}
                          className="border px-2 py-1 rounded-md"
                        />
                      ) : (
                        entry.batchName
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {editingRow === entry.id ? (
                        <input
                          type="text"
                          value={editedData.trackingId || ""}
                          onChange={(e) => handleChange(e, "trackingId")}
                          className="border px-2 py-1 rounded-md"
                        />
                      ) : (
                        entry.trackingId
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {editingRow === entry.id ? (
                        <input
                          type="text"
                          value={editedData.address || ""}
                          onChange={(e) => handleChange(e, "address")}
                          className="border px-2 py-1 rounded-md"
                        />
                      ) : (
                        entry.address
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700">
                      {editingRow === entry.id ? (
                        <input
                          type="text"
                          value={editedData.courierPartner || ""}
                          onChange={(e) => handleChange(e, "courierPartner")}
                          className="border px-2 py-1 rounded-md"
                        />
                      ) : (
                        entry.courierPartner
                      )}
                    </td>
                    <td className="px-4 py-2 text-sm text-gray-700 flex space-x-2 justify-center">
                      {editingRow === entry.id ? (
                        <button
                          onClick={() => handleSubmit(entry.id)}
                          className="bg-green-600 hover:bg-green-700 text-white rounded-md py-2 px-4 flex items-center"
                        >
                          <FiCheck className="mr-2" /> Submit
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEdit(entry.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded-md py-2 px-4 flex items-center"
                          >
                            <FiEdit className="mr-2" /> Edit
                          </button>
                          <button
                            onClick={() => handleDelete(entry.id)}
                            className="bg-red-600 hover:bg-red-700 text-white rounded-md py-2 px-4 flex items-center"
                          >
                            <FiTrash2 className="mr-2" /> Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
