import React, { useEffect, useState } from "react";
import styles from "./modalscheduled.module.css";
import { DataNow } from "../DataTime";
import updateLeads from "../../helper/updateLeads";
import { toast } from "react-toastify";
import newDonorAndDonation from "../../helper/newDonorAndDonation";
import { getCampains } from "../../helper/getCampains";
import updateRequestSelected from "../../helper/updateRequestSelected";
import { insertDonation } from "../../helper/insertDonation";
import { fetchMaxAndMedDonations } from "../../services/worklistService";
import { useNavigate } from "react-router";
import supabase from "../../helper/superBaseClient";
import {
  FaUser,
  FaMapMarkerAlt,
  FaPhone,
  FaDollarSign,
  FaCalendarAlt,
  FaBullhorn,
  FaEdit,
  FaTimes,
  FaCheck,
  FaArrowLeft,
  FaUserCircle,
} from "react-icons/fa";

const ModalScheduled = ({
  scheduledOpen,
  onClose,
  setStatus,
  nowScheduled,
}) => {
  const navigate = useNavigate();
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
  const [lastThreeDonations, setLastThreeDonations] = useState([]);

  const fetchCampain = async () => {
    const response = await getCampains();
    setCampains(response);
  };

  const fetchDonations = async () => {
    if (scheduledOpen.typeScheduled !== "lead" && scheduledOpen.donor_id) {
      const { lastThreeDonations } = await fetchMaxAndMedDonations(
        scheduledOpen.donor_id,
        null
      );
      setLastThreeDonations(lastThreeDonations || []);
    }
  };

  useEffect(() => {
    fetchCampain();
    fetchDonations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      } else if (scheduledOpen.typeScheduled === "scheduled_donation") {
        // Processar cancelamento de agendamento da nova tabela
        const response = await markScheduledAsCannotHelp(scheduledOpen.id);
        if (response) {
          toast.success("Agendamento marcado como 'Não pode ajudar'");
          onClose();
        }
      } else if (scheduledOpen.typeScheduled === "donation_agendada") {
        // Processar cancelamento de doação agendada da tabela donation
        try {
          const { error } = await supabase
            .from("donation")
            .update({
              confirmation_status: null,
              confirmation_scheduled: null,
              confirmation_observation: null,
            })
            .eq("receipt_donation_id", scheduledOpen.donationId || scheduledOpen.id);
          
          if (error) throw error;
          
          toast.success("Agendamento cancelado com sucesso");
          if (setStatus) setStatus("Update OK");
          onClose();
        } catch (error) {
          console.error("Error canceling scheduled donation:", error);
          toast.error("Erro ao cancelar agendamento");
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

    const response = await newDonorAndDonation({
      id: scheduledOpen.id,
      name: scheduledOpen.name,
      address: address,
      neighborhood: neighborhood || "",
      city: city || "RIO DE JANEIRO",
      telSuccess: telSuccess || "",
      tel2: tel2 || "",
      tel3: tel3 || "",
      icpf: scheduledOpen.leads_icpf || "",
      valueDonation: valueDonation || "",
      date: dateScheduling || "",
      campain: campain || "",
      observation: observation || "",
      operatorID: scheduledOpen.operator_code_id,
      nowScheduled: nowScheduled,
    });
    if (response) onClose();
  };

  const handleNewRequestDonation = async () => {
    if (
      [valueDonation, dateScheduling, campain, observation].some(
        (v) => v === ""
      )
    ) {
      toast.warning("Preencha todos os campos");
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
    );
    if (response) {
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

  const handleNewScheduledDonation = async () => {
    if (
      [valueDonation, dateScheduling, campain].some((v) => v === "")
    ) {
      toast.warning("Preencha todos os campos obrigatórios");
      return;
    }

    try {
      // Se for doação agendada da tabela donation, atualizar a doação existente
      if (scheduledOpen.typeScheduled === "donation_agendada") {
        console.log("caiu aqui!")
        const { error } = await supabase
          .from("donation")
          .insert({
            donation_value: valueDonation,
            donation_day_to_receive: dateScheduling,
            donation_description: observation || null,
            donation_campain: campain,
            donation_day_contact: DataNow("noformated"),
            operator_code_id: scheduledOpen.operator_code_id,
          })
          .eq("receipt_donation_id", scheduledOpen.donationId || scheduledOpen.id);
        
        if (error) throw error;

        const { error: updateScheduled } = await supabase
          .from("donation")
          .update({
            confirmation_status: "Concluído",
            confirmation_scheduled: dateScheduling,
            confirmation_observation: observation,
          })
          .eq("receipt_donation_id", scheduledOpen.donationId || scheduledOpen.id);
        if (updateScheduled) throw updateScheduled;
        
        toast.success("Criação de doação concluído com sucesso!");
        if (setStatus) setStatus("Update OK");
        onClose();
      } else {
        // Criar a doação (para scheduled_donations)
        const donationResponse = await insertDonation(
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
        );

        if (donationResponse && donationResponse.length > 0) {
          // Marcar agendamento como concluído e vincular à doação criada
          await completeScheduledDonation(
            scheduledOpen.id,
            donationResponse[0].receipt_donation_id
          );
          toast.success("Doação criada e agendamento concluído com sucesso!");
          onClose();
        }
      }
    } catch (error) {
      toast.error("Erro ao processar doação: " + error.message);
    }
  };

  const handleOpenDonor = () => {
    navigate(`/donor/${scheduledOpen.donor_id}`);
  };

  console.log(scheduledOpen);
  return (
    <main className={styles.modalScheduledContainer}>
      <div className={styles.modalScheduled}>
        <div className={styles.modalScheduledContent}>
          <div className={styles.modalScheduledHeader}>
            <div className={styles.modalTitleSection}>
              <h2 className={styles.modalTitle}>
                <FaCalendarAlt />
                Agendamento
              </h2>
              <span className={styles.personName}>{scheduledOpen.name}</span>
            </div>
            <button
              onClick={onClose}
              className={styles.btnCloseModal}
              title="Fechar"
            >
              ✕
            </button>
          </div>

          <div className={styles.modalScheduledBody}>
            <div className={styles.personInfoSection}>
              <h3>Informações do Contato</h3>
              
              {/* Address */}
              <div className={styles.infoGrid}>
                <div className={`${styles.infoItem} ${styles.fullWidth}`}>
                  <div className={styles.infoLabel}>
                    <FaMapMarkerAlt />
                    Endereço
                  </div>
                  <div className={styles.infoValue}>{scheduledOpen.address}</div>
                </div>
              </div>

              {/* Compact Phone Display */}
              <div className={styles.contactGrid}>
                <div className={styles.contactItem}>
                  <div className={styles.contactLabel}>
                    <FaPhone />
                    Tel. 1
                  </div>
                  <div className={styles.contactValue}>{scheduledOpen.phone}</div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactLabel}>
                    <FaPhone />
                    Tel. 2
                  </div>
                  <div className={styles.contactValue}>
                    {scheduledOpen.phone2 || "N/D"}
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactLabel}>
                    <FaPhone />
                    Tel. 3
                  </div>
                  <div className={styles.contactValue}>
                    {scheduledOpen.phone3 || "N/D"}
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactLabel}>
                    <FaPhone />
                    Tel. 4
                  </div>
                  <div className={styles.contactValue}>
                    {scheduledOpen.phone4 || "N/D"}
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactLabel}>
                    <FaPhone />
                    Tel. 5
                  </div>
                  <div className={styles.contactValue}>
                    {scheduledOpen.phone5 || "N/D"}
                  </div>
                </div>
                <div className={styles.contactItem}>
                  <div className={styles.contactLabel}>
                    <FaPhone />
                    Tel. 6
                  </div>
                  <div className={styles.contactValue}>
                    {scheduledOpen.phone6 || "N/D"}
                  </div>
                </div>
              </div>

              {/* Observation */}
              <div className={styles.infoGrid}>
                <div className={`${styles.infoItem} ${styles.fullWidth}`}>
                  <div className={styles.infoLabel}>
                    <FaEdit />
                    Observação
                  </div>
                  <div className={styles.infoValue}>{scheduledOpen.observation}</div>
                </div>
              </div>
            </div>

            {/* Last Donations Section - Only show if not a lead */}
            {scheduledOpen.typeScheduled !== "lead" && (
              <div className={styles.donationsSection}>
                <h3>📋 Últimas 3 Doações Recebidas</h3>
                <div className={styles.lastDonationsGrid}>
                  {lastThreeDonations && lastThreeDonations.length > 0 ? (
                    lastThreeDonations.map((donation, index) => (
                      <div key={index} className={styles.donationCard}>
                        <div className={styles.donationCardHeader}>
                          <span className={styles.donationNumber}>#{index + 1}</span>
                          <span className={styles.donationValue}>
                            {donation.value.toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                          </span>
                        </div>
                        <div className={styles.donationCardBody}>
                          <div className={styles.donationInfo}>
                            <span className={styles.donationLabel}>📅 Data:</span>
                            <span className={styles.donationText}>
                              {new Date(donation.day).toLocaleDateString("pt-BR", {
                                timeZone: "UTC",
                              })}
                            </span>
                          </div>
                          <div className={styles.donationInfo}>
                            <span className={styles.donationLabel}>📝 Observação:</span>
                            <span className={styles.donationText}>
                              {donation.description || "Sem observação"}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className={styles.noDonationsMessage}>
                      <span className={styles.noDonationsIcon}>📭</span>
                      <span className={styles.noDonationsText}>
                        Nenhuma doação registrada
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {!isScheduling && (
              <div className={styles.modalScheduledFooter}>
                <button
                  onClick={handleNewDonation}
                  className={styles.btnCreateDonation}
                >
                  <FaCheck />
                  Criar Doação
                </button>
                <button onClick={handleCancel} className={styles.btnCancel}>
                  <FaTimes />
                  Não pode ajudar
                </button>
                {scheduledOpen.typeScheduled !== "lead" && scheduledOpen.donor_id && (
                  <button onClick={handleOpenDonor} className={styles.btnOpenDonor}>
                    <FaUserCircle />
                    Abrir Doador
                  </button>
                )}
              </div>
            )}

            {isScheduling && (
              <div className={styles.donationFormSection}>
                <h3>Dados da Doação</h3>
                <div className={styles.formGrid}>
                  {scheduledOpen.typeScheduled === "lead" && (
                    <>
                      <div className={styles.inputGroup}>
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
                      <div className={styles.inputGroup}>
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
                      <div className={styles.inputGroup}>
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
                      <div className={styles.inputGroup}>
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
                      <div className={styles.inputGroup}>
                        <label>
                          <FaPhone />
                          Qual contactado?
                        </label>
                        <select
                          value={telSuccess}
                          onChange={(e) => setTelSuccess(e.target.value)}
                        >
                          <option value="" disabled>
                            Selecione o telefone contactado
                          </option>
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
                      <div className={styles.inputGroup}>
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
                      <div className={styles.inputGroup}>
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

                  <div className={styles.inputGroup}>
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
                  <div className={styles.inputGroup}>
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
                  <div className={styles.inputGroup}>
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
                  <div className={`${styles.inputGroup} ${styles.fullWidth}`}>
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

                <div className={styles.formActions}>
                  <button
                    onClick={() => setIsScheduling(false)}
                    className={styles.btnBack}
                  >
                    <FaArrowLeft />
                    Voltar
                  </button>
                  <button
                    onClick={
                      scheduledOpen.typeScheduled === "lead"
                        ? handleNewDonorAndDonation
                        : scheduledOpen.typeScheduled === "scheduled_donation" || scheduledOpen.typeScheduled === "donation_agendada"
                        ? handleNewScheduledDonation
                        : handleNewRequestDonation
                    }
                    className={styles.btnConfirm}
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
