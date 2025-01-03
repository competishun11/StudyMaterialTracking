import React, { createContext, useState, useContext } from "react";

const PaginationContext = createContext();

export const PaginationProvider = ({ children }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10); // Default limit per page

  const goToPage = (page) => {
    if (page > 0) {
      setCurrentPage(page);
    }
  };

  return (
    <PaginationContext.Provider
      value={{ currentPage, itemsPerPage, setCurrentPage, goToPage }}
    >
      {children}
    </PaginationContext.Provider>
  );
};

export const usePagination = () => useContext(PaginationContext);
