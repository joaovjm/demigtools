import styles from "./modalworklist.module.css";
import updateRequestSelected from "../../helper/updateRequestSelected";
import { fetchMaxAndMedDonations } from "../../services/worklistService";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { DataNow, DataSelect } from "../DataTime";
import { getCampains } from "../../helper/getCampains";
import { UserContext } from "../../context/UserContext";
import { toast } from "react-toastify";
import { insertDonation } from "../../helper/insertDonation";
import { updateRequestList } from "../../helper/updateRequestList";

const ModalWorklist = ({
  setModalOpen,
  workListSelected,
  setActive,
  workSelect,
}) => {
  const { operatorData } = useContext(UserContext);
  const [newDonationOpen, setNewDonationOpen] = useState(false);
  const [newSchedulingOpen, setNewSchedulingOpen] = useState(false);
  const [maxDonation, setMaxDonation] = useState([]);
  const [penultimate, setPenultimate] = useState();
  const [campains, setCampains] = useState([]);
  const [campainSelected, setCampainSelected] = useState("");
  const [value, setValue] = useState("");
  const [date, setDate] = useState("");
  const [observation, setObservation] = useState("");
  const [dateScheduling, setDateScheduling] = useState("");
  const [telScheduling, setTelScheduling] = useState("");
  const [observationScheduling, setObservationScheduling] = useState("");
  const [extraValue, setExtraValue] = useState("");
  const [maxPeriod, setMaxPeriod] = useState([]);
  const [countNotReceived, setCountNotReceived] = useState(0);
  const [lastThreeDonations, setLastThreeDonations] = useState([]);
  const {
    id,
    donor_id,
    request_name,
    donor: { donor_name, donor_tel_1 },
  } = workListSelected;
  const donor_tel_2 = workListSelected?.donor_tel_2b?.donor_tel_2?.donor_tel_2;
  const donor_tel_3 = workListSelected?.donor_tel_3b?.donor_tel_3?.donor_tel_3;
  const donor_mensal_day =
    workListSelected?.donor_mensal?.donor_mensal?.donor_mensal_day;
  const donor_monthly_fee =
    workListSelected?.donor_mensal?.donor_mensal?.donor_mensal_monthly_fee;
  const navigate = useNavigate();
  const MaxAndMedDonations = async () => {
    const {
      maxGeneral,
      maxPeriod,
      penultimate,
      countNotReceived,
      lastThreeDonations,
    } = await fetchMaxAndMedDonations(
      workListSelected.donor_id,
      workListSelected.request_name
    );
    if ([maxGeneral, maxPeriod, penultimate, countNotReceived].some((v) => v)) {
      setPenultimate(penultimate);
      setMaxDonation(maxGeneral);
      setMaxPeriod(maxPeriod);
      setCountNotReceived(countNotReceived);
      setLastThreeDonations(lastThreeDonations || []);
    }
  };

  const fetchCampains = async () => {
    const response = await getCampains();
    setCampains(response);
  };

  useEffect(() => {
    MaxAndMedDonations();
    fetchCampains();
  }, []);

  const handleClose = () => {
    setModalOpen(false);
    setActive("");
    navigate(`?pkg=${workSelect}`);
  };

  const handleNP = async () => {
    updateRequestSelected("NP", id, setModalOpen, setActive);
    navigate(`?pkg=${workSelect}`);
  };

  const handleNA = () => {
    updateRequestSelected("NA", id, setModalOpen, setActive);
    navigate(`?pkg=${workSelect}`);
  };

  const handleWhatsapp = () => {
    updateRequestSelected("Whatsapp", id, setModalOpen, setActive);
    navigate(`?pkg=${workSelect}`);
  };

  const handleNewDonation = () => {
    setNewDonationOpen(true);
  };

  const handleCancel = () => {
    setNewDonationOpen(false);
  };

  const handleSchedulingOpen = () => {
    setNewSchedulingOpen(true);
  };

  const handleSchedulingClick = () => {
    if (!telScheduling) {
      toast.warning("Escolha o telefone de contato usado...");
      return;
    }
    const response = updateRequestList({
      id: id,
      observationScheduling: observationScheduling,
      dateScheduling: dateScheduling,
      telScheduling: telScheduling,
    });
    if (response) {
      toast.success("Agendado com sucesso!");
      setModalOpen(false);
    } else {
      toast.error("Erro ao agendar!");
    }
  };

  const handleSaveNewDonation = async () => {
    if ([campainSelected, value, date].some((v) => v === "")) {
      toast.warning("Preencha todos os campos corretamente");
      return;
    }
    const response = await insertDonation(
      donor_id,
      operatorData.operator_code_id,
      value,
      extraValue,
      DataNow("noformated"),
      date,
      false,
      false,
      observation,
      null,
      campainSelected,
      null,
      request_name
    );

    if (response.length > 0) {
      updateRequestSelected("Sucesso", id, setModalOpen, setActive);
      navigate(`?pkg=${workSelect}`);
    }
  };

  const handleOpenDonator = () => {
    navigate(`/donor/${workListSelected.donor_id}`);
  };

  console.log(workListSelected);

  return (
    <div className={styles.modalWorklist}>
      <div className={styles.modalWorklistMain}>
        <div className={styles.modalWorklistHeader}>
          <div className={styles.modalWorklistHeaderContent}>
            <h3 className={styles.modalWorklistTitle}>
              <span className={styles.donorIcon}>👤</span>
              {donor_name}
            </h3>
            <div className={styles.modalWorklistRequestInfo}>
              <span className={styles.requestLabel}>Solicitação:</span>
              <span className={styles.requestName}>{request_name}</span>
            </div>
          </div>

          <button
            className={styles.modalWorklistCloseBtn}
            onClick={handleClose}
          >
            ✕
          </button>
        </div>

        <div className={styles.modalWorklistBody}>
          <div className={styles.modalWorklistSection}>
            <h4 className={styles.sectionTitle}>
              📞 Informações de Contato{" "}
              <span style={{ color: "#FAF5E9" }}>
                {donor_mensal_day ? `Dia do Mensal: ${donor_mensal_day}` : ""} |{" "}
                {donor_monthly_fee
                  ? `Mensalidade: ${donor_monthly_fee.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}`
                  : ""}
              </span>
            </h4>
            <div className={styles.contactInfoGrid}>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Telefone Principal:</span>
                <span className={`${styles.contactValue} ${styles.primary}`}>
                  {donor_tel_1}
                </span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Telefone 2:</span>
                <span className={styles.contactValue}>
                  {donor_tel_2 ? donor_tel_2 : "Não informado"}
                </span>
              </div>
              <div className={styles.contactItem}>
                <span className={styles.contactLabel}>Telefone 3:</span>
                <span className={styles.contactValue}>
                  {donor_tel_3 ? donor_tel_3 : "Não informado"}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.modalWorklistSection}>
            <h4 className={styles.sectionTitle}>
              💰 Histórico de Doações{" "}
              <span style={{ color: "#FAF5E9" }}>
                | Meses sem receber: {countNotReceived}
              </span>
            </h4>
            <div className={styles.donationStatsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>📊</div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Doação Anterior</span>
                  <span className={styles.statValue}>
                    {penultimate?.[0].value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }) || "N/A"}
                  </span>
                  <span className={styles.statDate}>
                    {penultimate?.[0]
                      ? new Date(penultimate?.[0].day).toLocaleDateString(
                          "pt-BR",
                          { timeZone: "UTC" }
                        )
                      : "N/A"}
                  </span>
                  {penultimate?.[0] && (
                    <span className={styles.statObservation}>
                      📝 {penultimate?.[0].description || "Sem observação"}
                    </span>
                  )}
                </div>
              </div>

              <div className={`${styles.statCard} ${styles.highlight}`}>
                <div className={styles.statIcon}>🏆</div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>
                    Maior Doação no Período
                  </span>
                  <span className={styles.statValue}>
                    {maxPeriod?.[0]?.value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }) || "N/A"}
                  </span>
                  <span className={styles.statDate}>
                    {maxPeriod?.[0]?.day
                      ? new Date(maxPeriod?.[0]?.day).toLocaleDateString(
                          "pt-BR",
                          { timeZone: "UTC" }
                        )
                      : "N/A"}
                  </span>
                  {maxPeriod?.[0] && (
                    <span className={styles.statObservation}>
                      📝 {maxPeriod?.[0].description || "Sem observação"}
                    </span>
                  )}
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>📊</div>
                <div className={styles.statContent}>
                  <span className={styles.statLabel}>Maior Doação Geral</span>
                  <span className={styles.statValue}>
                    {maxDonation?.[0]?.value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }) || "N/A"}
                  </span>
                  <span className={styles.statDate}>
                    {maxDonation?.[0]?.day
                      ? new Date(maxDonation?.[0]?.day).toLocaleDateString(
                          "pt-BR",
                          { timeZone: "UTC" }
                        )
                      : "N/A"}
                  </span>
                  {maxDonation?.[0] && (
                    <span className={styles.statObservation}>
                      📝 {maxDonation?.[0].description || "Sem observação"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.modalWorklistSection}>
            <h4 className={styles.sectionTitle}>
              📋 Últimas 3 Doações Recebidas
            </h4>
            <div className={styles.lastDonationsGrid}>
              {lastThreeDonations && lastThreeDonations.length > 0 ? (
                lastThreeDonations.map((donation, index) => (
                  <div key={index} className={styles.donationCard}>
                    <div className={styles.donationCardHeader}>
                      <span className={styles.donationNumber}>
                        #{index + 1}
                      </span>
                      <span className={styles.donationValue}>
                        {donation.value.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </div>
                    <div className={styles.donationCardBody}>
                      <div className={styles.donationInfo}>
                        <span className={styles.donationLabel}>📅 Data:</span>
                        <span className={styles.donationText}>
                          {new Date(donation.day).toLocaleDateString("pt-BR", {
                            timeZone: "UTC",
                          })}
                        </span>
                      </div>
                      <div className={styles.donationInfo}>
                        <span className={styles.donationLabel}>
                          📝 Observação:
                        </span>
                        <span className={styles.donationText}>
                          {donation.description || "Sem observação"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className={styles.noDonationsMessage}>
                  <span className={styles.noDonationsIcon}>📭</span>
                  <span className={styles.noDonationsText}>
                    Nenhuma doação registrada
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {!newDonationOpen && !newSchedulingOpen ? (
          <div className={styles.modalWorklistActions}>
            <div className={styles.actionButtonsGrid}>
              {workListSelected.request_status !== "Sucesso" &&
                (workListSelected.request_status !== "Recebido" && (
                  <>
                    <button
                      className={`${styles.actionBtn} ${styles.danger}`}
                      onClick={handleNP}
                    >
                      <span className={styles.btnIcon}>❌</span>
                      <span className={styles.btnText}>Não pode ajudar</span>
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.warning}`}
                      onClick={handleNA}
                    >
                      <span className={styles.btnIcon}>📵</span>
                      <span className={styles.btnText}>Não atendeu</span>
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.info}`}
                      onClick={handleSchedulingOpen}
                    >
                      <span className={styles.btnIcon}>📅</span>
                      <span className={styles.btnText}>Agendar</span>
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.info}`}
                      onClick={handleWhatsapp}
                    >
                      <span className={styles.btnIcon}>💬</span>
                      <span className={styles.btnText}>Whatsapp</span>
                    </button>
                    <button
                      className={`${styles.actionBtn} ${styles.success}`}
                      onClick={handleNewDonation}
                    >
                      <span className={styles.btnIcon}>💰</span>
                      <span className={styles.btnText}>Nova doação</span>
                    </button>
                  </>
                ))}

              <button
                className={`${styles.actionBtn} ${styles.primary}`}
                onClick={handleOpenDonator}
              >
                <span className={styles.btnIcon}>👤</span>
                <span className={styles.btnText}>Abrir Doador</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <hr />
            {newDonationOpen ? (
              <div className={styles.modalWorklistFormSection}>
                <div className={styles.formSectionHeader}>
                  <h4 className={styles.formTitle}>
                    <span className={styles.formIcon}>💰</span>
                    Nova Doação
                  </h4>
                  <p className={styles.formDescription}>
                    Preencha os dados da nova doação para este doador
                  </p>
                </div>

                <div className={styles.formSectionBody}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Valor da Doação *
                      </label>
                      <input
                        className={styles.formInput}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        type="text"
                        placeholder="Ex: 50,00"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Extra da Doação *
                      </label>
                      <input
                        className={styles.formInput}
                        value={extraValue}
                        onChange={(e) => setExtraValue(e.target.value)}
                        type="text"
                        placeholder="Ex: 10,00"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Data para Receber *
                      </label>
                      <input
                        className={styles.formInput}
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        type="date"
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>Campanha *</label>
                      <select
                        className={styles.formSelect}
                        value={campainSelected}
                        onChange={(e) => setCampainSelected(e.target.value)}
                      >
                        <option value="" disabled>
                          Selecione uma campanha...
                        </option>
                        {campains.map((cp) => (
                          <option key={cp.id} value={cp.campain_name}>
                            {cp.campain_name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label className={styles.formLabel}>Observações</label>
                      <textarea
                        className={styles.formTextarea}
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                        placeholder="Observações adicionais sobre a doação..."
                        rows="3"
                      />
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <button
                      className={`${styles.formBtn} ${styles.secondary}`}
                      onClick={handleCancel}
                    >
                      <span className={styles.btnIcon}>↩️</span>
                      Cancelar
                    </button>
                    <button
                      className={`${styles.formBtn} ${styles.primary}`}
                      onClick={handleSaveNewDonation}
                    >
                      <span className={styles.btnIcon}>💾</span>
                      Salvar Doação
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.modalWorklistFormSection}>
                <div className={styles.formSectionHeader}>
                  <h4 className={styles.formTitle}>
                    <span className={styles.formIcon}>📅</span>
                    Agendamento de Contato
                  </h4>
                  <p className={styles.formDescription}>
                    Agende um novo contato com este doador
                  </p>
                </div>

                <div className={styles.formSectionBody}>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Data do Agendamento *
                      </label>
                      <input
                        className={styles.formInput}
                        type="date"
                        value={dateScheduling}
                        onChange={(e) => setDateScheduling(e.target.value)}
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label className={styles.formLabel}>
                        Telefone para Contato *
                      </label>
                      <select
                        className={styles.formSelect}
                        value={telScheduling}
                        onChange={(e) => setTelScheduling(e.target.value)}
                      >
                        <option value="" disabled>
                          Selecione o telefone...
                        </option>
                        <option value={donor_tel_1}>
                          Principal: {donor_tel_1}
                        </option>
                        {donor_tel_2 && (
                          <option value={donor_tel_2}>
                            Secundário: {donor_tel_2}
                          </option>
                        )}
                        {donor_tel_3 && (
                          <option value={donor_tel_3}>
                            Terciário: {donor_tel_3}
                          </option>
                        )}
                      </select>
                    </div>

                    <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                      <label className={styles.formLabel}>
                        Observações do Agendamento
                      </label>
                      <textarea
                        className={styles.formTextarea}
                        value={observationScheduling}
                        onChange={(e) =>
                          setObservationScheduling(e.target.value)
                        }
                        placeholder="Observações sobre o agendamento..."
                        rows="3"
                      />
                    </div>
                  </div>

                  <div className={styles.formActions}>
                    <button
                      className={`${styles.formBtn} ${styles.secondary}`}
                      onClick={() => setNewSchedulingOpen(false)}
                    >
                      <span className={styles.btnIcon}>↩️</span>
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className={`${styles.formBtn} ${styles.primary}`}
                      onClick={handleSchedulingClick}
                    >
                      <span className={styles.btnIcon}>✅</span>
                      Confirmar Agendamento
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ModalWorklist;
