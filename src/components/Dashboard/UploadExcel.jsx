import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { db } from "../../firebase/config";
import { doc, setDoc, getDoc, collection } from "firebase/firestore";

const UploadExcel = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [totalRows, setTotalRows] = useState(0);
  const [uploadedRows, setUploadedRows] = useState(0);

  useEffect(() => {
    console.log("loading", loading);
  }, [loading]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage("Please select a file to upload.");
      return;
    }

    setLoading(true);
    setMessage("");
    setUploadedRows(0);

    try {
      const readerResult = await new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => resolve(new Uint8Array(e.target.result));
        reader.onerror = (err) => reject(err);

        reader.readAsArrayBuffer(file);
      });

      const workbook = XLSX.read(readerResult, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const jsonData = XLSX.utils.sheet_to_json(sheet);
      setTotalRows(jsonData.length);
      // console.log(jsonData);

      const collectionRef = collection(db, "materialTrackingId");

      for (const [index, row] of jsonData.entries()) {
        const trackingId = row["TRACKING ID"].toString().trim() || "";
        const courierPartner = row["Courier Partner"].trim() || "";

        if (!trackingId) {
          console.warn(`Skipping row ${index + 1}: Missing TRACKING ID`);
          continue;
        }
        console.log(trackingId);
        const docRef = doc(collectionRef, trackingId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.warn(
            `Skipping row ${index + 1}: Duplicate TRACKING ID ${trackingId}`
          );
          continue;
        }

        await setDoc(docRef, {
          name: row["Student Name"] || "",
          mobileNumber: row["Mobile Number"].toString() || "",
          batchName: row["Batch Name"] || "",
          address: row["Full Delivery Address"] || "",
          trackingId: trackingId,
          courierPartner: courierPartner.trim(),
        });

        setUploadedRows(index + 1);
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
          Upload Excel Data
        </h1>
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
          onClick={handleUpload}
          disabled={loading || !file}
          className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
            loading || !file
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          }`}
        >
          {loading ? (
            <div className="w-5 h-5 border-4 border-t-4 border-white rounded-full animate-spin"></div>
          ) : (
            "Upload"
          )}
        </button>

        {loading && (
          <div className="mt-4">
            <p className="text-sm font-medium text-center text-gray-700">
              {uploadedRows}/{totalRows} uploaded
            </p>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${(uploadedRows / totalRows) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {message && (
          <p
            className={`text-sm font-medium text-center ${
              message.includes("successfully")
                ? "text-green-600"
                : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadExcel;
