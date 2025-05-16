import React, { useState } from "react";
import "./index.css";
import { ICONS } from "../../constants/constants";
import supabase from "../../helper/superBaseClient";
import { DataNow, DataSelect } from "../DataTime";
import updateLeads from "../../helper/updateLeads";

const ModalScheduled = ({ scheduledOpen, onClose, setStatus }) => {
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [dateConfirm, setDateConfirm] = useState("");
  const [observation, setObservation] = useState("");

  const handleCancel = async () => {
    window.confirm("Você tem certeza que deseja cancelar a ficha?");
    if (window.confirm) {
      await updateLeads();
      setStatus(status);
      onClose();
    }
  };

  console.log(scheduledOpen);
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
          {!isConfirmation && (
            <div className="modal-confirmations-footer">
              <button
                onClick={() => setIsConfirmation(true)}
                className="btn-confirm"
              >
                Criar Doação
              </button>
              <button onClick={handleCancel} className="btn-delete">
                Cancelar Ficha
              </button>
            </div>
          )}

          {isConfirmation && (
            <div className="modal-confirmations-confirm">
              <div className="modal-confirmations-confirm-1">
                <div>
                  <label className="label">Data</label>
                  <input
                    value={dateConfirm}
                    style={{ width: "180px" }}
                    type="date"
                    onChange={(e) => setDateConfirm(e.target.value)}
                  />
                </div>
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
                  onClick={() => setIsConfirmation(false)}
                  className="btn-back"
                >
                  {ICONS.BACK} Voltar
                </button>
                <button onClick={handleConfirm} className="btn-confirm">
                  Confirmar
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
