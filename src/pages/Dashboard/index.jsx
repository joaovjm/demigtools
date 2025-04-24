import React, { useEffect, useState } from "react";
import "./index.css";
//import getDonationReceived from "../../helper/getDonationReceived";
import getDonationNotReceived from "../../helper/getDonationNotReceived";
import getDonationPerMonthReceived from "../../helper/getDonationPerMonthReceived";
import { DataNow } from "../../components/DataTime";
import TableConfirmation from "../../components/TableConfirmation";
import TableInOpen from "../../components/TableInOpen";
import ModalConfirmations from "../../components/ModalConfirmations";
import { toast, ToastContainer } from "react-toastify";

const Dashboard = () => {
  const caracterOperator = JSON.parse(localStorage.getItem("operatorData"));
  //const [qReceived, setQReceived] = useState(null); //Quantidade de fichas recebidas
  //const [valueReceived, setValueReceived] = useState(null); //Total de valor recebido
  const [confirmations, setConfirmations] = useState(null); //Quantidade de fichas na confirmação
  const [valueConfirmations, setValueConfirmations] = useState(null); //Total valor na confirmação
  const [openDonations, setOpenDonations] = useState(null); //Quantidades de fichas em aberto
  const [valueOpenDonations, setValueOpenDonations] = useState(null); //Total valor de fichas em aberto
  const [monthReceived, setMonthReceived] = useState(null); //Total de fichas recebidas em determinado mês
  const [valueMonthReceived, setValueMonthReceived] = useState(null); //Total valor dos recebidos do atual Mês
  const [receivedPercent, setReceivedPercent] = useState(null);
  const [active, setActive] = useState(false);

  const [donationConfirmation, setDonationConfirmation] = useState([]);
  const [fullNotReceivedDonations, setFullNotReceivedDonations] = useState([]);

  const [donationOpen, setDonationOpen] = useState([]);

  const [modalOpen, setModalOpen] = useState(false);

  const monthref = DataNow("mesref");

  const [status, setStatus] = useState();

  const donations = async () => {
    try{
      await getDonationNotReceived(
        setConfirmations,
        setValueConfirmations,
        setOpenDonations,
        setValueOpenDonations,
        setDonationConfirmation,
        setFullNotReceivedDonations
      );
      await getDonationPerMonthReceived(
        monthref,
        setMonthReceived,
        setValueMonthReceived,
        setReceivedPercent
      );


    } catch (error){
      console.error("Error fetching donations:", error);
    }
    if (status === "OK"){
      toast.success("Ficha cancelada com sucesso!", {
        position: "top-right",
        autoClose: 1000,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      
    } else if (status === "Update OK"){
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
  }, [active, modalOpen]);

  const handleClickCard = (e) => {
    setActive(e.currentTarget.id);
  };

  return (
    <main className="mainDashboard">
      {caracterOperator.operator_type === "Admin" && (
        <>
          <section className="sectionHeader">
            {/* Card 1 */}
            <div
              id="inConfirmation"
              className={`divCard ${
                active === "inConfirmation" ? "active" : ""
              }`}
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
            <div className="divCard">
              <div className="divHeader">
                <h3 className="h3Header">Recebida Mês Atual</h3>
              </div>
              <div className="divBody">
                <p>{receivedPercent}%</p>
                <p>R$ {valueMonthReceived}</p>
              </div>
            </div>
          </section>

          <section className="sectionGrafico">
            {active === "inConfirmation" ? (
              <>
                <TableConfirmation
                  donationConfirmation={donationConfirmation}
                  setModalOpen={setModalOpen}
                  setDonationOpen={setDonationOpen}
                />
              </>
            ) : active === "inOpen" ? (
              <TableInOpen
                fullNotReceivedDonations={fullNotReceivedDonations}
              />
            ) : null}
          </section>
          {modalOpen && (
            <ModalConfirmations
              donationOpen={donationOpen}
              onClose={() => setModalOpen(false)}
              setStatus={setStatus}
            />
          )}
          <ToastContainer/>
        </>
      )}
    </main>
  );
};

export default Dashboard;
