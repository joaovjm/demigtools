import React, { useState } from "react";
import "./index.css";
import { ICONS } from "../../constants/constants";
import supabase from "../../helper/superBaseClient";
import { DataNow, DataSelect } from "../DataTime";
import updateLeads from "../../helper/updateLeads";
import { toast } from "react-toastify";
import newDonorAndDonation from "../../helper/newDonorAndDonation";

const ModalScheduled = ({ scheduledOpen, onClose, setStatus, nowScheduled }) => {
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

  const handleNewDonation = () => {
    setAddress(scheduledOpen.address);
    setNeighborhood(scheduledOpen.neighborhood);
    setCity(scheduledOpen.city ? scheduledOpen.city : "RIO DE JANEIRO");
    setTel1(scheduledOpen.phone);
    setTel2(scheduledOpen.phone2);
    setTel3(scheduledOpen.phone3);
    setTel4(scheduledOpen.phone4);
    setTel5(scheduledOpen.phone5);
    setTel6(scheduledOpen.phone6);
    setIsScheduling(true);
  };

  const handleCancel = async () => {
    window.confirm("Você tem certeza que deseja cancelar a ficha?");
    if (window.confirm) {
      const response = await updateLeads("Não pode Ajudar");
      // setStatus(status);
      if (response) {
        //setStatus(response.leads_status)
        onClose();
      }
    }
  };

  const handleConfirm = async () => {
    window.confirm("Você deseja reagendar a ficha?");
    if (window.confirm) {
      try {
        const { data: updateConfirm, error: errorConfirm } = await supabase
          .from("donation")
          .update({
            donation_day_contact: DataNow(),
            donation_day_to_receive: DataSelect(dateConfirm),
            donation_description: observation,
            donation_received: "Não",
            collector_code_id: null,
          })
          .eq("receipt_donation_id", donationOpen.id);

        if (errorConfirm) throw errorConfirm;

        setStatus("Update OK");
        onClose();
      } catch (errorConfirm) {
        console.error("Error updating donation:", errorConfirm);
      }
    }
  };

  const handleDateChange = (e) => {
    const selectedDate = e.target.value;
    const currentDate = DataNow("noformated");
    const selectedDateFormatted = DataSelect(selectedDate);

    if (selectedDateFormatted < currentDate) {
      setDateScheduling(DataNow("noformated"));
    } else {
      setDateScheduling(selectedDate);
    }
  };

  const handleNewDonorAndDonation = async () => {
    if (
      address === "" ||
      neighborhood === "" ||
      city === "" ||
      tel1 === "" ||
      tel2 === "" ||
      tel3 === "" ||
      valueDonation === "" ||
      dateScheduling === ""
    ) {
      toast.warning("Preencha todos os campos obrigatórios");
      return;
    }

    const response = await newDonorAndDonation(
      scheduledOpen.name,
      address,
      neighborhood,
      city,
      telSuccess,
      tel2,
      tel3,
      scheduledOpen.cpf,
      valueDonation,
      DataSelect(dateScheduling),
      campain,
      observation,
      scheduledOpen.operator_code_id,
      nowScheduled
      
    );

    if(response) {
      onClose();
    }
  };

  return (
    <div className="modal-confirmations">
      <div className="modal-confirmations-content">
        <div className="modal-confirmations-div">
          <div className="modal-confirmations-title">
            <h2>Nome: {scheduledOpen.name}</h2>
            <button onClick={() => onClose()} className="btn-close">
              Fechar
            </button>
          </div>

          <div className="modal-confirmations-body">
            <label>Endereço: {scheduledOpen.address}</label>
            <label>Tel 1: {scheduledOpen.phone}</label>
            <label>
              Tel 2:{" "}
              {scheduledOpen.phone2 ? scheduledOpen.phone2 : "*****-****"}
            </label>
            <label>
              Tel 3:{" "}
              {scheduledOpen.phone3 ? scheduledOpen.phone3 : "*****-****"}
            </label>
            <label>
              Tel 4:{" "}
              {scheduledOpen.phone4 ? scheduledOpen.phone4 : "*****-****"}
            </label>
            <label>
              Tel 5:{" "}
              {scheduledOpen.phone5 ? scheduledOpen.phone5 : "*****-****"}
            </label>
            <label>
              Tel 6:{" "}
              {scheduledOpen.phone6 ? scheduledOpen.phone6 : "*****-****"}
            </label>
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
              <div className="modal-confirmations-confirm-address">
                <div>
                  <label className="label">Endereço</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    style={{ width: "60%" }}
                  />
                </div>
                <div>
                  <label className="label">Bairro</label>
                  <input
                    type="text"
                    value={neighborhood}
                    onChange={(e) => setNeighborhood(e.target.value)}
                    style={{ width: "70%" }}
                  />
                </div>
                <div>
                  <label className="label">Cidade</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    style={{ width: "50%" }}
                  />
                </div>
              </div>

              <div className="modal-confirmations-confirm-tel">
                <div style={{ display: "flex", width: "100%" }}>
                  <label style={{ width: "50%" }} className="label">
                    Qual contactado?
                  </label>
                  <select
                    type="text"
                    value={telSuccess}
                    onChange={(e) => setTelSuccess(e.target.value)}
                    style={{ width: "40%" }}
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
                <div>
                  <label className="label">Tel.: 2</label>
                  <input
                    type="text"
                    value={tel2}
                    onChange={(e) => setTel2(e.target.value)}
                    style={{ width: "50%" }}
                  />
                </div>
                <div>
                  <label className="label">tel.: 3</label>
                  <input
                    type="text"
                    value={tel3}
                    onChange={(e) => setTel3(e.target.value)}
                    style={{ width: "50%" }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  width: "100%",
                  justifyContent: "space-around",
                }}
              >
                <div>
                  <label className="label">Valor</label>
                  <input
                    type="text"
                    value={valueDonation}
                    onChange={(e) => setValueDonation(e.target.value)}
                    style={{ width: 90 }}
                  />
                </div>
                <div>
                  <label className="label">Data</label>
                  <input
                    value={dateScheduling}
                    style={{ width: "180px" }}
                    type="date"
                    onChange={handleDateChange}
                  />
                </div>
                <div>
                  <label className="label">Campanha</label>
                  <select
                    value={campain}
                    onChange={(e) => setCampain(e.target.value)}
                    style={{ width: 140 }}
                  >
                    <option value="" disabled>
                      Selecione...
                    </option>
                    <option value="fralda">Fralda</option>
                    <option value="leite">Leite</option>
                    <option value="manutenção">Manutenção</option>
                  </select>
                </div>
              </div>
              <div className="modal-confirmations-confirm-1">
                <div>
                  <label className="label">Observação</label>
                  <input
                    value={observation}
                    style={{ width: "370px" }}
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
                  onClick={handleNewDonorAndDonation}
                  className="btn-confirm"
                >
                  Concludir
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalScheduled;
