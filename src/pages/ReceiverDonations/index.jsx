import React, { useRef, useEffect, useState } from "react";
import "./index.css";

import { FaMoneyCheckDollar } from "react-icons/fa6";
import { GiConfirmed } from "react-icons/gi";
import { GoAlertFill } from "react-icons/go";
import { BiSolidErrorAlt } from "react-icons/bi";

import { useDonation } from "../../helper/receiveDonation";
import { getCollector } from "../../helper/getCollector";
import { DataSelect } from "../../assets/components/DataTime";
import { ModalConfirm } from "../../assets/components/ModalConfirm";

const ReceiverDonations = () => {
  const [collector, setCollector] = useState("");
  const [date, setDate] = useState("");
  const [modifiedDate, setModifiedDate] = useState("");
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState("");
  const [collectors, setCollectors] = useState([]);
  const [tableReceipt, setTableReceipt] = useState([]);
  const [typeAlert, setTypeAlert] = useState("");
  const [isDisable, setIsDisable] = useState(false);

  const { receiveDonation, modalOpen, setModalOpen, modalConfig } =
    useDonation();

    useEffect(() => {
      setIsDisable(modalOpen)
      
    }, [modalOpen])
    
  const handleReceiverDonations = async (e) => {
    e.preventDefault();
    await receiveDonation(
      modifiedDate,
      setMessage,
      collector,
      setTypeAlert,
      search,
      setTableReceipt
    );
    setSearch("")
  };

  useEffect(() => {
    setTableReceipt([]);
  }, [collector]);
  useEffect(() => {
    getCollector().then((data) => {
      setCollectors(data);
    });
  }, []);

  const handleDate = (e) => {
    const value = e.target.value;
    setDate(value);
    setModifiedDate(DataSelect(value));
  };

  return (
    <main className="receiver-donations-main">
      <div className="receiver-donations-header">
        <div>
          <h2 className="receiver-donations-header-title-text">
            <FaMoneyCheckDollar /> Receber Doações
          </h2>
        </div>
      </div>
      <form
        onSubmit={handleReceiverDonations}
        className="receiver-donations-form"
      >
        <div className="receiver-donations-form-input">
          <label className="label">Coletador</label>
          <select
            value={collector}
            disabled={modalOpen}
            onChange={(e) => setCollector(e.target.value)}
          >
            <option value="" disabled={isDisable}>
              Selecione o coletador...
            </option>
            {collectors?.map((item) => (
              <option
                key={item.collector_code_id}
                value={item.collector_code_id}
              >
                {item.collector_name}
              </option>
            ))}
          </select>
        </div>

        <div className="receiver-donations-form-input">
          <label className="label">Data</label>
          <input
            type="date"
            value={date}
            onChange={handleDate}
            readOnly={isDisable}
          />
        </div>

        <div className="receiver-donations-form-input">
          <label className="label">Buscar</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            readOnly={isDisable}
          />
        </div>
      </form>
      {/*MENSAGEM*/}
      <div className="receiver-donations-form-message">
        {message && (
          <div
            style={{ backgroundColor: typeAlert, width: "100%" }}
            className="receiver-donations-form-message"
          >
            <p className="receiver-donations-form-message-text">
              {message}
              {typeAlert === "green" && <GiConfirmed />}
              {typeAlert === "#940000" && <GoAlertFill />}
              {typeAlert === "#F25205" && <BiSolidErrorAlt />}
            </p>
          </div>
        )}
      </div>
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
