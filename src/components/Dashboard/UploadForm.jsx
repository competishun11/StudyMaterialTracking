import React, { useState } from "react";
import * as XLSX from "xlsx";
import { db } from "../../firebase/config";
import { collection, getDoc, setDoc, doc } from "firebase/firestore";

const UploadForm = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [totalRows, setTotalRows] = useState(0); // To track total rows in the Excel sheet
  const [uploadedRows, setUploadedRows] = useState(0); // To track the number of uploaded rows
  const [formData, setFormData] = useState({
    studentName: "",
    mobileNumber: "",
    batchName: "",
    address: "",
    trackingId: "",
    courierPartner: "",
  });

  // Handle form input changes
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file selection for Excel upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle single data form submission
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    try {
      const docRef = doc(db, "materialTrackingId", formData.trackingId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setMessage("Tracking ID already exists. Please use a unique ID.");
      } else {
        await setDoc(docRef, {
          name: formData.studentName || "",
          mobileNumber: formData.mobileNumber || "",
          batchName: formData.batchName || "",
          address: formData.address || "",
          trackingId: formData.trackingId || "",
          courierPartner: formData.courierPartner || "",
        });

        setMessage("Single entry uploaded successfully!");
        setFormData({
          studentName: "",
          mobileNumber: "",
          batchName: "",
          address: "",
          trackingId: "",
          courierPartner: "",
        }); // Reset the form after successful submission
      }
    } catch (err) {
      setMessage("Failed to upload single data. Please try again.");
      console.error("Error uploading single entry:", err);
    }

    setLoading(false);
  };

  // Handle bulk Excel file upload
  const handleFileUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    console.log("starting upload");
    setLoading(true);
    setMessage("");
    setUploadedRows(0); // Reset the uploaded rows count

    try {
      // Promisify the FileReader
      const readerResult = await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => resolve(new Uint8Array(e.target.result));
        reader.onerror = (err) => reject(err);

        reader.readAsArrayBuffer(file);
      });

      const workbook = XLSX.read(readerResult, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      // Convert Excel to JSON
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      // Set total rows to be uploaded
      setTotalRows(jsonData.length);

      // Upload data to Firebase
      for (const [index, row] of jsonData.entries()) {
        const trackingId = row["TRACKING ID"] || "";
        const docRef = doc(db, "materialTrackingId", trackingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.warn(`Skipping duplicate tracking ID: ${trackingId}`);
          continue; // Skip duplicate tracking IDs
        }

        await setDoc(docRef, {
          name: row["Student Name"] || "",
          mobileNumber: row["Mobile Number"] || "",
          batchName: row["Batch Name"] || "",
          address: row["Full Delivery Address"] || "",
          trackingId: trackingId,
          courierPartner: row["Courier Partner"] || "",
        });

        // Update the uploaded rows count
        setUploadedRows((prev) => prev + 1);
      }

      setMessage("Data uploaded successfully!");
    } catch (err) {
      setMessage("Failed to upload data. Please try again.");
      console.error("Upload error:", err);
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white shadow-lg rounded-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Upload Data
        </h1>

        {/* Single Data Upload Form */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">
            Single Data Entry
          </h2>
          <div>
            <label
              htmlFor="studentName"
              className="block text-sm font-medium text-gray-700"
            >
              Student Name
            </label>
            <input
              type="text"
              id="studentName"
              name="studentName"
              value={formData.studentName}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="mobileNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Mobile Number
            </label>
            <input
              type="text"
              id="mobileNumber"
              name="mobileNumber"
              value={formData.mobileNumber}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="batchName"
              className="block text-sm font-medium text-gray-700"
            >
              Batch Name
            </label>
            <input
              type="text"
              id="batchName"
              name="batchName"
              value={formData.batchName}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="address"
              className="block text-sm font-medium text-gray-700"
            >
              Full Delivery Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="trackingId"
              className="block text-sm font-medium text-gray-700"
            >
              Tracking ID
            </label>
            <input
              type="text"
              id="trackingId"
              name="trackingId"
              value={formData.trackingId}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <div>
            <label
              htmlFor="courierPartner"
              className="block text-sm font-medium text-gray-700"
            >
              Courier Partner
            </label>
            <input
              type="text"
              id="courierPartner"
              name="courierPartner"
              value={formData.courierPartner}
              onChange={handleFormChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-4 border-t-4 border-white rounded-full animate-spin"></div>
            ) : (
              "Upload Single Entry"
            )}
          </button>
        </form>

        {/* File Upload for Excel Data */}
        <div className="mt-6">
          <h2 className="text-xl font-semibold text-gray-800">
            Bulk Data Upload
          </h2>
          <div>
            <label
              htmlFor="file"
              className="block text-sm font-medium text-gray-700"
            >
              Select Excel File
            </label>
            <input
              id="file"
              type="file"
              accept=".xlsx, .xls"
              onChange={handleFileChange}
              disabled={loading}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>
          <button
            onClick={handleFileUpload}
            disabled={loading || !file}
            className={`mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {loading ? (
              <div className="w-5 h-5 border-4 border-t-4 border-white rounded-full animate-spin"></div>
            ) : (
              "Upload Excel File"
            )}
          </button>
        </div>

        {/* Status and Progress */}
        {message && (
          <div className="mt-4 text-center text-sm text-gray-600">
            {message}
          </div>
        )}

        {totalRows > 0 && (
          <div className="mt-2 text-center text-sm text-gray-600">
            Uploaded {uploadedRows} of {totalRows} rows.
          </div>
        )}
      </div>
    </div>
  );
};

export default UploadForm;
