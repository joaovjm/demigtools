import React, { useEffect, useState } from "react";
import "./index.css";

import { ALERT_TYPES, ICONS } from "../../constants/constants";
import FormInput from "../../components/forms/FormInput";

import MessageStatus from "../../components/MessageStatus";
import { useDonation } from "../../helper/receiveDonation";
import { getCollector } from "../../helper/getCollector";
import { ModalConfirm } from "../../components/ModalConfirm";
import FormSelect from "../../components/forms/FormSelect";
import supabase from "../../helper/superBaseClient";
import ModalReceiptSend from "../../components/modals/ModalReceiptSend";
import { DataNow } from "../../components/DataTime";

const ReceiverDonations = () => {
  const [formData, setFormData] = useState({
    collector: "",
    date: DataNow("underday"),
    search: "",
  });

  const [collectors, setCollectors] = useState([]);
  const [tableReceipt, setTableReceipt] = useState([]);
  const [alert, setAlert] = useState({ message: "", type: null, icon: null });
  const [deposit, setDeposit] = useState();
  const [sendModalOpen, setSendModalOpen] = useState(false);

  const { receiveDonation, modalOpen, setModalOpen, modalConfig } =
    useDonation();

  useEffect(() => {
    const fetchCollectors = async () => {
      try {
        const data = await getCollector();
        setCollectors(data);
      } catch (error) {
        console.error("Erro ao carregar os coletadores: ", error.message),
          setAlert({
            message: "Erro ao carregar os coletadores",
            type: ALERT_TYPES.ERROR,
            icon: ICONS.ALERT,
          });
      }
    };
    fetchCollectors();
  }, []);

  useEffect(() => {
    const fetchDeposit = async () => {
      const { data, error } = await supabase
        .from("donation")
        .select(
          "receipt_donation_id, donation_value, donation_campain, donor_id, donor: donor_id(donor_name, donor_tel_1)"
        )
        .eq("donation_deposit_receipt_send", "Não")
        .eq("collector_code_id", 22)
        .eq("donation_received", "Sim");
      if (error) throw error;
      if (!error) setDeposit(data);
    };
    fetchDeposit();
  }, [tableReceipt]);

  useEffect(() => {
    setTableReceipt([]);
  }, [formData.collector]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDataChange = (e) => {
    const value = e.target.value;
    setFormData((prev) => ({ ...prev, date: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.collector || !formData.date || !formData.search) {
      console.log("ATTENTION icon:", ICONS.ATTENTION);

      setAlert({
        message: "Preencha todos os campos",
        type: ALERT_TYPES.ATTENTION,
        icon: ICONS.ALERT,
      });

      setTimeout(() => {
        setAlert({ message: "", type: null, icon: null });
      }, 1000);

      return;
    }
    const status = await receiveDonation(
      formData.date,
      Number(formData.collector),
      formData.search,
      setTableReceipt
    );

    setFormData((prev) => ({ ...prev, search: "" }));

    if (status === "received") {
      setAlert({
        message: "Doação já recebida",
        type: ALERT_TYPES.ERROR,
        icon: ICONS.ALERT,
      });
    } else if (status === "not located") {
      setAlert({
        message: "Recibo não localizado",
        type: ALERT_TYPES.ERROR,
        icon: ICONS.ALERT,
      });
    } else if (status === "success") {
      setAlert({
        message: "Doação recebida com sucesso",
        type: ALERT_TYPES.SUCCESS,
        icon: ICONS.CONFIRMED,
      });
    }

    setTimeout(() => {
      setAlert({ message: "", type: null, icon: null });
    }, 1000);
  };

  const handleDeposit = () => {
    setSendModalOpen(true);
  };

  return (
    <main className="receiver-donations-main">
      <div className="receiver-donations-header">
        <h2 className="receiver-donations-header-title-text">
          {ICONS.MONEY} Receber Doações
        </h2>
        {deposit?.length > 0 && (
          <button onClick={handleDeposit} className="deposit-btn">
            Recibo Deposito ({deposit.length})
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="receiver-donations-form">
        <div className="input-field">
          <label>{ICONS.MOTORCYCLE}Coletador</label>
          <div style={{ display: "flex", alignItems: "center"}}>
            <select value={formData.collector} onChange={(e) => handleInputChange("collector", e.target.value)}>
              <option value="">Selecione o coletador</option>
              {collectors.map((collector) => (
                <option
                  key={collector.collector_code_id}
                  value={collector.collector_code_id}
                >
                  {collector.collector_name}
                </option>
              ))}
            </select>
            <input type="text" style={{ width: "50px" }} value={formData.collector} onChange={(e) => handleInputChange("collector", e.target.value)}/>
          </div>
        </div>

        <FormInput
          label="Data"
          className="label"
          type="date"
          value={formData.date}
          onChange={handleDataChange}
          readOnly={modalOpen}
          icon={ICONS.CALENDAR}
          classinput="form-input"
        />

        <FormInput
          label="Busca"
          className="label"
          type="text"
          value={formData.search}
          onChange={(e) => handleInputChange("search", e.target.value)}
          readOnly={modalOpen}
          icon={ICONS.SEARCH}
          classinput="form-input"
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
      {tableReceipt.length > 0 && (
        <div className="receive-donations-count">
          <label>Total Fichas: {tableReceipt.length}</label>
          <label>
            Valor Total:{" "}
            {tableReceipt
              .reduce((acc, item) => {
                return (acc += item.value);
              }, 0)
              .toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </label>
        </div>
      )}

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
              <td>
                {item.value.toLocaleString("pt-BR", {
                  style: "currency",
                  currency: "BRL",
                })}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {sendModalOpen && (
        <ModalReceiptSend
          setSendModalOpen={setSendModalOpen}
          deposit={deposit}
          setDeposit={setDeposit}
        />
      )}
    </main>
  );
};

export default ReceiverDonations;
