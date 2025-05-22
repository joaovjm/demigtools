import React, { useContext, useEffect, useState } from "react";
import "./index.css";
//import getDonationReceived from "../../helper/getDonationReceived";
import getDonationNotReceived from "../../helper/getDonationNotReceived";
import getDonationPerMonthReceived from "../../helper/getDonationPerMonthReceived";
import { DataNow } from "../../components/DataTime";
import TableConfirmation from "../../components/TableConfirmation";
import TableInOpen from "../../components/TableInOpen";
import ModalConfirmations from "../../components/ModalConfirmations";
import { toast, ToastContainer } from "react-toastify";
import TableScheduled from "../../components/TableScheduled";
import getScheduledLeads from "../../helper/getScheduledLeads";
import ModalScheduled from "../../components/ModalScheduled";
import { UserContext } from "../../context/UserContext";
import ModalDonationInOpen from "../../components/ModalDonationInOpen";
import OperatorCard from "../../components/cards/OperatorCard";
import ConfirmationCard from "../../components/cards/ConfirmationCard";
import SchedulingCard from "../../components/cards/SchedulingCard";

const Dashboard = () => {
  const caracterOperator = JSON.parse(localStorage.getItem("operatorData"));
  const [confirmations, setConfirmations] = useState(null); //Quantidade de fichas na confirmação
  const [valueConfirmations, setValueConfirmations] = useState(null); //Total valor na confirmação
  const [openDonations, setOpenDonations] = useState(null); //Quantidades de fichas em aberto
  const [valueOpenDonations, setValueOpenDonations] = useState(null); //Total valor de fichas em aberto
  const [monthReceived, setMonthReceived] = useState(null); //Total de fichas recebidas em determinado mês
  const [valueMonthReceived, setValueMonthReceived] = useState(null); //Total valor dos recebidos do atual Mês
  const [receivedPercent, setReceivedPercent] = useState(null);
  const [scheduling, setScheduling] = useState(0); //Total de leads agendadas
  const [active, setActive] = useState(false);
  const [nowScheduled, setNowScheduled] = useState(null);
  const { operatorData, setOperatorData } = useContext(UserContext);

  const [donationConfirmationOpen, setDonationConfirmationOpen] = useState([]);
  const [donationOpen, setDonationOpen] = useState([]);
  const [scheduledOpen, setScheduledOpen] = useState([]);
  const [donationConfirmation, setDonationConfirmation] = useState([]);
  const [fullNotReceivedDonations, setFullNotReceivedDonations] = useState([]);
  const [scheduled, setScheduled] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  const monthref = DataNow("mesref");

  const [status, setStatus] = useState();

  const [donationFilterPerId, setDonationFilterPerId] = useState("");

  const donations = async () => {
    try {
      await getDonationNotReceived(
        setConfirmations,
        setValueConfirmations,
        setOpenDonations,
        setValueOpenDonations,
        setDonationConfirmation,
        setFullNotReceivedDonations,
        caracterOperator.operator_code_id,
        caracterOperator.operator_type
      );
      await getDonationPerMonthReceived(
        monthref,
        setMonthReceived,
        setValueMonthReceived,
        setReceivedPercent
      );
      await getScheduledLeads(
        null,
        setScheduled,
        setScheduling
      );
    } catch (error) {
      console.error("Error fetching donations:", error);
    }
    if (status === "OK") {
      toast.success("Ficha cancelada com sucesso!", {
        position: "top-right",
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    } else if (status === "Update OK") {
      toast.success("Ficha reagendada com sucesso!", {
        position: "top-right",
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
    setStatus(null);
  };

  useEffect(() => {
    donations();
  }, [active, modalOpen, status, operatorData]);

  const handleClickCard = (e) => {
    setActive(e.currentTarget.id);
    setDonationFilterPerId(null)
  };

  return (
    <main className="mainDashboard">
      <>
        <section className="sectionHeader">
          <div
            id="inScheduled"
            className={`divCard ${active === "inScheduled" ? "active" : ""}`}
            onClick={handleClickCard}
          >
            <div className="divHeader">
              <h3 className="h3Header">Agendados</h3>
            </div>
            <div className="divBody">
              <p>{scheduling}</p>
            </div>
          </div>
          {/* Card 1 */}
          <div
            id="inConfirmation"
            className={`divCard ${active === "inConfirmation" ? "active" : ""}`}
            onClick={handleClickCard}
          >
            <div className="divHeader">
              <h3 className="h3Header">Em Confirmação</h3>
            </div>
            <div className="divBody">
              <p>{confirmations}</p>
              <p>R$ {valueConfirmations}</p>
            </div>
          </div>

          <div
            id="inOpen"
            className={`divCard ${active === "inOpen" ? "active" : ""}`}
            onClick={handleClickCard}
          >
            <div className="divHeader">
              <h3 className="h3Header">Em Aberto</h3>
            </div>
            <div className="divBody">
              <p>{openDonations}</p>
              <p>R$ {valueOpenDonations}</p>
            </div>
          </div>
        </section>

        <section className="section-grafic">
          <div className="section-table-and-info">
            <div className="section-operators">
              {active === "inConfirmation" ? (
                <ConfirmationCard
                operatorCount={donationConfirmation}
                setDonationFilterPerId={setDonationFilterPerId}
                />
                
              ) : active === "inOpen" ? (
                <OperatorCard
                operatorCount={fullNotReceivedDonations}
                setDonationFilterPerId={setDonationFilterPerId}
              />
              ) : <SchedulingCard
                operatorCount={scheduled}
                setDonationFilterPerId={setDonationFilterPerId}
              />}
              
            </div>

            <div className="section-table">
              {active === "inConfirmation" ? (
                <TableConfirmation
                  donationConfirmation={donationConfirmation}
                  setModalOpen={setModalOpen}
                  setDonationConfirmationOpen={setDonationConfirmationOpen}
                  donationFilterPerId={donationFilterPerId}
                />
              ) : active === "inOpen" ? (
                <TableInOpen
                  fullNotReceivedDonations={fullNotReceivedDonations}
                  setDonationOpen={setDonationOpen}
                  setModalOpen={setModalOpen}
                  donationFilterPerId={donationFilterPerId}
                />
              ) : active === "inScheduled" ? (
                <TableScheduled
                  scheduled={scheduled}
                  setModalOpen={setModalOpen}
                  setScheduledOpen={setScheduledOpen}
                  setNowScheduled={setNowScheduled}
                  donationFilterPerId={donationFilterPerId}
                />
              ) : null}
            </div>
          </div>
        </section>
        {modalOpen && active === "inConfirmation" && (
          <ModalConfirmations
            donationConfirmationOpen={donationConfirmationOpen}
            onClose={() => setModalOpen(false)}
            setStatus={setStatus}
          />
        )}
        {modalOpen && active === "inScheduled" && (
          <ModalScheduled
            scheduledOpen={scheduledOpen}
            onClose={() => setModalOpen(false)}
            setStatus={setStatus}
            nowScheduled={nowScheduled}
          />
        )}
        {modalOpen && active === "inOpen" && (
          <ModalDonationInOpen
            donationOpen={donationOpen}
            onClose={() => setModalOpen(false)}
          />
        )}
      </>
    </main>
  );
};

export default Dashboard;
