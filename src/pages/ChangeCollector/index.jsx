import React, { useEffect, useState } from "react";
import "./index.css";

import { getCollector } from "../../helper/getCollector";
import { changeCollector, handleReasonButtonPressed } from "../../helper/changeCollector";
import { DataSelect } from "../../components/DataTime";
import { ALERT_TYPES, ICONS, MESSAGES } from "../../constants/constants";
import FormSelect from "../../components/forms/FormSelect";
import FormInput from "../../components/forms/FormInput";
import MessageStatus from "../../components/MessageStatus";

const ChangeCollector = () => {
  const [formData, setFormData] = useState({
    collector: "",
    date: "",
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
      const dateFormat = DataSelect(formData.date);
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
    <main className="collector-main">
      <div className="collector-header">
        <div className="collector-title">
          <h2 className="collector-title-text">
            {ICONS.EXCHANGE} Mudar Coletador
          </h2>
        </div>
      </div>
      <form className="collector-form" onSubmit={handleChangeCollector}>
        {/* Coletador */}
        <FormSelect
          label="Coletador"
          icon={ICONS.MOTORCYCLE}
          name="collector"
          value={formData.collector}
          options={collectors}
          onChange={handleInputChange}
          disableOption="Selecione o coletador..."
        />
        {/* Data */}
        <FormInput
          label="Data"
          icon={ICONS.CALENDAR}
          name="date"
          type="date"
          value={formData.date}
          onChange={handleInputChange}
          classinput="form-input"
        />

        {/* Buscar */}
        <FormInput
          label="Buscar"
          icon={ICONS.SEARCH}
          type="text"
          name="search"
          value={formData.search}
          onChange={handleInputChange}
          classinput="form-input"
        />
      </form>

      {alert && (
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
      )}

      {openReason && (
        <div className="collector-reason">
          <div>
            <label className="label">Motivo</label>
            <input value={reason} autoFocus="true" type="text" onChange={(e) => setReason(e.target.value)}/>
          </div>
          <div>
            <button onClick={() => handleReasonButtonPressed(reason)} className="btn-OK">OK</button>
          </div>
        </div>
      )}
    </main>
  );
};

export default ChangeCollector;
