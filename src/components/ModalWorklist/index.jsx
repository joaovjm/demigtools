import "./index.css";
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

  return (
    <div className="modal-worklist">
      <div className="modal-worklist-main">
        <div className="modal-worklist-header">
          <div className="modal-worklist-header-content">
            <h3 className="modal-worklist-title">
              <span className="donor-icon">👤</span>
              {donor_name}
            </h3>
            <div className="modal-worklist-request-info">
              <span className="request-label">Solicitação:</span>
              <span className="request-name">{request_name}</span>
            </div>
          </div>

          <button className="modal-worklist-close-btn" onClick={handleClose}>
            ✕
          </button>
        </div>

        <div className="modal-worklist-body">
          <div className="modal-worklist-section">
            <h4 className="section-title">
              📞 Informações de Contato{" "}
              <span style={{ color: "#FAF5E9" }}>
                {donor_mensal_day ? `Dia do Mensal: ${donor_mensal_day}` : ""}{" "}
                |{" "}
                {donor_monthly_fee
                  ? `Mensalidade: ${donor_monthly_fee.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}`
                  : ""}
              </span>
            </h4>
            <div className="contact-info-grid">
              <div className="contact-item">
                <span className="contact-label">Telefone Principal:</span>
                <span className="contact-value primary">{donor_tel_1}</span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Telefone 2:</span>
                <span className="contact-value">
                  {donor_tel_2 ? donor_tel_2 : "Não informado"}
                </span>
              </div>
              <div className="contact-item">
                <span className="contact-label">Telefone 3:</span>
                <span className="contact-value">
                  {donor_tel_3 ? donor_tel_3 : "Não informado"}
                </span>
              </div>
            </div>
          </div>

          <div className="modal-worklist-section">
            <h4 className="section-title">
              💰 Histórico de Doações <span style={{ color: "#FAF5E9" }}>| Meses sem receber: {countNotReceived}</span>
            </h4>
            <div className="donation-stats-grid">
              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <span className="stat-label">Doação Anterior</span>
                  <span className="stat-value">
                    {penultimate?.[0].value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }) || "N/A"}
                  </span>
                  <span className="stat-date">
                    {penultimate?.[0]
                      ? new Date(penultimate?.[0].day).toLocaleDateString(
                          "pt-BR",
                          { timeZone: "UTC" }
                        )
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="stat-card highlight">
                <div className="stat-icon">🏆</div>
                <div className="stat-content">
                  <span className="stat-label">Maior Doação no Período</span>
                  <span className="stat-value">
                    {maxPeriod?.[0]?.value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }) || "N/A"}
                  </span>
                  <span className="stat-date">
                    {maxPeriod?.[0]?.day
                      ? new Date(maxPeriod?.[0]?.day).toLocaleDateString(
                          "pt-BR",
                          { timeZone: "UTC" }
                        )
                      : "N/A"}
                  </span>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon">📊</div>
                <div className="stat-content">
                  <span className="stat-label">Maior Doação Geral</span>
                  <span className="stat-value">
                    {maxDonation?.[0]?.value.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    }) || "N/A"}
                  </span>
                  <span className="stat-date">
                    {maxDonation?.[0]?.day
                      ? new Date(maxDonation?.[0]?.day).toLocaleDateString(
                          "pt-BR",
                          { timeZone: "UTC" }
                        )
                      : "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="modal-worklist-section">
            <h4 className="section-title">📋 Últimas 3 Doações Recebidas</h4>
            <div className="last-donations-grid">
              {lastThreeDonations && lastThreeDonations.length > 0 ? (
                lastThreeDonations.map((donation, index) => (
                  <div key={index} className="donation-card">
                    <div className="donation-card-header">
                      <span className="donation-number">#{index + 1}</span>
                      <span className="donation-value">
                        {donation.value.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </span>
                    </div>
                    <div className="donation-card-body">
                      <div className="donation-info">
                        <span className="donation-label">📅 Data:</span>
                        <span className="donation-text">
                          {new Date(donation.day).toLocaleDateString("pt-BR", {
                            timeZone: "UTC",
                          })}
                        </span>
                      </div>
                      <div className="donation-info">
                        <span className="donation-label">📝 Observação:</span>
                        <span className="donation-text">
                          {donation.description || "Sem observação"}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-donations-message">
                  <span className="no-donations-icon">📭</span>
                  <span className="no-donations-text">
                    Nenhuma doação registrada
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {!newDonationOpen && !newSchedulingOpen ? (
          <div className="modal-worklist-actions">
            <div className="action-buttons-grid">
              <button className="action-btn danger" onClick={handleNP}>
                <span className="btn-icon">❌</span>
                <span className="btn-text">Não pode ajudar</span>
              </button>
              <button className="action-btn warning" onClick={handleNA}>
                <span className="btn-icon">📵</span>
                <span className="btn-text">Não atendeu</span>
              </button>
              <button
                className="action-btn info"
                onClick={handleSchedulingOpen}
              >
                <span className="btn-icon">📅</span>
                <span className="btn-text">Agendar</span>
              </button>
              <button
                className="action-btn success"
                onClick={handleNewDonation}
              >
                <span className="btn-icon">💰</span>
                <span className="btn-text">Nova doação</span>
              </button>
              <button
                className="action-btn primary"
                onClick={handleOpenDonator}
              >
                <span className="btn-icon">👤</span>
                <span className="btn-text">Abrir Doador</span>
              </button>
            </div>
          </div>
        ) : (
          <>
            <hr />
            {newDonationOpen ? (
              <div className="modal-worklist-form-section">
                <div className="form-section-header">
                  <h4 className="form-title">
                    <span className="form-icon">💰</span>
                    Nova Doação
                  </h4>
                  <p className="form-description">
                    Preencha os dados da nova doação para este doador
                  </p>
                </div>

                <div className="form-section-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">Valor da Doação *</label>
                      <input
                        className="form-input"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        type="text"
                        placeholder="Ex: 50,00"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Extra da Doação *</label>
                      <input
                        className="form-input"
                        value={extraValue}
                        onChange={(e) => setExtraValue(e.target.value)}
                        type="text"
                        placeholder="Ex: 10,00"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Data para Receber *</label>
                      <input
                        className="form-input"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                        type="date"
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Campanha *</label>
                      <select
                        className="form-select"
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

                    <div className="form-group full-width">
                      <label className="form-label">Observações</label>
                      <textarea
                        className="form-textarea"
                        value={observation}
                        onChange={(e) => setObservation(e.target.value)}
                        placeholder="Observações adicionais sobre a doação..."
                        rows="3"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      className="form-btn secondary"
                      onClick={handleCancel}
                    >
                      <span className="btn-icon">↩️</span>
                      Cancelar
                    </button>
                    <button
                      className="form-btn primary"
                      onClick={handleSaveNewDonation}
                    >
                      <span className="btn-icon">💾</span>
                      Salvar Doação
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="modal-worklist-form-section">
                <div className="form-section-header">
                  <h4 className="form-title">
                    <span className="form-icon">📅</span>
                    Agendamento de Contato
                  </h4>
                  <p className="form-description">
                    Agende um novo contato com este doador
                  </p>
                </div>

                <div className="form-section-body">
                  <div className="form-grid">
                    <div className="form-group">
                      <label className="form-label">
                        Data do Agendamento *
                      </label>
                      <input
                        className="form-input"
                        type="date"
                        value={dateScheduling}
                        onChange={(e) => setDateScheduling(e.target.value)}
                      />
                    </div>

                    <div className="form-group">
                      <label className="form-label">
                        Telefone para Contato *
                      </label>
                      <select
                        className="form-select"
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

                    <div className="form-group full-width">
                      <label className="form-label">
                        Observações do Agendamento
                      </label>
                      <textarea
                        className="form-textarea"
                        value={observationScheduling}
                        onChange={(e) =>
                          setObservationScheduling(e.target.value)
                        }
                        placeholder="Observações sobre o agendamento..."
                        rows="3"
                      />
                    </div>
                  </div>

                  <div className="form-actions">
                    <button
                      className="form-btn secondary"
                      onClick={() => setNewSchedulingOpen(false)}
                    >
                      <span className="btn-icon">↩️</span>
                      Cancelar
                    </button>
                    <button
                      type="button"
                      className="form-btn primary"
                      onClick={handleSchedulingClick}
                    >
                      <span className="btn-icon">✅</span>
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
