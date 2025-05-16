import React, { useEffect, useState } from "react";
import "./index.css";
import { ICONS } from "../../constants/constants";
import cancelDonation from "../../helper/cancelDonation";
import supabase from "../../helper/superBaseClient";
import { DataNow, DataSelect } from "../DataTime";

const ModalConfirmations = ({ donationOpen, onClose, setStatus }) => {
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [dateConfirm, setDateConfirm] = useState("");
  const [observation, setObservation] = useState("");

  console.log(donationOpen)

  const handleCancel = async () => {
    window.confirm("Você tem certeza que deseja cancelar a ficha?");
    if (window.confirm) {
      const status = await cancelDonation({
        donation: {
          receipt_donation_id: donationOpen.id,
          donor_id: donationOpen.donor_id,
          donation_value: donationOpen.value,
          donation_extra: donationOpen.extra,
          donation_day_contact: donationOpen.day_contact,
          donation_day_to_receive: donationOpen.day_to_receive,
          donation_print: donationOpen.print,
          donation_monthref: donationOpen.monthref,
          donation_description: donationOpen.description,
          donation_received: "Não",
          operator_code_id: donationOpen.operator_code_id,
          collector_code_id: donationOpen.collector_code_id,
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
          .eq("receipt_donation_id", donationOpen.id);

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
            <h2>Recibo: {donationOpen.id}</h2>
            <button onClick={() => onClose()} className="btn-close">
              Fechar
            </button>
          </div>

          <div className="modal-confirmations-body">
            <label>Name: {donationOpen.name}</label>
            <label>Endereço: {donationOpen.address}</label>
            <label>Tel 1: {donationOpen.phone}</label>
            <label>
              Tel 2: {donationOpen.phone2 ? donationOpen.phone2 : "*****-****"}
            </label>
            <label>
              Tel 3: {donationOpen.phone3 ? donationOpen.phone3 : "*****-****"}
            </label>
            <label>Valor: R$ {donationOpen.value},00</label>
            <h4>Motivo: {donationOpen.reason}</h4>
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

export default ModalConfirmations;
