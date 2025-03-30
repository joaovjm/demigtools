import React, { useEffect, useState } from "react";
import "./index.css";

import { ALERT_TYPES, ICONS } from "../../constants/constants";
import FormInput from "../../components/forms/FormInput";

import MessageStatus from "../../components/MessageStatus";
import { useDonation } from "../../helper/receiveDonation";
import { getCollector } from "../../helper/getCollector";
import { DataSelect } from "../../components/DataTime";
import { ModalConfirm } from "../../components/ModalConfirm";
import FormSelect from "../../components/forms/FormSelect";

const ReceiverDonations = () => {
  const [formData, setFormData] = useState({
    collector: "",
    date: "",
    search: ""
  });

  const [collectors, setCollectors] = useState([]);
  const [tableReceipt, setTableReceipt] = useState([]);
  const [alert, setAlert] = useState({message: "", type: null, icon: null});
  
  const { receiveDonation, modalOpen, setModalOpen, modalConfig } =
    useDonation();

    useEffect(() => {
      console.log(modalOpen)
    }, [modalOpen])
  useEffect(() => {
    const fetchCollectors = async () => {
      try {
        const data = await getCollector();
        setCollectors(data);
      } catch (error) {
        console.error("Erro ao carregar os coletadores: ", error.message),
          setAlert({
            message: "Ero ao carregar os coletadores",
            type: ALERT_TYPES.ERROR,
            icon: ICONS.ALERT
          });
      }
    };
    fetchCollectors();
  }, []);

  useEffect(() => {
    setTableReceipt([]);
  }, [formData.collector]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDataChange = (e) => {
    const value = e.target.value;
    const modifiedDate = DataSelect(value);
    setFormData((prev) => ({ ...prev, date: value, modifiedDate }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.collector || !formData.date || !formData.search) {
      console.log("ATTENTION icon:", ICONS.ATTENTION);
      
      setAlert({
        message: "Preencha todos os campos",
        type: ALERT_TYPES.ATTENTION,
        icon: ICONS.ALERT
      });
   
      setTimeout(() => {
        setAlert({message: "", type: null, icon: null})
      }, 1000);

      return;
    }
    const status = await receiveDonation(
      formData.modifiedDate,
      formData.collector,
      formData.search,
      setTableReceipt,
    );

    setFormData((prev) => ({ ...prev, search: "" }));
    
    if (status === "received"){
      setAlert({
        message: "Doação já recebida",
        type: ALERT_TYPES.ERROR,
        icon: ICONS.ALERT
      })
  
    } else if (status === "not located"){
      setAlert({
        message: "Recibo não localizado",
        type: ALERT_TYPES.ERROR,
        icon: ICONS.ALERT
      })

    } else if (status === "success"){
      setAlert({
        message: "Doação recebida com sucesso",
        type: ALERT_TYPES.SUCCESS,
        icon: ICONS.CONFIRMED
      })
    }

    setTimeout(() => {
      setAlert({message: "", type: null, icon: null})
    }, 1000);

  };

  

  return (
    <main className="receiver-donations-main">
      <div className="receiver-donations-header">
        <h2 className="receiver-donations-header-title-text">
          {ICONS.MONEY} Receber Doações
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="receiver-donations-form">
        <FormSelect
          label="Coletador"
          value={formData.collector}
          onChange={(e) => handleInputChange("collector", e.target.value)}
          disable={modalOpen}
          options={collectors}
          disableOption="Selecione o coletador..."
          icon={ICONS.MOTORCYCLE}
        />
        
        <FormInput
          label="Data"
          className="label"
          type="date"
          value={formData.date}
          onChange={handleDataChange}
          readOnly={modalOpen}
          icon={ICONS.CALENDAR}
        />

        <FormInput
          label="Busca"
          className="label"
          type="text"
          value={formData.search}
          onChange={(e) => handleInputChange("search", e.target.value)}
          readOnly={modalOpen}
          icon={ICONS.SEARCH}
        />
      </form>
      {/*MENSAGEM*/}

      {alert.message && (
        <MessageStatus
          type={alert.type}
          message={alert.message}
          icon={alert.icon}
        />
        
      )}

      {/*MODAL CONFIRM*/}
      <ModalConfirm
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
      />
      <table className="receiver-donations-table">
        {tableReceipt.length > 0 && (
          <thead className="receiver-donations-table-header">
            <tr>
              <th style={{ width: "20%" }}>Recibo</th>
              <th style={{ width: "60%" }}>Nome</th>
              <th style={{ width: "20%" }}>Valor</th>
            </tr>
          </thead>
        )}

        <tbody className="receiver-donations-table-body">
          {tableReceipt.map((item) => (
            <tr key={item.search}>
              <td>{item.search}</td>
              <td>{item.name}</td>
              <td>{item.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default ReceiverDonations;
