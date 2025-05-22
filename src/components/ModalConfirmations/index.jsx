import React, { useEffect, useState } from "react";
import "./index.css";
import { ICONS } from "../../constants/constants";
import cancelDonation from "../../helper/cancelDonation";
import supabase from "../../helper/superBaseClient";
import { DataNow, DataSelect } from "../DataTime";

const ModalConfirmations = ({ donationConfirmationOpen, onClose, setStatus }) => {
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [dateConfirm, setDateConfirm] = useState("");
  const [observation, setObservation] = useState("");

  const handleCancel = async () => {
    window.confirm("Você tem certeza que deseja cancelar a ficha?");
    if (window.confirm) {
      const status = await cancelDonation({
        donation: {
          receipt_donation_id: donationConfirmationOpen.id,
          donor_id: donationConfirmationOpen.donor_id,
          donation_value: donationConfirmationOpen.value,
          donation_extra: donationConfirmationOpen.extra,
          donation_day_contact: donationConfirmationOpen.day_contact,
          donation_day_to_receive: donationConfirmationOpen.day_to_receive,
          donation_print: donationConfirmationOpen.print,
          donation_monthref: donationConfirmationOpen.monthref,
          donation_description: donationConfirmationOpen.description,
          donation_received: "Não",
          operator_code_id: donationConfirmationOpen.operator_code_id,
          collector_code_id: donationConfirmationOpen.collector_code_id,
        },
      });

      setStatus(status);
      onClose();
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
          .eq("receipt_donation_id", donationConfirmationOpen.id);

        if (errorConfirm) throw errorConfirm;
        
          setStatus("Update OK")
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
            <h2>Recibo: {donationConfirmationOpen.id}</h2>
            <button onClick={() => onClose()} className="btn-close">
              Fechar
            </button>
          </div>

          <div className="modal-confirmations-body">
            <label>Name: {donationConfirmationOpen.name}</label>
            <label>Endereço: {donationConfirmationOpen.address}</label>
            <label>Tel 1: {donationConfirmationOpen.phone}</label>
            <label>
              Tel 2: {donationConfirmationOpen.phone2 ? donationConfirmationOpen.phone2 : "*****-****"}
            </label>
            <label>
              Tel 3: {donationConfirmationOpen.phone3 ? donationConfirmationOpen.phone3 : "*****-****"}
            </label>
            <label>Valor: R$ {donationConfirmationOpen.value},00</label>
            <h4>Motivo: {donationConfirmationOpen.reason}</h4>
          </div>
          {!isConfirmation && (
            <div className="modal-confirmations-footer">
              <button
                onClick={() => setIsConfirmation(true)}
                className="btn-confirm"
              >
                Reagendar Ficha
              </button>
              <button onClick={handleCancel} className="btn-delete">
                Cancelar Ficha
              </button>
            </div>
          )}

          {isConfirmation && (
            <div className="modal-confirmations-confirm">
              <div className="modal-confirmations-confirm-1">
                <div className="input-field">
                  <label className="label">Data</label>
                  <input
                    value={dateConfirm}
                    type="date"
                    onChange={(e) => setDateConfirm(e.target.value)}
                  />
                </div>
                <div className="input-field">
                  <label className="label">Observação</label>
                  <input
                    value={observation}
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

export default ModalConfirmations;
