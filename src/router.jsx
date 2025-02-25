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
import Wrapper from "./assets/components/Wrapper";
import UsersManager from "./pages/UsersManager";

const Approuter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Navbar />}>
          <Route path="/" element={<App />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/searchdonor"
            element={<Wrapper>{<SearchDonor />}</Wrapper>}
          />
          <Route
            path="/donor/:id"
            element={
              <Wrapper>
                <Donor />
              </Wrapper>
            }
          />
          <Route
            path="/newdonor"
            element={
              <Wrapper>
                <NewDonor />
              </Wrapper>
            }
          />
          <Route
            path="*"
            element={
              <Wrapper>
                <Page404 />
              </Wrapper>
            }
          />
          <Route
            path="/receiverdonations"
            element={
              <Wrapper>
                <ReceiverDonations />
              </Wrapper>
            }
          />
          <Route
            path="/changecollector"
            element={
              <Wrapper>
                <ChangeCollector />
              </Wrapper>
            }
          />
          <Route
            path="/checkprint"
            element={
              <Wrapper>
                <CheckPrint />
              </Wrapper>
            }
          />
          <Route
            path="/areastoprint"
            element={
              <Wrapper>
                <AreasToPrint />
              </Wrapper>
            }
          />
          <Route
            path="/collectorsmoviment"
            element={
              <Wrapper>
                <CollectorsMoviment />
              </Wrapper>
            }
          />
          <Route
            path="/countdonations"
            element={
              <Wrapper>
                <CountDonations />
              </Wrapper>
            }
          />
          <Route
            path="/createmensaldonations"
            element={
              <Wrapper>
                <CreateMensalDonations />
              </Wrapper>
            }
          />
          <Route
            path="/donationsreceived"
            element={
              <Wrapper>
                <DonationsReceived />
              </Wrapper>
            }
          />
          <Route
            path="/operators"
            element={
              <Wrapper>
                <Operators />
              </Wrapper>
            }
          />
          <Route
            path="/operatorwork"
            element={
              <Wrapper>
                <OperatorWork />
              </Wrapper>
            }
          />
          <Route
            path="/workhistory"
            element={
              <Wrapper>
                <WorkHistory />
              </Wrapper>
            }
          />
          <Route
            path="/worklist"
            element={
              <Wrapper>
                <WorkList />
              </Wrapper>
            }
          />
          <Route
            path="/usersmanager"
            element={
              <Wrapper>
                <UsersManager />
              </Wrapper>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default Approuter;
