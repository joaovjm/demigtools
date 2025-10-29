import React, { useEffect, useState } from "react";
import styles from "./changecollector.module.css";

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
    <div className={styles.changeCollectorContainer}>
      <div className={styles.changeCollectorContent}>
        <h3 className={styles.changeCollectorTitle}>
          {ICONS.EXCHANGE} Mudar Coletador
        </h3>
        
        <form className={styles.changeCollectorForm} onSubmit={handleChangeCollector}>
          <div className={styles.changeCollectorSection}>
            <h4>Informações da Alteração</h4>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
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
              
              <div className={styles.formGroup}>
                <FormInput
                  label="Data"
                  icon={ICONS.CALENDAR}
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  classinput={styles.changeCollectorInput}
                />
              </div>
              <div className={styles.formGroup}>
                <FormInput
                  label="Buscar Recibo"
                  icon={ICONS.SEARCH}
                  type="text"
                  name="search"
                  value={formData.search}
                  onChange={handleInputChange}
                  classinput={styles.changeCollectorInput}
                  placeholder="Digite para buscar o recibo..."
                />
              </div>
            </div>
          </div>

          <div className={styles.changeCollectorActions}>
            <button 
              type="submit"
              className={`${styles.changeCollectorBtn} ${styles.primary}`}
            >
              {ICONS.EXCHANGE} Alterar Coletador
            </button>
          </div>
        </form>

        {alert && (
          <div className={styles.changeCollectorAlert}>
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
          <div className={styles.changeCollectorReason}>
            <div className={styles.reasonSection}>
              <h4>Motivo da Alteração</h4>
              <div className={styles.formGroup}>
                <label>Descreva o motivo da alteração</label>
                <input 
                  value={reason} 
                  autoFocus={true} 
                  type="text" 
                  onChange={(e) => setReason(e.target.value)}
                  className={styles.changeCollectorInput}
                  placeholder="Digite o motivo..."
                />
              </div>
              <div className={styles.reasonActions}>
                <button 
                  onClick={() => handleReasonButtonPressed(reason)} 
                  className={`${styles.changeCollectorBtn} ${styles.primary}`}
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
