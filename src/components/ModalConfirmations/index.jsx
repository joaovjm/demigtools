import React, { useEffect, useState } from "react";
import "./index.css";
import { ICONS } from "../../constants/constants";
import cancelDonation from "../../helper/cancelDonation";
import supabase from "../../helper/superBaseClient";
import { DataNow, DataSelect } from "../DataTime";
import { FaUser, FaMapMarkerAlt, FaPhone, FaDollarSign, FaExclamationTriangle, FaCalendarAlt, FaEdit, FaTimes, FaCheck, FaArrowLeft, FaClock } from "react-icons/fa";

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
            donation_day_contact: DataNow("noformated"),
            donation_day_to_receive: dateConfirm,
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
    <main className="modal-confirmations-container">
      <div className="modal-confirmations">
        <div className="modal-confirmations-content">
          <div className="modal-confirmations-header">
            <div className="modal-title-section">
              <h2 className="modal-title">
                <FaClock />
                Confirmação de Doação
              </h2>
              <span className="receipt-number">
                Recibo: #{donationConfirmationOpen.id}
              </span>
            </div>
            <button
              onClick={() => onClose()}
              className="btn-close-modal"
              title="Fechar"
            >
              ✕
            </button>
          </div>

          <div className="modal-confirmations-body">
            <div className="donation-info-section">
              <h3>Informações da Doação</h3>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">
                    <FaDollarSign />
                    Valor
                  </div>
                  <div className="info-value">
                    R$ {donationConfirmationOpen.value},00
                  </div>
                </div>
                <div className="info-item full-width">
                  <div className="info-label">
                    <FaExclamationTriangle />
                    Motivo
                  </div>
                  <div className="info-value reason">
                    {donationConfirmationOpen.reason}
                  </div>
                </div>
              </div>
            </div>

            <div className="donor-info-section">
              <h3>Dados do Doador</h3>
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">
                    <FaUser />
                    Nome
                  </div>
                  <div className="info-value">
                    {donationConfirmationOpen.name}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <FaPhone />
                    Telefone 1
                  </div>
                  <div className="info-value">
                    {donationConfirmationOpen.phone}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <FaPhone />
                    Telefone 2
                  </div>
                  <div className="info-value">
                    {donationConfirmationOpen.phone2 || "*****-****"}
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <FaPhone />
                    Telefone 3
                  </div>
                  <div className="info-value">
                    {donationConfirmationOpen.phone3 || "*****-****"}
                  </div>
                </div>
                <div className="info-item full-width">
                  <div className="info-label">
                    <FaMapMarkerAlt />
                    Endereço
                  </div>
                  <div className="info-value">
                    {donationConfirmationOpen.address}
                  </div>
                </div>
              </div>
            </div>

            {!isConfirmation && (
              <div className="modal-confirmations-footer">
                <button
                  onClick={() => setIsConfirmation(true)}
                  className="btn-reschedule"
                >
                  <FaCalendarAlt />
                  Reagendar Ficha
                </button>
                <button onClick={handleCancel} className="btn-cancel">
                  <FaTimes />
                  Cancelar Ficha
                </button>
              </div>
            )}

            {isConfirmation && (
              <div className="reschedule-form-section">
                <h3>Reagendar Doação</h3>
                <div className="form-grid">
                  <div className="input-group">
                    <label>
                      <FaCalendarAlt />
                      Nova Data
                    </label>
                    <input
                      value={dateConfirm}
                      type="date"
                      onChange={(e) => setDateConfirm(e.target.value)}
                      placeholder="Selecione a nova data"
                    />
                  </div>
                  <div className="input-group full-width">
                    <label>
                      <FaEdit />
                      Observação
                    </label>
                    <textarea
                      value={observation}
                      onChange={(e) => setObservation(e.target.value)}
                      placeholder="Observações sobre o reagendamento..."
                      rows="3"
                    />
                  </div>
                </div>

                <div className="form-actions">
                  <button
                    onClick={() => setIsConfirmation(false)}
                    className="btn-back"
                  >
                    <FaArrowLeft />
                    Voltar
                  </button>
                  <button onClick={handleConfirm} className="btn-confirm">
                    <FaCheck />
                    Confirmar Reagendamento
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

export default ModalConfirmations;
