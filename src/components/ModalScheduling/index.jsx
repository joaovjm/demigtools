import React, { useState } from "react";
import { ICONS } from "../../constants/constants";
import FormInput from "../forms/FormInput";
import { DataNow } from "../DataTime";
import "./index.css";

const ModalScheduling = ({ 
  isOpen, 
  onClose, 
  currentLead, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    dateScheduling: "",
    telScheduling: "",
    observationScheduling: ""
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSchedulingDateChange = (e) => {
    var value = e.target.value;
    const now = DataNow("noformated");
    if (value < now) {
      value = now;
    }
    handleInputChange("dateScheduling", value);
  };

  const handleSave = () => {
    onSave(formData);
    // Reset form
    setFormData({
      dateScheduling: "",
      telScheduling: "",
      observationScheduling: ""
    });
  };

  const handleClose = () => {
    onClose();
    // Reset form
    setFormData({
      dateScheduling: "",
      telScheduling: "",
      observationScheduling: ""
    });
  };

  if (!isOpen) return null;

  return (
    <div className="modal-scheduling-overlay">
      <div className="modal-scheduling">
        <div className="modal-scheduling-content">
          {/* Header */}
          <div className="modal-scheduling-header">
            <div className="modal-title-section">
              <h3 className="modal-scheduling-title">
                {ICONS.CALENDAR} Agendamento
              </h3>
              <p className="modal-subtitle">Agendar novo contato com {currentLead?.leads_name}</p>
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
          <div className="modal-scheduling-body">
            <form className="modal-scheduling-form">
              <div className="modal-form-section">
                <h4>Informações do Agendamento</h4>
                <div className="modal-form-row">
                  <FormInput
                    label="Data *"
                    value={formData.dateScheduling}
                    onChange={handleSchedulingDateChange}
                    type="date"
                  />
                  <div className="modal-form-group">
                    <label>Telefone para contato *</label>
                    <select
                      value={formData.telScheduling}
                      onChange={(e) => handleInputChange("telScheduling", e.target.value)}
                      className="modal-select"
                    >
                      <option value="" disabled>Selecione...</option>
                      {currentLead?.leads_tel_1 && <option value={currentLead.leads_tel_1}>{currentLead.leads_tel_1}</option>}
                      {currentLead?.leads_tel_2 && <option value={currentLead.leads_tel_2}>{currentLead.leads_tel_2}</option>}
                      {currentLead?.leads_tel_3 && <option value={currentLead.leads_tel_3}>{currentLead.leads_tel_3}</option>}
                      {currentLead?.leads_tel_4 && <option value={currentLead.leads_tel_4}>{currentLead.leads_tel_4}</option>}
                      {currentLead?.leads_tel_5 && <option value={currentLead.leads_tel_5}>{currentLead.leads_tel_5}</option>}
                      {currentLead?.leads_tel_6 && <option value={currentLead.leads_tel_6}>{currentLead.leads_tel_6}</option>}
                    </select>
                  </div>
                </div>
                
                <div className="modal-form-row">
                  <div className="modal-form-group full-width">
                    <label>Observação</label>
                    <textarea
                      className="modal-textarea"
                      value={formData.observationScheduling}
                      onChange={(e) => handleInputChange("observationScheduling", e.target.value)}
                      placeholder="Digite observações sobre o agendamento..."
                    />
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className="modal-scheduling-footer">
            <button
              onClick={handleClose}
              className="modal-btn secondary"
            >
              {ICONS.BACK} Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="modal-btn primary"
            >
              Concluir Agendamento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalScheduling;
