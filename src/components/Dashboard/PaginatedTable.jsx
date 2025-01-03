import React from "react";
import { usePagination } from "../../context/PaginationContext";
import { useData } from "../../context/DataContext";

const PaginatedTable = () => {
  const { currentPage, goToPage } = usePagination();
  const { data, loading, error } = useData();

  const handleNext = () => goToPage(currentPage + 1);
  const handlePrev = () => goToPage(currentPage - 1);

  return (
    <div className="table-container">
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <>
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Mobile Number</th>
                <th>Batch Name</th>
                <th>Full Delivery Address</th>
                <th>Tracking ID</th>
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.mobileNumber}</td>
                  <td>{row.batchName}</td>
                  <td>{row.address}</td>
                  <td>{row.trackingId}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination">
            <button onClick={handlePrev} disabled={currentPage === 1}>
              Previous
            </button>
            <span>Page {currentPage}</span>
            <button onClick={handleNext}>Next</button>
          </div>
        </>
      )}
    </div>
  );
};

export default PaginatedTable;
