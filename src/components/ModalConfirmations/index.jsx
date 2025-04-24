import React, { useState } from "react";
import "./index.css";
import { ICONS } from "../../constants/constants";
import cancelDonation from "../../helper/cancelDonation";
import { toast } from "react-toastify";

const ModalConfirmations = ({
  donationOpen,
  onClose,
  setStatus
}) => {
  const [isConfirmation, setIsConfirmation] = useState(false);

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
      
      setStatus(status)
      onClose();
      

    }
  };

  return (
    <div className="modal-confirmations">
      <div className="modal-confirmations-content">
        <div className="modal-confirmations-div">
          <div className="modal-confirmations-title">
            <h2>Recibo: {donationOpen.id}</h2>
            <button onClick={() => setModalOpen(false)} className="btn-close">
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
                  <input style={{ width: "180px" }} type="date" />
                </div>
                <div>
                  <label className="label">Observação</label>
                  <input style={{ width: "370px" }} />
                </div>
              </div>
              <div className="modal-confirmations-confirm-2">
                <button
                  onClick={() => setIsConfirmation(false)}
                  className="btn-back"
                >
                  {ICONS.BACK} Voltar
                </button>
                <button className="btn-confirm">Confirmar</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalConfirmations;
