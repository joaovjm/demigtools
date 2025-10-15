import React, { useEffect, useState } from "react";
import "./index.css";
import { ICONS } from "../../constants/constants";
import { DataNow } from "../DataTime";
import updateLeads from "../../helper/updateLeads";
import { toast } from "react-toastify";
import newDonorAndDonation from "../../helper/newDonorAndDonation";
import { getCampains } from "../../helper/getCampains";
import updateRequestSelected from "../../helper/updateRequestSelected";
import { insertDonation } from "../../helper/insertDonation";
import { FaUser, FaMapMarkerAlt, FaPhone, FaDollarSign, FaCalendarAlt, FaBullhorn, FaEdit, FaTimes, FaCheck, FaArrowLeft } from "react-icons/fa";

const ModalScheduled = ({
  scheduledOpen,
  onClose,
  setStatus,
  nowScheduled,
}) => {
  
  const [isScheduling, setIsScheduling] = useState(false);
  const [dateScheduling, setDateScheduling] = useState("");
  const [observation, setObservation] = useState("");
  const [address, setAddress] = useState("");
  const [neighborhood, setNeighborhood] = useState("");
  const [city, setCity] = useState("");
  const [telSuccess, setTelSuccess] = useState("");
  const [tel1, setTel1] = useState("");
  const [tel2, setTel2] = useState("");
  const [tel3, setTel3] = useState("");
  const [tel4, setTel4] = useState("");
  const [tel5, setTel5] = useState("");
  const [tel6, setTel6] = useState("");
  const [campain, setCampain] = useState("");
  const [valueDonation, setValueDonation] = useState("");
  const [name, setName] = useState("");
  const [campains, setCampains] = useState([]);

  const fetchCampain = async () => {
    const response = await getCampains();
    setCampains(response);
  };
  useEffect(() => {
    fetchCampain();
  }, []);

  const handleNewDonation = () => {
    setName(scheduledOpen.name);
    setAddress(scheduledOpen.address);
    setNeighborhood(scheduledOpen.neighborhood);
    setCity(scheduledOpen.city || "RIO DE JANEIRO");
    setTel1(scheduledOpen.phone);
    setTel2(scheduledOpen.phone2);
    setTel3(scheduledOpen.phone3);
    setTel4(scheduledOpen.phone4);
    setTel5(scheduledOpen.phone5);
    setTel6(scheduledOpen.phone6);
    setIsScheduling(true);
  };

  const handleCancel = async () => {
    if (window.confirm("Você tem certeza que deseja cancelar a ficha?")) {
      if (scheduledOpen.typeScheduled === "lead") {
        const response = await updateLeads(
          "Não pode Ajudar",
          scheduledOpen.operator_code_id,
          scheduledOpen.id
        );
        if (response) {
          toast.success("Processo concluído com sucesso");
          onClose();
        }
      } else {
        const response = await updateRequestSelected(
          "NP",
          scheduledOpen.donor_id,
          onClose,
          ""
        );
        if (response) {
          toast.success("Processo concluído com sucesso");
          onClose();
        }
      }
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const currentDate = DataNow("noformated");
    setDateScheduling(
      selectedDate < currentDate ? DataNow("noformated") : selectedDate
    );
  };

  const handleNewDonorAndDonation = async () => {
    if (
      [
        address,
        neighborhood,
        city,
        tel1,
        tel2,
        tel3,
        valueDonation,
        dateScheduling,
      ].some((v) => v === "")
    ) {
      toast.warning("Preencha todos os campos obrigatórios");
      return;
    }

    const response = await newDonorAndDonation(
      scheduledOpen.id,
      scheduledOpen.name,
      address,
      neighborhood,
      city,
      telSuccess,
      tel2,
      tel3,
      scheduledOpen.leads_icpf,
      valueDonation,
      dateScheduling,
      campain,
      observation,
      scheduledOpen.operator_code_id,
      nowScheduled
    );
    if (response) onClose();
  };

  const handleNewRequestDonation = async () => {
    if ([valueDonation, dateScheduling, campain, observation].some(v => v === "")){
      toast.warning("Preencha todos os campos")
      return;
    }
    const response = await insertDonation(
      scheduledOpen.donor_id,
      scheduledOpen.operator_code_id,
      valueDonation,
      null,
      DataNow("noformated"),
      dateScheduling,
      false,
      false,
      observation,
      null,
      campain      
    )
    if (response){
      const response = await updateRequestSelected(
        "Sucesso",
        scheduledOpen.id,
        onClose
      );
      if (response) {
        onClose();
      }
    } 
  };

  return (
    <main className="modal-scheduled-container">
      <div className="modal-scheduled">
        <div className="modal-scheduled-content">
          <div className="modal-scheduled-header">
            <div className="modal-title-section">
              <h2 className="modal-title">
                <FaCalendarAlt />
                Agendamento
              </h2>
              <span className="person-name">
                {scheduledOpen.name}
              </span>
            </div>
            <button
              onClick={onClose}
              className="btn-close-modal"
              title="Fechar"
            >
              ✕
            </button>
          </div>

          <div className="modal-scheduled-body">
            <div className="person-info-section">
              <h3>Informações do Contato</h3>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">
                    <FaMapMarkerAlt />
                    Endereço
                  </div>
                  <div className="info-value">
                    {scheduledOpen.address}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <FaPhone />
                    Telefone 1
                  </div>
                  <div className="info-value">
                    {scheduledOpen.phone}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <FaPhone />
                    Telefone 2
                  </div>
                  <div className="info-value">
                    {scheduledOpen.phone2 || "*****-****"}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <FaPhone />
                    Telefone 3
                  </div>
                  <div className="info-value">
                    {scheduledOpen.phone3 || "*****-****"}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <FaPhone />
                    Telefone 4
                  </div>
                  <div className="info-value">
                    {scheduledOpen.phone4 || "*****-****"}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <FaPhone />
                    Telefone 5
                  </div>
                  <div className="info-value">
                    {scheduledOpen.phone5 || "*****-****"}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <FaPhone />
                    Telefone 6
                  </div>
                  <div className="info-value">
                    {scheduledOpen.phone6 || "*****-****"}
                  </div>
                </div>
                <div className="info-item full-width">
                  <div className="info-label">
                    <FaEdit />
                    Observação
                  </div>
                  <div className="info-value">
                    {scheduledOpen.observation}
                  </div>
                </div>
              </div>
            </div>

            {!isScheduling && (
              <div className="modal-scheduled-footer">
                <button onClick={handleNewDonation} className="btn-create-donation">
                  <FaCheck />
                  Criar Doação
                </button>
                <button onClick={handleCancel} className="btn-cancel">
                  <FaTimes />
                  Não pode ajudar
                </button>
              </div>
            )}

            {isScheduling && (
              <div className="donation-form-section">
                <h3>Dados da Doação</h3>
                <div className="form-grid">
                  {scheduledOpen.typeScheduled === "lead" && (
                    <>
                      <div className="input-group">
                        <label>
                          <FaUser />
                          Nome
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Nome completo"
                        />
                      </div>
                      <div className="input-group">
                        <label>
                          <FaMapMarkerAlt />
                          Endereço
                        </label>
                        <input
                          type="text"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="Endereço completo"
                        />
                      </div>
                      <div className="input-group">
                        <label>
                          <FaMapMarkerAlt />
                          Bairro
                        </label>
                        <input
                          type="text"
                          value={neighborhood}
                          onChange={(e) => setNeighborhood(e.target.value)}
                          placeholder="Bairro"
                        />
                      </div>
                      <div className="input-group">
                        <label>
                          <FaMapMarkerAlt />
                          Cidade
                        </label>
                        <input
                          type="text"
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Cidade"
                        />
                      </div>
                      <div className="input-group">
                        <label>
                          <FaPhone />
                          Qual contactado?
                        </label>
                        <select
                          value={telSuccess}
                          onChange={(e) => setTelSuccess(e.target.value)}
                        >
                          <option value="" disabled>Selecione o telefone contactado</option>
                          {scheduledOpen.phone && (
                            <option value={scheduledOpen.phone}>
                              {scheduledOpen.phone}
                            </option>
                          )}
                          {scheduledOpen.phone2 && (
                            <option value={scheduledOpen.phone2}>
                              {scheduledOpen.phone2}
                            </option>
                          )}
                          {scheduledOpen.phone3 && (
                            <option value={scheduledOpen.phone3}>
                              {scheduledOpen.phone3}
                            </option>
                          )}
                          {scheduledOpen.phone4 && (
                            <option value={scheduledOpen.phone4}>
                              {scheduledOpen.phone4}
                            </option>
                          )}
                          {scheduledOpen.phone5 && (
                            <option value={scheduledOpen.phone5}>
                              {scheduledOpen.phone5}
                            </option>
                          )}
                          {scheduledOpen.phone6 && (
                            <option value={scheduledOpen.phone6}>
                              {scheduledOpen.phone6}
                            </option>
                          )}
                        </select>
                      </div>
                      <div className="input-group">
                        <label>
                          <FaPhone />
                          Tel. 2
                        </label>
                        <input
                          type="text"
                          value={tel2}
                          onChange={(e) => setTel2(e.target.value)}
                          placeholder="Telefone 2"
                        />
                      </div>
                      <div className="input-group">
                        <label>
                          <FaPhone />
                          Tel. 3
                        </label>
                        <input
                          type="text"
                          value={tel3}
                          onChange={(e) => setTel3(e.target.value)}
                          placeholder="Telefone 3"
                        />
                      </div>
                    </>
                  )}

                  <div className="input-group">
                    <label>
                      <FaDollarSign />
                      Valor
                    </label>
                    <input
                      type="text"
                      value={valueDonation}
                      onChange={(e) => setValueDonation(e.target.value)}
                      placeholder="Valor da doação"
                    />
                  </div>
                  <div className="input-group">
                    <label>
                      <FaCalendarAlt />
                      Data
                    </label>
                    <input
                      type="date"
                      value={dateScheduling}
                      onChange={handleDateChange}
                    />
                  </div>
                  <div className="input-group">
                    <label>
                      <FaBullhorn />
                      Campanha
                    </label>
                    <select
                      value={campain}
                      onChange={(e) => setCampain(e.target.value)}
                    >
                      <option value="" disabled>
                        Selecione uma campanha...
                      </option>
                      {campains?.map((campain) => (
                        <option key={campain.id} value={campain.campain_name}>
                          {campain.campain_name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="input-group full-width">
                    <label>
                      <FaEdit />
                      Observação
                    </label>
                    <textarea
                      value={observation}
                      onChange={(e) => setObservation(e.target.value)}
                      placeholder="Observações sobre a doação..."
                      rows="3"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    onClick={() => setIsScheduling(false)}
                    className="btn-back"
                  >
                    <FaArrowLeft />
                    Voltar
                  </button>
                  <button
                    onClick={
                      scheduledOpen.typeScheduled === "lead"
                        ? handleNewDonorAndDonation
                        : handleNewRequestDonation
                    }
                    className="btn-confirm"
                  >
                    <FaCheck />
                    Concluir
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default ModalScheduled;
