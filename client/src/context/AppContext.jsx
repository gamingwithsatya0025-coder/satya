import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import axios from "axios";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [userData, setUserData] = useState(JSON.parse(localStorage.getItem("user")) || null);
  const [cars, setCars] = useState([]);
  const backendUrl = "http://localhost:4000";

  // Fetch cars from backend
  const fetchCars = useCallback(async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/car/list`);
      if (response.data.success) {
        setCars(response.data.cars);
      }
    } catch (error) {
      console.error("Error fetching cars:", error);
    }
  }, [backendUrl]);

  useEffect(() => {
    Promise.resolve().then(() => fetchCars());
  }, [fetchCars]);

  const login = useCallback((newToken, user) => {
    setToken(newToken);
    setUserData(user);
    localStorage.setItem("token", newToken);
    localStorage.setItem("user", JSON.stringify(user));
  }, []);

  const logout = useCallback(() => {
    setToken("");
    setUserData(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }, []);

  const value = {
    token,
    setToken,
    userData,
    setUserData,
    backendUrl,
    cars,
    fetchCars,
    login,
    logout
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
