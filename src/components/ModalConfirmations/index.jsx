import React, { useEffect, useState, useContext } from "react";
import styles from "./modalconfirmation.module.css";
import { ICONS } from "../../constants/constants";
import cancelDonation from "../../helper/cancelDonation";
import supabase from "../../helper/superBaseClient";
import { DataNow, DataSelect } from "../DataTime";
import {useNavigate} from "react-router"
import { FaUser, FaMapMarkerAlt, FaPhone, FaDollarSign, FaExclamationTriangle, FaCalendarAlt, FaEdit, FaTimes, FaCheck, FaArrowLeft, FaClock, FaEye } from "react-icons/fa";
import { UserContext } from "../../context/UserContext";
import { logDonorActivity } from "../../helper/logDonorActivity";

const ModalConfirmations = ({ donationConfirmationOpen, onClose, setStatus }) => {
  const [isConfirmation, setIsConfirmation] = useState(false);
  const [dateConfirm, setDateConfirm] = useState("");
  const [observation, setObservation] = useState("");
  const { operatorData } = useContext(UserContext);

  const navigate = useNavigate()

  const handleCancel = async () => {
    if (!window.confirm("Você tem certeza que deseja cancelar a ficha?")) {
      return;
    }
    
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
      operatorCodeId: operatorData?.operator_code_id,
    });

    setStatus(status);
    onClose();
  };

  const handleConfirm = async () => {
    if (!window.confirm("Você deseja reagendar a ficha?")) {
      return;
    }
    
    try {
      const oldValues = {
        donation_day_to_receive: donationConfirmationOpen.day_to_receive,
        donation_description: donationConfirmationOpen.description,
        collector_code_id: donationConfirmationOpen.collector_code_id,
      };

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

      // Registrar reagendamento no histórico
      if (operatorData?.operator_code_id) {
        await logDonorActivity({
          donor_id: donationConfirmationOpen.donor_id,
          operator_code_id: operatorData.operator_code_id,
          action_type: "donation_edit",
          action_description: `Reagendou doação de R$ ${donationConfirmationOpen.value} para ${dateConfirm}`,
          old_values: oldValues,
          new_values: {
            donation_day_to_receive: dateConfirm,
            donation_description: observation,
            collector_code_id: null,
          },
          related_donation_id: null,
        });
      }
      
      setStatus("Update OK")
      onClose();
      
    } catch (errorConfirm) {
      console.error("Error updating donation:", errorConfirm);
    }
  };
  return (
    <main className={styles.modalConfirmationsContainer}>
      <div className={styles.modalConfirmations}>
        <div className={styles.modalConfirmationsContent}>
          <div className={styles.modalConfirmationsHeader}>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>
                <FaClock />
                Confirmação de Doação
              </h2>
              <span className={styles.receiptNumber}>
                Recibo: #{donationConfirmationOpen.id}
              </span>
            </div>
            <button
              onClick={() => onClose()}
              className={styles.btnCloseModal}
              title="Fechar"
            >
              ✕
            </button>
          </div>

          <div className={styles.modalConfirmationsBody}>
            <div className={styles.donationInfoSection}>
              <h3>Informações da Doação</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FaDollarSign />
                    Valor
                  </div>
                  <div className={styles.infoValue}>
                    R$ {donationConfirmationOpen.value},00
                  </div>
                </div>
                <div className={`${styles.infoItem} ${styles.fullWidth}`}>
                  <div className={styles.infoLabel}>
                    <FaExclamationTriangle />
                    Motivo
                  </div>
                  <div className={`${styles.infoValue} ${styles.reason}`}>
                    {donationConfirmationOpen.reason}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.donorInfoSection}>
              <h3>Dados do Doador</h3>
              <div className={styles.infoGrid}>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FaUser />
                    Nome
                  </div>
                  <div className={styles.infoValue}>
                    {donationConfirmationOpen.name}
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FaPhone />
                    Telefone 1
                  </div>
                  <div className={styles.infoValue}>
                    {donationConfirmationOpen.phone}
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FaPhone />
                    Telefone 2
                  </div>
                  <div className={styles.infoValue}>
                    {donationConfirmationOpen.phone2 || "*****-****"}
                  </div>
                </div>
                <div className={styles.infoItem}>
                  <div className={styles.infoLabel}>
                    <FaPhone />
                    Telefone 3
                  </div>
                  <div className={styles.infoValue}>
                    {donationConfirmationOpen.phone3 || "*****-****"}
                  </div>
                </div>
                <div className={`${styles.infoItem} ${styles.fullWidth}`}>
                  <div className={styles.infoLabel}>
                    <FaMapMarkerAlt />
                    Endereço
                  </div>
                  <div className={styles.infoValue}>
                    {donationConfirmationOpen.address}
                  </div>
                </div>
              </div>
            </div>

            {!isConfirmation && (
              <div className={styles.modalConfirmationsFooter}>
                <button className={styles.btnOpenDonor} onClick={() => navigate(`/donor/${donationConfirmationOpen.donor_id}`)}>
                  <FaEye />
                  Abrir Doador
                </button>
              
                <button
                  onClick={() => setIsConfirmation(true)}
                  className={styles.btnReschedule}
                >
                  <FaCalendarAlt />
                  Reagendar Ficha
                </button>
                <button onClick={handleCancel} className={styles.btnCancel}>
                  <FaTimes />
                  Cancelar Ficha
                </button>
              </div>
            )}

            {isConfirmation && (
              <div className={styles.rescheduleFormSection}>
                <h3>Reagendar Doação</h3>
                <div className={styles.formGrid}>
                  <div className={styles.inputGroup}>
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
                  <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
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

                <div className={styles.formActions}>
                  <button
                    onClick={() => setIsConfirmation(false)}
                    className={styles.btnBack}
                  >
                    <FaArrowLeft />
                    Voltar
                  </button>
                  <button onClick={handleConfirm} className={styles.btnConfirm}>
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
