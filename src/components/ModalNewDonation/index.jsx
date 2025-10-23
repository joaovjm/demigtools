import React, { useEffect, useState } from "react";
import { ICONS } from "../../constants/constants";
import FormInput from "../forms/FormInput";
import "./index.css";
import { getCampains } from "../../helper/getCampains";

const ModalNewDonation = ({ 
  isOpen, 
  onClose, 
  currentLead, 
  onSave
}) => {
  const [campains, setCampains] = useState([]);
  const fetchCampains = async () => {
    const response = await getCampains();
    setCampains(response);
  };
  useEffect(() => {
    fetchCampains();
  }, []);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    neighborhood: "",
    telSuccess: "",
    newTel2: "",
    newTel3: "",
    campain: "",
    observation: "",
    reference: "",
    dateDonation: "",
    valueDonation: ""
  });

  // Preencher campos com dados do lead quando o modal abrir
  useEffect(() => {
    if (isOpen && currentLead) {
      setFormData(prev => ({
        ...prev,
        address: currentLead.leads_address || "",
        city: currentLead.leads_city || "RIO DE JANEIRO",
        neighborhood: currentLead.leads_neighborhood || ""
      }));
    }
  }, [isOpen, currentLead]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
    // Reset form
    setFormData({
      address: "",
      city: "",
      neighborhood: "",
      telSuccess: "",
      newTel2: "",
      newTel3: "",
      campain: "",
      observation: "",
      reference: "",
      dateDonation: "",
      valueDonation: ""
    });
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setFormData({
      address: "",
      city: "",
      neighborhood: "",
      telSuccess: "",
      newTel2: "",
      newTel3: "",
      campain: "",
      observation: "",
      reference: "",
      dateDonation: "",
      valueDonation: ""
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-new-donation-overlay">
      <div className="modal-new-donation">
        <div className="modal-new-donation-content">
          {/* Header */}
          <div className="modal-new-donation-header">
            <div className="modal-title-section">
              <h3 className="modal-new-donation-title">
                {ICONS.CIRCLEOUTLINE} Nova Doação
              </h3>
              <p className="modal-subtitle">Criar nova doação para {currentLead?.leads_name}</p>
            </div>
            <button 
              className="btn-close-modal"
              onClick={handleClose}
              title="Fechar modal"
            >
              ×
            </button>
          </div>

          {/* Body */}
          <div className="modal-new-donation-body">
            <form className="modal-new-donation-form">
              {/* Endereço Section */}
              <div className="modal-form-section">
                <h4>Endereço</h4>
                <div className="modal-form-row">
                  <FormInput
                    label="Endereço"
                    value={formData.address}
                    type="text"
                    name="address"
                    onChange={(e) => handleInputChange("address", e.target.value)}
                  />
                  <FormInput
                    label="Cidade"
                    value={formData.city}
                    type="text"
                    name="city"
                    onChange={(e) => handleInputChange("city", e.target.value)}
                  />
                  <FormInput
                    label="Bairro"
                    value={formData.neighborhood}
                    type="text"
                    name="neighborhood"
                    onChange={(e) => handleInputChange("neighborhood", e.target.value)}
                  />
                </div>
              </div>

              {/* Contato Section */}
              <div className="modal-form-section">
                <h4>Contato</h4>
                <div className="modal-form-row">
                  <div className="modal-form-group">
                    <label htmlFor="telSuccess">
                      Qual telefone conseguiu contato? *
                    </label>
                    <select
                      name="telSuccess"
                      id="telSuccess"
                      value={formData.telSuccess}
                      onChange={(e) => handleInputChange("telSuccess", e.target.value)}
                      className="modal-select"
                    >
                      <option value="" disabled>
                        Selecione...
                      </option>
                      {currentLead?.leads_tel_1 && (
                        <option value={currentLead.leads_tel_1}>
                          {currentLead.leads_tel_1}
                        </option>
                      )}
                      {currentLead?.leads_tel_2 && (
                        <option value={currentLead.leads_tel_2}>
                          {currentLead.leads_tel_2}
                        </option>
                      )}
                      {currentLead?.leads_tel_3 && (
                        <option value={currentLead.leads_tel_3}>
                          {currentLead.leads_tel_3}
                        </option>
                      )}
                      {currentLead?.leads_tel_4 && (
                        <option value={currentLead.leads_tel_4}>
                          {currentLead.leads_tel_4}
                        </option>
                      )}
                      {currentLead?.leads_tel_5 && (
                        <option value={currentLead.leads_tel_5}>
                          {currentLead.leads_tel_5}
                        </option>
                      )}
                      {currentLead?.leads_tel_6 && (
                        <option value={currentLead.leads_tel_6}>
                          {currentLead.leads_tel_6}
                        </option>
                      )}
                    </select>
                  </div>
                  <FormInput
                    label="Tel. 2"
                    value={formData.newTel2}
                    type="text"
                    name="newtel2"
                    onChange={(e) => handleInputChange("newTel2", e.target.value)}
                  />
                  <FormInput
                    label="Tel. 3"
                    value={formData.newTel3}
                    type="text"
                    name="newtel3"
                    onChange={(e) => handleInputChange("newTel3", e.target.value)}
                  />
                </div>
              </div>

              {/* Doação Section */}
              <div className="modal-form-section">
                <h4>Informações da Doação</h4>
                <div className="modal-form-row compact">
                  <FormInput
                    label="Valor *"
                    value={formData.valueDonation}
                    onChange={(e) => handleInputChange("valueDonation", e.target.value)}
                  />
                  <FormInput
                    label="Data *"
                    value={formData.dateDonation}
                    type="date"
                    onChange={(e) => handleInputChange("dateDonation", e.target.value)}
                  />
                  <div className="modal-form-group">
                    <label>Campanha *</label>
                    <select
                      value={formData.campain}
                      onChange={(e) => handleInputChange("campain", e.target.value)}
                      className="modal-select"
                    >
                      <option value="" disabled>
                        Selecione...
                      </option>
                      {campains?.map((cp) => (
                        <option key={cp.id} value={cp.campain_name}>
                          {cp.campain_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Observações Section */}
              <div className="modal-form-section">
                <h4>Observações</h4>
                <div className="modal-form-row observations">
                  <div className="modal-form-group">
                    <label>Observação da Ficha</label>
                    <textarea
                      className="modal-textarea"
                      value={formData.observation}
                      onChange={(e) => handleInputChange("observation", e.target.value)}
                      placeholder="Digite observações sobre o lead..."
                    />
                  </div>
                  <div className="modal-form-group">
                    <label>Referência do Doador</label>
                    <textarea
                      className="modal-textarea"
                      value={formData.reference}
                      onChange={(e) => handleInputChange("reference", e.target.value)}
                      placeholder="Digite referências do doador..."
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="modal-new-donation-footer">
            <button
              onClick={handleClose}
              className="modal-btn secondary"
            >
              {ICONS.BACK} Voltar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="modal-btn primary"
            >
              Criar Nova doação
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalNewDonation;
