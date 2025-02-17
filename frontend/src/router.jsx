import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import Navbar from "./assets/components/Navbar";
import App from "./App";
import Login from "./pages/Login";
import Donor from "./pages/Donor";
import SearchDonor from "./pages/SearchDonor";
import NewDonor from "./pages/NewDonor";
import Page404 from "./pages/Page404";
import ReceiverDonations from "./pages/ReceiverDonations";
import ChangeCollector from "./pages/ChangeCollector";
import CheckPrint from "./pages/CheckPrint";
import AreasToPrint from "./pages/AreasToPrint";
import CollectorsMoviment from "./pages/CollectorsMoviment";
import CountDonations from "./pages/CountDonations";
import CreateMensalDonations from "./pages/CreateMensalDonations";
import DonationsReceived from "./pages/DonationsReceived";
import Operators from "./pages/Operators";
import OperatorWork from "./pages/OperatorWork";
import WorkHistory from "./pages/WorkHistory";
import WorkList from "./pages/WorkList";


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
          <Route path="/receiverdonations" element={<ReceiverDonations />} />
          <Route path="/changecollector" element={<ChangeCollector />} />
          <Route path="/checkprint" element={<CheckPrint />} />
          <Route path="/areastoprint" element={<AreasToPrint />} />
          <Route path="/collectorsmoviment" element={<CollectorsMoviment />} />
          <Route path="/countdonations" element={<CountDonations />} />
          <Route path="/createmensaldonations" element={<CreateMensalDonations />} />
          <Route path="/donationsreceived" element={<DonationsReceived />} />
          <Route path="/operators" element={<Operators />} />
          <Route path="/operatorwork" element={<OperatorWork />} />
          <Route path="/workhistory" element={<WorkHistory />} />
          <Route path="/worklist" element={<WorkList />} />
         
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Approuter;
