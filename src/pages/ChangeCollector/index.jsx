import React, { useEffect, useState } from "react";
import "./index.css";

import { getCollector } from "../../helper/getCollector";
import { changeCollector, handleReasonButtonPressed } from "../../helper/changeCollector";
import { DataNow, DataSelect } from "../../components/DataTime";
import { ALERT_TYPES, ICONS, MESSAGES } from "../../constants/constants";
import FormSelect from "../../components/forms/FormSelect";
import FormInput from "../../components/forms/FormInput";
import MessageStatus from "../../components/MessageStatus";

const ChangeCollector = () => {
  const [formData, setFormData] = useState({
    collector: "",
    date: DataNow("noformated"),
    search: "",
  });
  const [collectors, setCollectors] = useState([]);
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [openReason, setOpenReason] = useState(false);
  const [reason, setReason] = useState("");

  useEffect(() => {
    const fetchCollectors = async () => {
      try {
        const data = await getCollector();
        setCollectors(data);
      } catch (error) {
        console.error("Falha ao buscar colecadores: ", error.message);
        setAlert({
          message: "Erro ao carregar coletadores",
          type: ALERT_TYPES.ERROR,
        });
      }
    };
    fetchCollectors();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangeCollector = async (e) => {
    e.preventDefault();

    if (!formData.collector || !formData.date || !formData.search) {
      setAlert({
        message: "Preencah todos os campos",
        type: ALERT_TYPES.ERROR,
      });
      return;
    }

    try {
      const dateFormat = formData.date;
      const result = await changeCollector(
        Number(formData.collector),
        formData.search,
        dateFormat,
        setOpenReason,
      );

      let message, type;

      if (result === "Ok") {
        message = MESSAGES.COLLECTOR_SUCCESS;
        type = ALERT_TYPES.SUCCESS;
      } else if (result === "Yes") {
        (message = MESSAGES.DONATION_RECEIVED), (type = ALERT_TYPES.ERROR);
      } else {
        (message = MESSAGES.RECEIPT_NOT_FOUND), (type = ALERT_TYPES.ERROR);
      }

      setAlert({ message, type });
      setFormData((prev) => ({ ...prev, search: "" }));
    } catch (error) {
      setAlert({
        message: "Erro ao alterar o coletador",
        type: ALERT_TYPES.ERROR,
      });
    }

    {
      setTimeout(() => {
        setAlert({ message: "", type: "" });
      }, 1000);
    }

    setFormData((prev) => ({ ...prev, search: "" }));
  };

  return (
    <div className="change-collector-container">
      <div className="change-collector-content">
        <h3 className="change-collector-title">
          {ICONS.EXCHANGE} Mudar Coletador
        </h3>
        
        <form className="change-collector-form" onSubmit={handleChangeCollector}>
          <div className="change-collector-section">
            <h4>Informações da Alteração</h4>
            
            <div className="form-row">
              <div className="form-group">
                <FormSelect
                  label="Coletador"
                  icon={ICONS.MOTORCYCLE}
                  name="collector"
                  value={formData.collector}
                  options={collectors}
                  onChange={handleInputChange}
                  disableOption="Selecione o coletador..."
                />
              </div>
              
              <div className="form-group">
                <FormInput
                  label="Data"
                  icon={ICONS.CALENDAR}
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  classinput="change-collector-input"
                />
              </div>
              <div className="form-group">
                <FormInput
                  label="Buscar Recibo"
                  icon={ICONS.SEARCH}
                  type="text"
                  name="search"
                  value={formData.search}
                  onChange={handleInputChange}
                  classinput="change-collector-input"
                  placeholder="Digite para buscar o recibo..."
                />
              </div>
            </div>
          </div>

          <div className="change-collector-actions">
            <button 
              type="submit"
              className="change-collector-btn primary"
            >
              {ICONS.EXCHANGE} Alterar Coletador
            </button>
          </div>
        </form>

        {alert && (
          <div className="change-collector-alert">
            <MessageStatus
              message={alert.message}
              type={alert.type}
              icon={
                alert.type === ALERT_TYPES.SUCCESS
                  ? ICONS.CONFIRMED
                  : alert.type === ALERT_TYPES.ERROR
                  ? ICONS.ALERT
                  : null
              }
            />
          </div>
        )}

        {openReason && (
          <div className="change-collector-reason">
            <div className="reason-section">
              <h4>Motivo da Alteração</h4>
              <div className="form-group">
                <label>Descreva o motivo da alteração</label>
                <input 
                  value={reason} 
                  autoFocus={true} 
                  type="text" 
                  onChange={(e) => setReason(e.target.value)}
                  className="change-collector-input"
                  placeholder="Digite o motivo..."
                />
              </div>
              <div className="reason-actions">
                <button 
                  onClick={() => handleReasonButtonPressed(reason)} 
                  className="change-collector-btn primary"
                >
                  {ICONS.CONFIRMED} Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChangeCollector;
