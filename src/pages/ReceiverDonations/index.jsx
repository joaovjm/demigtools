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
    <div className="receiver-donations-container">
      <div className="receiver-donations-content">
        <div className="receiver-donations-header">
          <h3 className="receiver-donations-title">
            {ICONS.MONEY} Receber Doações
          </h3>
          {deposit?.length > 0 && (
            <button
              onClick={handleDeposit}
              className="receiver-donations-btn secondary"
            >
              {ICONS.MONEY} Recibo Depósito ({deposit.length})
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="receiver-donations-form">
          <div className="receiver-donations-section">
            <h4>Informações do Recebimento</h4>

            <div className="form-row">
              <div className="form-group collector-group">
                <label>{ICONS.MOTORCYCLE} Coletador</label>
                <div className="collector-inputs">
                  <select
                    value={formData.collector}
                    onChange={(e) =>
                      handleInputChange("collector", e.target.value)
                    }
                    className="receiver-donations-select"
                  >
                    <option value="">Selecione o coletador...</option>
                    {collectors.map((collector) => (
                      <option
                        key={collector.collector_code_id}
                        value={collector.collector_code_id}
                      >
                        {collector.collector_name}
                      </option>
                    ))}
                  </select>
                  <input
                    type="text"
                    className="receiver-donations-input collector-code"
                    value={formData.collector}
                    onChange={(e) =>
                      handleInputChange("collector", e.target.value)
                    }
                    placeholder="Código"
                    readOnly={modalOpen}
                  />
                </div>
              </div>

              <div className="form-group">
                <FormInput
                  label="Data"
                  icon={ICONS.CALENDAR}
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleDataChange}
                  readOnly={modalOpen}
                  classinput="receiver-donations-input"
                />
              </div>
              <div className="form-group">
                <FormInput
                  label="Buscar Recibo"
                  icon={ICONS.SEARCH}
                  type="text"
                  name="search"
                  value={formData.search}
                  onChange={(e) => handleInputChange("search", e.target.value)}
                  readOnly={modalOpen}
                  classinput="receiver-donations-input"
                  placeholder="Digite o código do recibo..."
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit(e);
                  }}
                />
              </div>
              <div className="form-group-btn">
                <button
                  type="submit"
                  className="receiver-donations-btn primary"
                  disabled={
                    modalOpen ||
                    !formData.collector ||
                    !formData.date ||
                    !formData.search
                  }
                >
                  {ICONS.SEARCH} Processar
                </button>
              </div>
            </div>
          </div>
        </form>

        {/*MENSAGEM*/}
        {alert.message && (
          <div className="receiver-donations-alert">
            <MessageStatus
              type={alert.type}
              message={alert.message}
              icon={alert.icon}
            />
          </div>
        )}

        {/* SUMÁRIO DOS RECIBOS */}
        {tableReceipt.length > 0 && (
          <div className="receiver-donations-summary">
            <div className="summary-item">
              <span className="summary-label">Total de Fichas:</span>
              <span className="summary-value">{tableReceipt.length}</span>
            </div>
            <div className="summary-item">
              <span className="summary-label">Valor Total:</span>
              <span className="summary-value">
                {tableReceipt
                  .reduce((acc, item) => {
                    return (acc += item.value);
                  }, 0)
                  .toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}
              </span>
            </div>
          </div>
        )}

        {/* TABELA DE RECIBOS */}
        {tableReceipt.length > 0 && (
          <div className="receiver-donations-table-section">
            <h4>Recibos Processados</h4>
            <div className="table-container">
              <table className="receiver-donations-table">
                <thead>
                  <tr>
                    <th>Recibo</th>
                    <th>Nome do Doador</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  {tableReceipt.map((item) => (
                    <tr key={item.search}>
                      <td className="receipt-code">{item.search}</td>
                      <td className="donor-name">{item.name}</td>
                      <td className="donation-value">
                        {item.value.toLocaleString("pt-BR", {
                          style: "currency",
                          currency: "BRL",
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/*MODAL CONFIRM*/}
        <ModalConfirm
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onConfirm={modalConfig.onConfirm}
          title={modalConfig.title}
          message={modalConfig.message}
        />

        {sendModalOpen && (
          <ModalReceiptSend
            setSendModalOpen={setSendModalOpen}
            deposit={deposit}
            setDeposit={setDeposit}
          />
        )}
      </div>
    </div>
  );
};

export default ReceiverDonations;
