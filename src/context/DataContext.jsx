import React, { createContext, useState, useContext, useEffect } from "react";
import {
  collection,
  getDocs,
  query,
  orderBy,
  startAfter,
  limit,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { usePagination } from "./PaginationContext";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const { currentPage, itemsPerPage } = usePagination();
  const [data, setData] = useState([]);
  const [lastVisible, setLastVisible] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async () => {
    setLoading(true);
    setError("");
    try {
      const collectionRef = collection(db, "students");
      const q = query(
        collectionRef,
        orderBy("name"), // Adjust field name for sorting
        startAfter(lastVisible || 0),
        limit(itemsPerPage)
      );

      const querySnapshot = await getDocs(q);
      const newData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      setData(newData);
      setLastVisible(querySnapshot.docs[querySnapshot.docs.length - 1]);
    } catch (err) {
      setError("Failed to fetch data. Please try again.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  return (
    <DataContext.Provider value={{ data, loading, error, fetchData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
