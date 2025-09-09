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
    <div className="modal-confirmations">
      <div className="modal-confirmations-div">
        <div className="modal-confirmations-title">
          <h2>Nome: {scheduledOpen.name}</h2>
          <button onClick={onClose} className="btn-close">
            Fechar
          </button>
        </div>

        <div className="modal-confirmations-body">
          <label>Endereço: {scheduledOpen.address}</label>
          <label>Tel 1: {scheduledOpen.phone}</label>
          <label>Tel 2: {scheduledOpen.phone2 || "*****-****"}</label>
          <label>Tel 3: {scheduledOpen.phone3 || "*****-****"}</label>
          <label>Tel 4: {scheduledOpen.phone4 || "*****-****"}</label>
          <label>Tel 5: {scheduledOpen.phone5 || "*****-****"}</label>
          <label>Tel 6: {scheduledOpen.phone6 || "*****-****"}</label>
          <h4>Observação: {scheduledOpen.observation}</h4>
        </div>

        {!isScheduling && (
          <div className="modal-confirmations-footer">
            <button onClick={handleNewDonation} className="btn-confirm">
              Criar Doação
            </button>
            <button onClick={handleCancel} className="btn-delete">
              Não pode ajudar
            </button>
          </div>
        )}

        {isScheduling && (
          <div className="modal-confirmations-confirm">
            <div className="input-group">
              {scheduledOpen.typeScheduled === "lead" && (
                <>
                  <div className="input-field">
                    <label>Nome</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </div>
                  <div className="input-field">
                    <label>Endereço</label>
                    <input
                      type="text"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                  <div className="input-field">
                    <label>Bairro</label>
                    <input
                      type="text"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                    />
                  </div>
                  <div className="input-field">
                    <label>Cidade</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>
                  <div className="input-field">
                    <label>Qual contactado?</label>
                    <select
                      value={telSuccess}
                      onChange={(e) => setTelSuccess(e.target.value)}
                    >
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
                  <div className="input-field">
                    <label>Tel. 2</label>
                    <input
                      type="text"
                      value={tel2}
                      onChange={(e) => setTel2(e.target.value)}
                    />
                  </div>
                  <div className="input-field">
                    <label>Tel. 3</label>
                    <input
                      type="text"
                      value={tel3}
                      onChange={(e) => setTel3(e.target.value)}
                    />
                  </div>
                </>
              )}

              <div className="input-field">
                <label>Valor</label>
                <input
                  type="text"
                  value={valueDonation}
                  onChange={(e) => setValueDonation(e.target.value)}
                />
              </div>
              <div className="input-field">
                <label>Data</label>
                <input
                  type="date"
                  value={dateScheduling}
                  onChange={handleDateChange}
                />
              </div>
              <div className="input-field">
                <label>Campanha</label>
                <select
                  value={campain}
                  onChange={(e) => setCampain(e.target.value)}
                >
                  <option value="" disabled>
                    Selecione...
                  </option>
                  {campains?.map((campain) => (
                    <option key={campain.id} value={campain.campain_name}>
                      {campain.campain_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="input-field">
                <label>Observação</label>
                <input
                  value={observation}
                  onChange={(e) => setObservation(e.target.value)}
                />
              </div>
            </div>

            <div className="modal-confirmations-confirm-2">
              <button
                onClick={() => setIsScheduling(false)}
                className="btn-back"
              >
                {ICONS.BACK} Voltar
              </button>
              <button
                onClick={
                  scheduledOpen.typeScheduled === "lead"
                    ? handleNewDonorAndDonation
                    : handleNewRequestDonation
                }
                className="btn-confirm"
              >
                Concluir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModalScheduled;
