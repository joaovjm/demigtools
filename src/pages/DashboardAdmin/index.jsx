import React, { useContext, useEffect, useState, useRef } from "react";
import styles from "./dashboardadmin.module.css";
import getDonationReceived from "../../helper/getDonationReceived";
import getDonationNotReceived from "../../helper/getDonationNotReceived";
import getAllDonationsReceived from "../../helper/getAllDonationsReceived";
// import getDonationPerMonthReceived from "../../helper/getDonationPerMonthReceived";
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
import CollectorCard from "../../components/cards/CollectorCard";
import ConfirmationCard from "../../components/cards/ConfirmationCard";
import SchedulingCard from "../../components/cards/SchedulingCard";
import ReceivedCard from "../../components/cards/ReceivedCard";
import { getLeadsHistory } from "../../helper/getLeadsHistory";
import { leadsHistoryService } from "../../services/leadsHistoryService";
import TableLeadHistory from "../../components/TableLeadHistory";
import getOperatorMeta from "../../helper/getOperatorMeta";
import TableReceived from "../../components/TableReceived";
import DateRangePicker from "../../components/DateRangePicker";

const Dashboard = () => {
  const caracterOperator = JSON.parse(localStorage.getItem("operatorData"));
  const [confirmations, setConfirmations] = useState(null); //Quantidade de fichas na confirmação
  const [valueConfirmations, setValueConfirmations] = useState(null); //Total valor na confirmação
  const [openDonations, setOpenDonations] = useState(null); //Quantidades de fichas em aberto
  const [valueOpenDonations, setValueOpenDonations] = useState(null); //Total valor de fichas em aberto
  const [scheduling, setScheduling] = useState(0); //Total de leads agendadas
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [active, setActive] = useState(false);
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [datePickerPosition, setDatePickerPosition] = useState({ top: 0, left: 0 });
  const receivedCardRef = useRef(null);
  const [nowScheduled, setNowScheduled] = useState(null);
  const { operatorData, setOperatorData } = useContext(UserContext);

  const [donationConfirmationOpen, setDonationConfirmationOpen] = useState([]);
  const [donationOpen, setDonationOpen] = useState([]);
  const [scheduledOpen, setScheduledOpen] = useState([]);
  const [donationConfirmation, setDonationConfirmation] = useState([]);
  const [fullNotReceivedDonations, setFullNotReceivedDonations] = useState([]);
  const [scheduled, setScheduled] = useState([]);
  const [scheduledDonations, setScheduledDonations] = useState([]);
  const [operator, setOperator] = useState([]);
  const [operatorCasa, setOperatorCasa] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [scheduleCasa, setScheduleCasa] = useState([]);
  const [countLeads, setCountLeads] = useState([]);
  const [countLeadsCasa, setCountLeadsCasa] = useState([]);
  const [leadsNA, setLeadsNA] = useState([]);
  const [leadsNACasa, setLeadsNACasa] = useState([]);
  const [leadsNP, setLeadsNP] = useState([]);
  const [leadsNPCasa, setLeadsNPCasa] = useState([]);
  const [leadsSuccess, setLeadsSuccess] = useState([]);
  const [leadsSuccessCasa, setLeadsSuccessCasa] = useState([]);

  // Estados para doações recebidas
  const [valueReceived, setValueReceived] = useState(0); //Total valor recebido
  const [donationsReceived, setDonationsReceived] = useState([]); //Todas as doações recebidas
  const [meta, setMeta] = useState([]); //Meta dos operadores

  const [modalOpen, setModalOpen] = useState(false);

  const monthref = DataNow("mesref");

  const [status, setStatus] = useState();

  const [donationFilterPerId, setDonationFilterPerId] = useState("");
  const [viewType, setViewType] = useState("operator"); // "operator" or "collector"

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

      // Buscar doações recebidas de todos os operadores
      const receivedData = await getAllDonationsReceived({ startDate, endDate });
      setValueReceived(receivedData.totalValue);
      setDonationsReceived(receivedData.donation);

      await getScheduledLeads(null, setScheduled, setScheduling);
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

  const lead = async () => {
    const {
      operator,
      operatorCasa,
      scheduled,
      scheduledCasa,
      leadsNA,
      leadsNACasa,
      leadsNP,
      leadsNPCasa,
      leadsSuccess,
      leadsSuccessCasa,
      countLeads,
      countLeadsCasa
    } = await leadsHistoryService();
    setOperator(operator);
    setOperatorCasa(operatorCasa);
    setSchedule(scheduled);
    setScheduleCasa(scheduledCasa);
    setLeadsNA(leadsNA);
    setLeadsNACasa(leadsNACasa);
    setLeadsNP(leadsNP);
    setLeadsNPCasa(leadsNPCasa)
    setLeadsSuccess(leadsSuccess);
    setLeadsSuccessCasa(leadsSuccessCasa)
    setCountLeads(countLeads);
    setCountLeadsCasa(countLeadsCasa)
  };

  useEffect(() => {
    const getMeta = async () => {
      const metaInfo = await getOperatorMeta();
      setMeta(metaInfo);
    };
    getMeta();
  }, []);

  useEffect(() => {
    donations();
    lead();
  }, [active, modalOpen, status, operatorData, meta, startDate, endDate]);

  const handleClickCard = (e) => {
    setActive(e.currentTarget.id);
    setDonationFilterPerId(null);
    setViewType("operator"); // Reset to operator view when changing card
  };

  const handleViewTypeChange = (type) => {
    setViewType(type);
    setDonationFilterPerId(null); // Reset filter when changing view type
  };

  const handleReceivedCardContextMenu = (e) => {
    e.preventDefault();
    if (receivedCardRef.current) {
      const rect = receivedCardRef.current.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const pickerWidth = 280; // min-width do DateRangePicker
      const pickerHeight = 250; // altura estimada do DateRangePicker
      
      let left = rect.left;
      let top = rect.bottom + 10;
      
      // Ajustar se o calendário sair da tela à direita
      if (left + pickerWidth > viewportWidth) {
        left = viewportWidth - pickerWidth - 10;
      }
      
      // Ajustar se o calendário sair da tela abaixo
      if (top + pickerHeight > viewportHeight) {
        top = rect.top - pickerHeight - 10;
      }
      
      // Garantir que não saia da tela à esquerda ou acima
      if (left < 10) left = 10;
      if (top < 10) top = 10;
      
      setDatePickerPosition({
        top,
        left,
      });
      setIsDatePickerOpen(true);
    }
  };

  const handleDateSelect = (start, end) => {
    setStartDate(start || null);
    setEndDate(end || null);
  };

  return (
    <main className={styles.mainDashboard}>
      <>
        <section className={styles.sectionHeader}>
          <div className={styles.sectionHeaderItem}>
            <div
              ref={receivedCardRef}
              id="received"
              className={`${styles.divCard} ${active === "received" ? styles.active : ""}`}
              onClick={handleClickCard}
              onContextMenu={handleReceivedCardContextMenu}
            >
              <div className={styles.divHeader}>
                <h3 className={styles.h3Header}>Recebido</h3>
              </div>
              <div className={styles.divBody}>
                <p>R$ {valueReceived?.toFixed(2)}</p>
              </div>
            </div>
            {isDatePickerOpen && (
              <DateRangePicker
                isOpen={isDatePickerOpen}
                onClose={() => setIsDatePickerOpen(false)}
                onDateSelect={handleDateSelect}
                startDate={startDate}
                endDate={endDate}
                position={datePickerPosition}
              />
            )}
            {/* <div
              id="inScheduled"
              className={`${styles.divCard} ${active === "inScheduled" ? styles.active : ""}`}
              onClick={handleClickCard}
            >
              <div className={styles.divHeader}>
                <h3 className={styles.h3Header}>Agendados</h3>
              </div>
              <div className={styles.divBody}>
                <p>{scheduling}</p>
              </div>
            </div>*/}
            {/* Card 1 */}
            <div
              id="inConfirmation"
              className={`${styles.divCard} ${
                active === "inConfirmation" ? styles.active : ""
              }`}
              onClick={handleClickCard}
            >
              <div className={styles.divHeader}>
                <h3 className={styles.h3Header}>Em Confirmação</h3>
              </div>
              <div className={styles.divBody}>
                <p>{confirmations}</p>
                <p>R$ {valueConfirmations}</p>
              </div>
            </div>

            <div
              id="inOpen"
              className={`${styles.divCard} ${active === "inOpen" ? styles.active : ""}`}
              onClick={handleClickCard}
            >
              <div className={styles.divHeader}>
                <h3 className={styles.h3Header}>Em Aberto</h3>
              </div>
              <div className={styles.divBody}>
                <p>{openDonations}</p>
                <p>R$ {valueOpenDonations}</p>
              </div>
            </div>
            <div
              id="leads"
              className={`${styles.divCard} ${active === "leads" ? styles.active : ""}`}
              onClick={handleClickCard}
            >
              <div className={styles.divHeader}>
                <h3 className={styles.h3Header}>Leads</h3>
              </div>
              <div
                className={styles.divBody}
                style={{ display: "flex", justifyContent: "center" }}
              >
                <p>{confirmations}</p>
              </div>
            </div>
          </div>
        </section>

        {active && active !== "leads" ? (
          <section className={styles.sectionGrafic}>
            {active === "inOpen" && (
              <div className={styles.viewTypeSelector}>
                <button
                  className={`${styles.viewTypeButton} ${viewType === "operator" ? styles.active : ""}`}
                  onClick={() => handleViewTypeChange("operator")}
                >
                  Por Operadora
                </button>
                <button
                  className={`${styles.viewTypeButton} ${viewType === "collector" ? styles.active : ""}`}
                  onClick={() => handleViewTypeChange("collector")}
                >
                  Por Coletor
                </button>
              </div>
            )}
            
            <div className={styles.sectionTableAndInfo}>
              <div className={styles.sectionOperators}>
                {active === "received" ? (
                  <ReceivedCard
                    operatorCount={donationsReceived}
                    setDonationFilterPerId={setDonationFilterPerId}
                  />
                ) : active === "inConfirmation" ? (
                  <ConfirmationCard
                    operatorCount={donationConfirmation}
                    setDonationFilterPerId={setDonationFilterPerId}
                  />
                ) : active === "inOpen" ? (
                  viewType === "operator" ? (
                    <OperatorCard
                      operatorCount={fullNotReceivedDonations}
                      setDonationFilterPerId={setDonationFilterPerId}
                    />
                  ) : (
                    <CollectorCard
                      operatorCount={fullNotReceivedDonations}
                      setDonationFilterPerId={setDonationFilterPerId}
                    />
                  )
                ) : (
                  active === "inScheduled" && (
                    <SchedulingCard
                      operatorCount={scheduled}
                      setDonationFilterPerId={setDonationFilterPerId}
                    />
                  )
                )}
              </div>

              <div className={styles.sectionTable}>
                {active === "received" ? (
                  <TableReceived
                    donationsOperator={
                      donationFilterPerId
                        ? donationsReceived.filter(
                            (d) => d.operator_code_id === donationFilterPerId
                          )
                        : donationsReceived
                    }
                  />
                ) : active === "inConfirmation" ? (
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
                    filterType={viewType}
                  />
                ) : active === "inScheduled" ? (
                  <TableScheduled
                    scheduled={scheduled}
                    scheduledDonations={scheduledDonations}
                    setModalOpen={setModalOpen}
                    setScheduledOpen={setScheduledOpen}
                    setNowScheduled={setNowScheduled}
                    donationFilterPerId={donationFilterPerId}
                  />
                ) : null}
              </div>
            </div>
          </section>
        ) : (
          <section className={styles.sectionGrafic}>
            <div className={styles.divLeads}>
              <TableLeadHistory
                operator={operator}
                operatorCasa={operatorCasa}
                schedule={schedule}
                scheduleCasa={scheduleCasa}
                leadsNA={leadsNA}
                leadsNACasa={leadsNACasa}
                leadsNP={leadsNP}
                leadsNPCasa={leadsNPCasa}
                leadsSuccess={leadsSuccess}
                leadsSuccessCasa={leadsSuccessCasa}
                countLeads={countLeads}
                countLeadsCasa={countLeadsCasa}
              />
            </div>
          </section>
        )}

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
