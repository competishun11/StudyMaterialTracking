import React, { useState } from "react";
import { db } from "../firebase/config"; // Make sure the Firebase config is correctly imported
import { collection, query, where, getDocs } from "firebase/firestore"; // Import necessary Firestore functions
import LoginForm from "../components/Form/LoginForm";

const Home = () => {
  const [message, setMessage] = useState("");
  const [studentDetails, setStudentDetails] = useState(null);

  const handleFormSubmit = async (mobileNumber) => {
    setMessage("Fetching details...");

    // Convert mobileNumber to string for uniform query
    const mobileNumberString = String(mobileNumber);

    try {
      // Query for mobileNumber as string
      const studentQueryString = query(
        collection(db, "materialTrackingId"),
        where("mobileNumber", "==", mobileNumberString)
      );

      // Query for mobileNumber as number (if necessary)
      const studentQueryNumber = query(
        collection(db, "materialTrackingId"),
        where("mobileNumber", "==", Number(mobileNumber))
      );

      // Fetch documents using both queries
      const querySnapshotString = await getDocs(studentQueryString);
      const querySnapshotNumber = await getDocs(studentQueryNumber);

      if (!querySnapshotString.empty) {
        const studentData = querySnapshotString.docs[0].data();
        // console.log(studentData);
        setStudentDetails(studentData);
        setMessage(`Details for mobile number: ${mobileNumberString}`);
      } else if (!querySnapshotNumber.empty) {
        const studentData = querySnapshotNumber.docs[0].data();
        setStudentDetails(studentData);
        // console.log(studentData);
        setMessage(`Details for mobile number: ${mobileNumberString}`);
      } else {
        setMessage("No details found for this mobile number.");
      }
    } catch (error) {
      setMessage("Error fetching details. Please try again.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex flex-col items-center p-4">
        <h1 className="text-3xl font-bold text-center mb-6">
          Physical Study Material Tracking Information 2025-26
        </h1>
        <LoginForm onSubmit={handleFormSubmit} />
        <div id="message" className="text-center mt-4 text-lg">
          {message}
        </div>

        {studentDetails && (
          <div className="mt-8 w-full flex justify-center">
            <table className="student-info-table w-full md:max-w-[80%] border-collapse">
              <thead>
                <tr>
                  <th className="text-left py-2 px-4 border-b">Particulars</th>
                  <th className="text-left py-2 px-4 border-b">Details</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-2 px-4 border-b">Student Name</td>
                  <td className="py-2 px-4 border-b">{studentDetails.name}</td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Batch Name</td>
                  <td className="py-2 px-4 border-b">
                    {studentDetails.batchName}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Full Delivery Address</td>
                  <td className="py-2 px-4 border-b">
                    {studentDetails.address}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">Tracking ID</td>
                  <td className="py-2 px-4 border-b">
                    {studentDetails.trackingId}
                  </td>
                </tr>
                <tr>
                  <td className="py-2 px-4 border-b">
                    Track on Indian Postal Website
                  </td>
                  <td className="py-2 px-4 border-b">
                    <a
                      href="https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600"
                    >
                      Click here to track your consignment
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        <div
          id="warning"
          className="bg-yellow-100 border-l-4 border-yellow-500 rounded p-4 mt-6 max-w-2xl shadow-md"
        >
          <p>
            <strong className="text-yellow-800">Please Note:</strong>
          </p>
          <ul className="list-disc pl-4 text-gray-800 space-y-2">
            <li>
              Tracking Id provided will be activated at India Post Website
              within 2-3 Working Days.
            </li>
            <li>
              Your material will be delivered within 10-12 working days after
              filling out the Google Form.
            </li>
            <li>
              Do not pay any amount to the delivery person for this material. If
              you have any such experience, call us at{" "}
              <strong>74108-33331 (Vijay Sir)</strong>.
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
