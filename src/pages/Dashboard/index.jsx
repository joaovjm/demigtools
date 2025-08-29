import React, { useContext, useEffect, useState } from "react";
import "./index.css";
//import getDonationReceived from "../../helper/getDonationReceived";
import getDonationNotReceived from "../../helper/getDonationNotReceived";
// import getDonationPerMonthReceived from "../../helper/getDonationPerMonthReceived";
import { DataNow } from "../../components/DataTime";
import TableConfirmation from "../../components/TableConfirmation";
import TableInOpen from "../../components/TableInOpen";
import ModalConfirmations from "../../components/ModalConfirmations";
import { toast } from "react-toastify";
import TableScheduled from "../../components/TableScheduled";
import getScheduledLeads from "../../helper/getScheduledLeads";
import ModalScheduled from "../../components/ModalScheduled";
import { UserContext } from "../../context/UserContext";
import ModalDonationInOpen from "../../components/ModalDonationInOpen";
import { useLocation } from "react-router";
import supabase from "../../helper/superBaseClient";
import MotivationalPhrases from "../../components/MotivationalPhrases";
import getOperatorMeta from "../../helper/getOperatorMeta";
import getDonationReceived from "../../helper/getDonationReceived";
import { getSchedulingRequest } from "../../helper/getSchedulingRequest";
import TableReceived from "../../components/TableReceived";

const Dashboard = () => {
  const caracterOperator = JSON.parse(localStorage.getItem("operatorData"));
  const [confirmations, setConfirmations] = useState(null); //Quantidade de fichas na confirmação
  const [valueConfirmations, setValueConfirmations] = useState(null); //Total valor na confirmação
  const [openDonations, setOpenDonations] = useState(null); //Quantidades de fichas em aberto
  const [valueOpenDonations, setValueOpenDonations] = useState(null); //Total valor de fichas em aberto
  const [valueMonthReceived, setValueMonthReceived] = useState(null); //Total valor dos recebidos do atual Mês
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
  const [donationFilterPerId, setDonationFilterPerId] = useState("");
  const [donationsOperator, setDonationsOperator] = useState()
  const [meta, setMeta] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  const monthref = DataNow("mesref");

  const [status, setStatus] = useState();

  const location = useLocation();

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
      const donationReceived = await getDonationReceived(
        operatorData.operator_code_id,
        meta
      );
      setValueMonthReceived(donationReceived.totalValue);
      setDonationsOperator(donationReceived.donation)
      if (operatorData.operator_type === "Operador Casa") {
        await getScheduledLeads(
          caracterOperator.operator_code_id,
          setScheduled,
          setScheduling,
          "Operador Casa"
        );
        await getSchedulingRequest({
          operatorID: operatorData.operator_code_id,
          setScheduled: setScheduled,
          scheduled: scheduled,
          scheduling: scheduling,
          setScheduling: setScheduling
        });
      } else {
        await getScheduledLeads(
          caracterOperator.operator_code_id,
          setScheduled,
          setScheduling
        );
        await getSchedulingRequest({
          operatorID: operatorData.operator_code_id,
          setScheduled: setScheduled,
          scheduled: scheduled,
          scheduling: scheduling,
          setScheduling: setScheduling
        });
      }
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
    const getMeta = async () => {
      const metaInfo = await getOperatorMeta(operatorData.operator_code_id);
      setMeta(metaInfo);
    };
    getMeta();
  }, []);

  useEffect(() => {
    donations();
  }, [active, modalOpen, status, operatorData, meta]);

  useEffect(() => {
    setActive(false);
    setDonationFilterPerId("");
    setModalOpen(false);
  }, [location.pathname]);

  const handleClickCard = (e) => {
    setActive(e.currentTarget.id);
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

          {/* Card 4 */}
          <div
            id="received"
            className={`divCard ${active === "received" ? "active" : ""}`}
            onClick={handleClickCard}
          >
            <div className="divHeader">
              <h3 className="h3Header">Recebida / Falta</h3>
            </div>
            <div className="divBody">
              <p>R$ {valueMonthReceived}</p>
              <p>R$ {meta?.[0]?.meta - valueMonthReceived}</p>
            </div>
          </div>
        </section>

        {!active && (
          <section className="motivational">
            <div className="motivational-card">{<MotivationalPhrases />}</div>
          </section>
        )}
        <section className="sectionGrafico">
          {active === "inConfirmation" ? (
            <>
              <TableConfirmation
                donationConfirmation={donationConfirmation}
                setModalOpen={setModalOpen}
                setDonationConfirmationOpen={setDonationConfirmationOpen}
              />
            </>
          ) : active === "inOpen" ? (
            <TableInOpen
              fullNotReceivedDonations={fullNotReceivedDonations}
              setDonationOpen={setDonationOpen}
              setModalOpen={setModalOpen}
            />
          ) : active === "inScheduled" ? (
            <TableScheduled
              scheduled={scheduled}
              setModalOpen={setModalOpen}
              setScheduledOpen={setScheduledOpen}
              setNowScheduled={setNowScheduled}
            />
          ) : active === "received" ? (
            <TableReceived donationsOperator={donationsOperator} />
          ) : null}
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
