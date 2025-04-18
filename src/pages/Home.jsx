import React, { useState } from "react";
import { db } from "../firebase/config";
import { collection, query, where, getDocs } from "firebase/firestore";
import LoginForm from "../components/Form/LoginForm";

const Home = () => {
  const [message, setMessage] = useState("");
  const [studentEntries, setStudentEntries] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0); // First one open by default

  const handleFormSubmit = async (mobileNumber) => {
    setMessage("Fetching details...");
    const mobileNumberString = String(mobileNumber);

    try {
      const studentQuery = query(
        collection(db, "materialTrackingId"),
        where("mobileNumber", "==", mobileNumberString)
      );
      const querySnapshot = await getDocs(studentQuery);

      if (!querySnapshot.empty) {
        const allStudents = querySnapshot.docs.map((doc) => doc.data());
        setStudentEntries(allStudents);
        setMessage(
          `Found ${allStudents.length} entr${
            allStudents.length === 1 ? "y" : "ies"
          } for mobile number: ${mobileNumberString}`
        );
        setActiveIndex(0); // Open first entry
      } else {
        setStudentEntries([]);
        setMessage("No details found for this mobile number.");
      }
    } catch (error) {
      setMessage("Error fetching details. Please try again.");
      setStudentEntries([]);
    }
  };

  const getTrackingUrl = (courierPartner, trackingId) => {
    courierPartner = courierPartner.toLowerCase().trim();
    if (courierPartner === "india post") {
      return "https://www.indiapost.gov.in/_layouts/15/dop.portal.tracking/trackconsignment.aspx";
    } else if (courierPartner === "delhivery") {
      return `https://www.delhivery.com/track/package/${trackingId}`;
    } else if (courierPartner === "ecomexpress") {
      return `https://www.ecomexpress.in/tracking/?awb_field=${trackingId}`;
    } else if (courierPartner === "bfast") {
      return `https://www.bfastservices.com/tracking?awb=${trackingId}`;
    } else {
      return "#";
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

        {studentEntries.length > 0 && (
          <div className="mt-8 w-full flex flex-col items-center gap-4">
            {studentEntries.map((student, index) => (
              <div
                key={index}
                className="w-full md:max-w-[80%] border rounded shadow"
              >
                <button
                  className="w-full text-left px-4 py-3 bg-gray-100 hover:bg-gray-200 font-semibold"
                  onClick={() => setActiveIndex(index)}
                >
                  {student.trackingId}
                </button>
                {activeIndex === index && (
                  <div className="p-4 bg-white">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr>
                          <th className="text-left py-2 px-4 border-b">
                            Particulars
                          </th>
                          <th className="text-left py-2 px-4 border-b">
                            Details
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-2 px-4 border-b">Student Name</td>
                          <td className="py-2 px-4 border-b">{student.name}</td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b">Batch Name</td>
                          <td className="py-2 px-4 border-b">
                            {student.batchName}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b">
                            Full Delivery Address
                          </td>
                          <td className="py-2 px-4 border-b">
                            {student.address}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b">Tracking ID</td>
                          <td className="py-2 px-4 border-b">
                            {student.trackingId}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b">
                            Courier Partner
                          </td>
                          <td className="py-2 px-4 border-b">
                            {student.courierPartner}
                          </td>
                        </tr>
                        <tr>
                          <td className="py-2 px-4 border-b">
                            Track on Courier Website
                          </td>
                          <td className="py-2 px-4 border-b">
                            <a
                              href={getTrackingUrl(
                                student.courierPartner,
                                student.trackingId
                              )}
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
              </div>
            ))}
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
