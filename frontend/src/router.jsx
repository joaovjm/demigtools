import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Navbar from "./assets/components/Navbar";
import App from "./App";
import Login from "./pages/Login";
import Donor from "./pages/Donor";
import SearchDonor from "./pages/SearchDonor";
import NewDonor from "./pages/NewDonor";
import Page404 from "./pages/Page404";

const Approuter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Navbar />}>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route path="/donor/:id" element={<Donor />} />
          <Route path="/searchdonor" element={<SearchDonor />} />
          <Route path="/newdonor" element={<NewDonor />} />
          <Route path="*" element={<Page404 />} />

        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Approuter;
