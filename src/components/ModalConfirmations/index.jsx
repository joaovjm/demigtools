import React, { useState } from "react";
import "./index.css";
import { ICONS } from "../../constants/constants";

const ModalConfirmations = ({donationOpen, setModalOpen}) => {
  const [isConfirmation, setIsConfirmation] = useState(false);
  console.log(donationOpen);

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
            <label>Tel 2: {donationOpen.phone2}</label>
            <label>Tel 3: {donationOpen.phone3}</label>
            <label>Valor: R$ {donationOpen.value},00</label>
            <h4>
              Motivo: {donationOpen.reason}
            </h4>
          </div>
          {!isConfirmation && (
            <div className="modal-confirmations-footer">
              <button
                onClick={() => setIsConfirmation(true)}
                className="btn-confirm"
              >
                Reagendar Ficha
              </button>
              <button className="btn-delete">Cancelar Ficha</button>
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
