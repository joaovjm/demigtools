import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Navbar from "./assets/components/Navbar";
import App from "./App";
import Login from "./pages/Login";
import Donor from "./pages/Donor";
import SearchDonor from "./pages/SearchDonor";

const Approuter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Navbar />}>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/donor/:id" element={<Donor />} />
          <Route path="/searchdonor" element={<SearchDonor />} />
          <Route path="*" />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Approuter;
