import React, { useState, useEffect } from "react";
import { ICONS } from "../../constants/constants";
import styles from "./modaleditlead.module.css";
import getLeadById from "../../helper/getLeadById";
import editLead from "../../helper/editLead";

const ModalEditLead = ({ 
  isOpen, 
  onClose, 
  leadId,
  initialEditMode = false,
  operatorType = null,
  onSave
}) => {
  const [isEditMode, setIsEditMode] = useState(initialEditMode);
  const [loading, setLoading] = useState(false);
  const [leadData, setLeadData] = useState({
    name: "",
    address: "",
    neighborhood: "",
    city: "",
    icpf: "",
    tel1: "",
    tel2: "",
    tel3: "",
    tel4: "",
    tel5: "",
    tel6: "",
  });

  useEffect(() => {
    if (isOpen && leadId) {
      fetchLeadData();
    }
  }, [isOpen, leadId]);

  const fetchLeadData = async () => {
    try {
      setLoading(true);
      const lead = await getLeadById(leadId);
      if (lead) {
        setLeadData({
          name: lead.leads_name || "",
          address: lead.leads_address || "",
          neighborhood: lead.leads_neighborhood || "",
          city: lead.leads_city || "",
          icpf: lead.leads_icpf || "",
          tel1: lead.leads_tel_1 || "",
          tel2: lead.leads_tel_2 || "",
          tel3: lead.leads_tel_3 || "",
          tel4: lead.leads_tel_4 || "",
          tel5: lead.leads_tel_5 || "",
          tel6: lead.leads_tel_6 || "",
        });
      }
    } catch (error) {
      console.error("Erro ao buscar dados do lead:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setLeadData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEdit = () => {
    setIsEditMode(true);
  };

  const handleCancel = () => {
    if (initialEditMode) {
      // Se estava em modo de edição inicial, apenas fecha
      onClose();
    } else {
      // Se entrou em modo de edição, volta para visualização
      setIsEditMode(false);
      fetchLeadData(); // Recarrega os dados originais
    }
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      const updatedLead = await editLead(leadId, leadData, operatorType);
      if (updatedLead) {
        setIsEditMode(false);
        if (onSave) {
          onSave(updatedLead);
        }
        if (initialEditMode) {
          onClose();
        }
      }
    } catch (error) {
      console.error("Erro ao salvar lead:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalEditLeadOverlay}>
      <div className={styles.modalEditLead}>
        <div className={styles.modalEditLeadContent}>
          {/* Header */}
          <div className={styles.modalEditLeadHeader}>
            <div className={styles.modalTitleSection}>
              <h3 className={styles.modalEditLeadTitle}>
                {ICONS.CIRCLEOUTLINE} {isEditMode ? "Editar Lead" : "Detalhes do Lead"}
              </h3>
              <p className={styles.modalSubtitle}>
                {isEditMode ? "Edite as informações do lead" : leadData.name}
              </p>
            </div>
            <button 
              className={styles.btnCloseModal}
              onClick={onClose}
              title="Fechar modal"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className={styles.modalEditLeadBody}>
            {loading && !leadData.name ? (
              <div className={styles.loadingContainer}>
                <p>Carregando dados do lead...</p>
              </div>
            ) : (
              <form className={styles.modalEditLeadForm}>
                <div className={styles.modalFormSection}>
                  <h4>Informações Pessoais</h4>
                  <div className={styles.modalFormRow}>
                    <div className={`${styles.modalFormGroup} ${styles.fullWidth}`}>
                      <label>Nome *</label>
                      <input
                        type="text"
                        value={leadData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        disabled={!isEditMode}
                        className={styles.modalInput}
                        required
                      />
                    </div>
                  </div>
                  <div className={styles.modalFormRow}>
                    <div className={styles.modalFormGroup}>
                      <label>CPF/CNPJ</label>
                      <input
                        type="text"
                        value={leadData.icpf}
                        onChange={(e) => handleInputChange("icpf", e.target.value)}
                        disabled={!isEditMode}
                        className={styles.modalInput}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.modalFormSection}>
                  <h4>Localização</h4>
                  <div className={styles.modalFormRow}>
                    <div className={`${styles.modalFormGroup} ${styles.fullWidth}`}>
                      <label>Endereço</label>
                      <input
                        type="text"
                        value={leadData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        disabled={!isEditMode}
                        className={styles.modalInput}
                      />
                    </div>
                  </div>
                  <div className={styles.modalFormRow}>
                    <div className={styles.modalFormGroup}>
                      <label>Bairro</label>
                      <input
                        type="text"
                        value={leadData.neighborhood}
                        onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                        disabled={!isEditMode}
                        className={styles.modalInput}
                      />
                    </div>
                    <div className={styles.modalFormGroup}>
                      <label>Cidade</label>
                      <input
                        type="text"
                        value={leadData.city}
                        onChange={(e) => handleInputChange("city", e.target.value)}
                        disabled={!isEditMode}
                        className={styles.modalInput}
                      />
                    </div>
                  </div>
                </div>

                <div className={styles.modalFormSection}>
                  <h4>Contatos</h4>
                  <div className={styles.modalFormRow}>
                    <div className={styles.modalFormGroup}>
                      <label>Telefone 1 *</label>
                      <input
                        type="text"
                        value={leadData.tel1}
                        onChange={(e) => handleInputChange("tel1", e.target.value)}
                        disabled={!isEditMode}
                        className={styles.modalInput}
                        required
                      />
                    </div>
                    <div className={styles.modalFormGroup}>
                      <label>Telefone 2</label>
                      <input
                        type="text"
                        value={leadData.tel2}
                        onChange={(e) => handleInputChange("tel2", e.target.value)}
                        disabled={!isEditMode}
                        className={styles.modalInput}
                      />
                    </div>
                  </div>
                  <div className={styles.modalFormRow}>
                    <div className={styles.modalFormGroup}>
                      <label>Telefone 3</label>
                      <input
                        type="text"
                        value={leadData.tel3}
                        onChange={(e) => handleInputChange("tel3", e.target.value)}
                        disabled={!isEditMode}
                        className={styles.modalInput}
                      />
                    </div>
                    <div className={styles.modalFormGroup}>
                      <label>Telefone 4</label>
                      <input
                        type="text"
                        value={leadData.tel4}
                        onChange={(e) => handleInputChange("tel4", e.target.value)}
                        disabled={!isEditMode}
                        className={styles.modalInput}
                      />
                    </div>
                  </div>
                  <div className={styles.modalFormRow}>
                    <div className={styles.modalFormGroup}>
                      <label>Telefone 5</label>
                      <input
                        type="text"
                        value={leadData.tel5}
                        onChange={(e) => handleInputChange("tel5", e.target.value)}
                        disabled={!isEditMode}
                        className={styles.modalInput}
                      />
                    </div>
                    <div className={styles.modalFormGroup}>
                      <label>Telefone 6</label>
                      <input
                        type="text"
                        value={leadData.tel6}
                        onChange={(e) => handleInputChange("tel6", e.target.value)}
                        disabled={!isEditMode}
                        className={styles.modalInput}
                      />
                    </div>
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Footer */}
          <div className={styles.modalEditLeadFooter}>
            {!isEditMode ? (
              <button
                onClick={handleEdit}
                className={`${styles.modalBtn} ${styles.primary}`}
              >
                {ICONS.EDIT} Editar
              </button>
            ) : (
              <>
                <button
                  onClick={handleCancel}
                  className={`${styles.modalBtn} ${styles.secondary}`}
                  disabled={loading}
                >
                  {ICONS.BACK} Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className={`${styles.modalBtn} ${styles.primary}`}
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar"}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditLead;

